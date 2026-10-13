import { expect, test, type Page } from "@playwright/test";

/* A GitHub Pages project page is served from a subpath, so the home URL is not
   "/". Note that `page.goto("/")` would NOT work: a leading slash resolves as an
   absolute path and silently discards the base path in `baseURL`. */
const BASE_PATH = (process.env.BASE_PATH ?? "").replace(/\/$/, "");
const HOME = `${BASE_PATH}/`;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Console errors and uncaught exceptions, collected for the life of a test. */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`uncaught: ${error.message}`));

  return errors;
}

/**
 * Walks the page top to bottom. `next/image` loads below-the-fold images
 * lazily, so scrolling is the only way to make them request at all — and it
 * exercises the sticky header, which is exactly where `overflow-x: clip`
 * versus `overflow-x: hidden` on <body> makes the difference.
 */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const step = Math.round(window.innerHeight * 0.7);

    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await wait(110);
    }

    window.scrollTo(0, height);
    await wait(500);
    window.scrollTo(0, 0);
    await wait(200);
  });
}

/* -------------------------------------------------------------------------- */

test("loads the whole page with no console errors", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto(HOME, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await scrollThrough(page);
  await page.waitForLoadState("networkidle");

  expect(errors, errors.join("\n")).toEqual([]);
});

test("nothing overflows the viewport horizontally", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "networkidle" });

  const result = await page.evaluate(() => {
    const root = document.documentElement;
    const offenders: string[] = [];

    for (const element of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const rect = element.getBoundingClientRect();

      // Skip anything that is not rendered at this breakpoint.
      if (rect.width === 0 && rect.height === 0) continue;

      if (rect.right > root.clientWidth + 1 || rect.left < -1) {
        const classes = element.className?.toString().slice(0, 48) ?? "";
        offenders.push(
          `<${element.tagName.toLowerCase()} class="${classes}"> left ${Math.round(rect.left)}, right ${Math.round(rect.right)}`,
        );
      }
    }

    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      offenders: offenders.slice(0, 10),
    };
  });

  expect(result.scrollWidth, "the document must not scroll sideways").toBeLessThanOrEqual(
    result.clientWidth + 1,
  );
  expect(result.offenders, `elements past the viewport edge:\n${result.offenders.join("\n")}`).toEqual(
    [],
  );
});

test("every rendered image loads, including the lazy ones", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "load" });
  await scrollThrough(page);
  await page.waitForLoadState("networkidle");

  const broken = await page.evaluate(() => {
    const rendered = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    };

    return Array.from(document.querySelectorAll<HTMLImageElement>("img"))
      // An image hidden at this breakpoint (the menu sidebar photo below `lg`)
      // is `display: none`, has no box, and is correctly never requested.
      .filter(rendered)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src);
  });

  expect(broken, `images that failed to load:\n${broken.join("\n")}`).toEqual([]);
});

test("every asset the page references returns 200", async ({ page, request }) => {
  // This is the check that earns its keep on GitHub Pages: a wrong `basePath`
  // leaves the page rendering but every stylesheet, font and script 404s.
  await page.goto(HOME, { waitUntil: "load" });
  await scrollThrough(page);
  await page.waitForLoadState("networkidle");

  const referenced = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("img[src], script[src], link[href]"))
      .map((element) => element.getAttribute("src") ?? element.getAttribute("href") ?? "")
      // Same-origin only; skip data: URIs and absolute external links.
      .filter((url) => url.startsWith("/")),
  );

  const unique = [...new Set(referenced)];
  expect(unique.length, "the page should reference local assets").toBeGreaterThan(0);

  const failures: string[] = [];
  for (const url of unique) {
    const response = await request.get(url);
    if (response.status() !== 200) failures.push(`${response.status()} ${url}`);
  }

  expect(failures, `assets that did not return 200:\n${failures.join("\n")}`).toEqual([]);
});

test("photographs are pre-optimized WebP, and every one has alt text", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "load" });
  await scrollThrough(page);
  await page.waitForLoadState("networkidle");

  const photos = await page.evaluate(() => {
    const rendered = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    };

    return Array.from(document.querySelectorAll<HTMLImageElement>("img"))
      .filter(rendered)
      .map((image) => ({
        src: image.getAttribute("src") ?? "",
        alt: image.getAttribute("alt"),
        naturalWidth: image.naturalWidth,
        displayedWidth: Math.round(image.getBoundingClientRect().width),
      }));
  });

  expect(photos.length, "the page should render photographs").toBeGreaterThan(0);

  for (const photo of photos) {
    expect(photo.src, "photos must be the pre-encoded WebP files").toMatch(/\.webp$/);
    expect(photo.alt, "every photograph needs alt text").toBeTruthy();
    expect(photo.naturalWidth, `intrinsic width for ${photo.src}`).toBeGreaterThanOrEqual(
      photo.displayedWidth,
    );
  }
});

test("interactive targets clear the WCAG 2.2 minimum of 24 x 24", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "networkidle" });

  const undersized = await page.evaluate(() => {
    const found: string[] = [];

    for (const element of Array.from(
      document.querySelectorAll<HTMLElement>("a[href], button, summary"),
    )) {
      const rect = element.getBoundingClientRect();

      // Visually-hidden helpers (the skip link before focus, `sr-only` text)
      // are a 1x1 clipped box. They are not real targets — skip them.
      if (rect.width <= 2 && rect.height <= 2) continue;

      // WCAG 2.2 exempts targets sitting inline within a run of text.
      if (getComputedStyle(element).display === "inline") continue;

      if (rect.width < 24 || rect.height < 24) {
        found.push(
          `"${(element.textContent ?? "").trim().slice(0, 32)}" is ${Math.round(rect.width)}x${Math.round(rect.height)}`,
        );
      }
    }

    return found;
  });

  expect(undersized, `targets below the minimum:\n${undersized.join("\n")}`).toEqual([]);
});

test("structure and in-page navigation", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "networkidle" });

  await expect(page.locator("h1")).toHaveCount(1);

  const brokenAnchors = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
      .map((anchor) => anchor.getAttribute("href") ?? "")
      .map((href) => href.slice(1))
      .filter((id) => id.length > 0 && document.getElementById(id) === null),
  );

  expect(brokenAnchors, `in-page anchors with no target: ${brokenAnchors.join(", ")}`).toEqual([]);

  // The nav link must actually move the page.
  await page.locator('a[href="#menu"]').first().click();
  await expect(page.locator("#menu")).toBeInViewport();
});

test("the header sticks, and the skip link works", async ({ page }) => {
  await page.goto(HOME, { waitUntil: "networkidle" });

  const header = page.locator("header").first();
  await expect(header).toHaveCSS("position", "sticky");

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));

  const top = await header.evaluate((element) => element.getBoundingClientRect().top);
  expect(Math.abs(top), "a sticky header should stay pinned to the top").toBeLessThanOrEqual(1);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press("Tab");

  const skipLink = page.locator('a[href="#main"]');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
});
