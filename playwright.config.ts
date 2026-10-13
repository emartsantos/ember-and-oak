import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;

/**
 * A project page is served from `https://<user>.github.io/<repo>/`, not the
 * domain root, so `BASE_PATH` shifts both the preview server and the base URL
 * to match production. The deploy workflow sets it; local runs leave it unset.
 */
const BASE_PATH = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

/**
 * A small end-to-end smoke test — three viewports, one browser.
 *
 * It exists to check the things a build cannot: that the page throws no console
 * errors, that nothing overflows sideways, that every image and asset the markup
 * asks for actually resolves, and that the targets are big enough to tap.
 *
 * It runs against the exported `out/` directory, because with
 * `output: "export"` there is no `next start` — and testing the exported
 * artefact is the point: it is what gets deployed.
 *
 * Chromium only, deliberately. Installing WebKit and Firefox as well would
 * triple the browser download for a page with no client-side JavaScript.
 *
 * Run with `npm run test:e2e` (which builds first).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}${BASE_PATH}`,
    trace: "retain-on-failure",
  },
  webServer: {
    // Serves `out/`, emulating GitHub Pages including the base path.
    // `npm run test:e2e` builds before invoking Playwright.
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}${BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
