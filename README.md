# Ember & Oak — Starter Landing Page

A bespoke, production-ready landing page for an independent wood-fired pizzeria, built to the
**Starter package** scope: one page, four sections, no CMS, no e-commerce, no backend.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `next/font` · `next/image` · Lucide icons.

---

## 1. The brief

| Field | Value |
| --- | --- |
| **Business name** | Ember & Oak |
| **Industry** | Wood-fired pizzeria |
| **Location** | 1907 South Congress Avenue, Austin, TX 78704 |
| **Target customers** | South Austin locals, nearby offices, small event hosts |
| **Primary goal** | WhatsApp inquiries (secondary: phone calls) |
| **Brand colours** | Ink `#17120F` · Paper `#F7F2E8` · Ember `#D1461C` · Crust `#E3D5BE` |
| **Existing site / social** | *Not supplied* — see §10 |

> ⚠️ **No client materials were supplied.** Every string, price, hour and image in this build is
> **placeholder content** that demonstrates the layout. Each placeholder is flagged in
> `lib/site.ts` with a `TODO(client)` comment. See §10 for the full list of what is needed.

---

## 2. Getting started

Requires **Node.js 20.9+** (built and verified on Node 24) and npm.

```bash
npm install        # install dependencies
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Static export — writes the whole site to `out/` |
| `npm run preview` | Serves `out/` locally, no Node server (see §8) |
| `npm run typecheck` | `tsc --noEmit` — no type errors |
| `npm run lint` | ESLint flat config (Next.js 16 removed `next lint`) |
| `npm run test:e2e` | Builds, then runs the Playwright smoke test at 375 / 768 / 1440px |

The smoke test needs a browser binary once:

```bash
npx playwright install chromium
```

### If `npm install` seems to hang

Next.js unpacks roughly 190 MB across ~20,000 files. **If this folder is inside OneDrive, Dropbox
or iCloud, the sync client will try to upload every one of those files as it lands**, and the
install can appear to hang for ten minutes or more. It is not stuck, just throttled.

Either pause syncing while you install, or keep the working copy outside the synced folder
(`C:\dev\...`) and open it from there. Nothing in the project depends on its location, and
`node_modules/` is gitignored — it is never part of the deliverable.

`package-lock.json` is committed, so `npm ci` will reproduce the exact dependency tree.

---

## 3. Project structure

```
.
├── app/
│   ├── globals.css        Design tokens, base styles, the four bespoke CSS details
│   ├── icon.svg           Favicon (auto-served by the App Router)
│   ├── layout.tsx         Fonts, metadata, Open Graph, JSON-LD, brand variables
│   └── page.tsx           Composes the four sections
├── components/
│   ├── site-header.tsx    Sticky header, nav, phone + WhatsApp actions
│   ├── hero.tsx           §Hero
│   ├── about.tsx          §01 About the business
│   ├── menu.tsx           §02 Products
│   ├── visit.tsx          §03 Contact / visit + closing CTA + footer
│   └── ui.tsx             SectionLabel, WhatsApp icon, buttons
├── lib/
│   ├── asset.ts           Base-path helper for photo URLs (see §8)
│   └── site.ts            ★ ALL BUSINESS CONTENT LIVES HERE
├── scripts/
│   └── serve-out.mjs      Dependency-free static server for out/
├── tests/
│   └── smoke.spec.ts      Playwright smoke test — 3 viewports, Chromium
├── public/
│   ├── .nojekyll          Stops GitHub Pages running Jekyll over _next/
│   └── images/            Pre-optimized WebP photography
├── .github/workflows/
│   └── deploy.yml         Builds, tests and publishes to GitHub Pages
├── eslint.config.mjs
├── next.config.ts
├── playwright.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## 4. Editing the content

### `lib/site.ts` — the only file you need to touch

The entire site is driven by one typed object. Change the name, the menu, the hours or the phone
number there and every section updates, including the metadata and the structured data.

```ts
export const site: Site = {
  name: "Ember & Oak",
  tagline: "Wood-fired pizza on South Congress, Austin",
  contact: {
    phone: "(512) 555-0147",     // shown to humans
    phoneHref: "+15125550147",   // tel: link
    whatsapp: "15125550147",     // wa.me — digits only, country code first, no +
    whatsappMessage: "Hi Ember & Oak — I'd like to ask about a table.",
  },
  // …
};
```

Because `Site` is a TypeScript type, deleting a required field or mistyping a key fails
`npm run typecheck` rather than producing a broken page.

**WhatsApp links are generated, never hand-written.** `whatsappHref()` builds each `wa.me` URL from
`contact.whatsapp` + a prefilled message, so a customer never meets an empty message box and the
number is stored exactly once. Three different prefilled messages are used, each at the point where
it fits the visitor's intent:

| Location | Prefilled message |
| --- | --- |
| Header | general enquiry about a table |
| Menu | "what are today's specials?" — the softest first step |
| Closing band | "I'd like to place an order" — the direct ask |

### Opening hours are stored once

Hours exist as 24-hour values only:

```ts
hours: [{ day: "Friday", opens: "15:00", closes: "24:00" }]
```

`openingLabel()` formats them for the visible table ("3:00 pm – 12:00 am") and
`openingHoursSpecification()` emits the same data as schema.org markup. The page and the SEO data
cannot drift apart. `opens: null` renders as "Closed".

### The palette

The four brand colours live in `site.brand` and are injected onto `<html>` as CSS custom properties
by `app/layout.tsx`, then mapped to Tailwind class names (`bg-ember`, `text-ink`, `border-crust`)
in `app/globals.css`. **A full rebrand is four hex values.**

### Images are pre-encoded, not resized on request

The site is exported as plain files, so there is no server to resize an image when a browser asks for
one. The photographs in `public/images/` are therefore **already optimised and committed at fixed
sizes**, and `next.config.ts` sets `images.unoptimized: true` so Next serves them untouched.

| File | Intrinsic size | Notes |
| --- | --- | --- |
| `hero.webp` | 1200 × 1500 | the LCP image, loaded eagerly |
| `dough.webp` | 1200 × 1500 | |
| `oven.webp` | 900 × 675 | |
| `menu.webp` | 900 × 675 | |
| `room.webp` | 1200 × 900 | |
| `og.jpg` | 1200 × 630 | social card — deliberately stays JPEG |

Each width is the largest that image is ever displayed at, doubled for retina. As a set they went
from **1,785 KB to 705 KB (61% smaller)**.

Two deliberate choices worth knowing:

- **WebP, not AVIF.** AVIF would save roughly another 30% (the hero would be ~146 KB instead of
  205 KB), but `<picture>` support means replacing `next/image` everywhere. AVIF-only was rejected:
  a broken hero for the few percent of visitors on older Safari is a worse trade than 60 KB.
- **`og.jpg` stays JPEG.** Social scrapers handle JPEG reliably and WebP far less so, and a broken
  link preview is invisible until someone shares the site.

**To swap in new photography, re-encode — don't just drop a JPEG in.** The filenames end in `.webp`
and `lib/site.ts` points at them by name, so a new `hero.jpg` would simply not be found. Export each
photo at the size in the table, save as WebP at quality ~72, and keep the same filename. Squoosh,
`cwebp` or any image editor will do it. Handing over JPEGs is fine — converting them is a minute's
work.

Leaving a 4 MB camera original in place would undo all of the above, so it is worth checking before
launch:

```bash
du -sh public/images
```

---

## 5. The design system

Deliberately *not* the usual template look: no purple gradients, no glassmorphism, no three-up card
grids, no oversized centred headings, no pill buttons.

**Concept.** A printed bill of fare. The page is built out of hairlines, small-caps labels and
asymmetric editorial grids — the visual language of a menu card rather than a SaaS landing page.
Each section is numbered like a course: `01 · The kitchen`, `02 · The menu`, `03 · Visit`.

### Colour — four values, one accent

| Token | Hex | Used for |
| --- | --- | --- |
| `ink` | `#17120F` | Body text, the closing band, the footer |
| `paper` | `#F7F2E8` | Page background |
| `ember` | `#D1461C` | Actions, rules, section numerals, the signature dot |
| `crust` | `#E3D5BE` | Hairlines, dividers, image wells |

Ember is used **only** for things you can act on or that carry emphasis. That restraint is what
makes the "Order on WhatsApp" button the loudest element on the page without any gradient.

### Typography — two families, clear division of labour

| Role | Family | Notes |
| --- | --- | --- |
| Display | **Instrument Serif** 400 + italic | Headlines only. Used at `clamp()` sizes, never below ~1.3rem. |
| Body / UI | **Archivo** 400 / 500 / 600 | Paragraphs, labels, buttons, prices. |

UI labels are uppercase with `0.3em` tracking at `0.66–0.72rem`. That single rule does most of the
work of making the page read as art-directed rather than assembled.

Type scale: `h1 clamp(2.6rem, 7.4vw, 5rem)` · `h2 clamp(2rem, 4.2vw, 3.15rem)` · body `1.0625rem` ·
menu descriptions `0.88rem` · labels `0.66–0.72rem`.

### Space, rules and radii

- Content column: `max-width: 1180px`, gutters `20px / 32px / 40px`.
- Section rhythm: `py-20` → `lg:py-28`.
- **Border radius is 2px on everything** — buttons, images, panels. No pills. Sharp corners are the
  single fastest way to stop a page looking like a template.
- 1px hairlines in `crust/70` separate every section, and dotted leaders run along the menu rows.

### Breakpoints

| Token | Width | What changes |
| --- | --- | --- |
| — | < 640px | Nav drops to its own full-width row; header is two rows tall |
| `sm` | 640px | Nav and actions share one row; hero image becomes landscape |
| `md` | 768px | About and Visit become two-column; the inlaid photo appears |
| `lg` | 1024px | 12-column asymmetric grids; hero image goes portrait; the menu title sticks |

---

## 6. Four bespoke details worth knowing about

1. **Menu dot leaders that actually sit on the baseline.** Each row is a three-track grid with
   `items-baseline`, and the leader is an *empty* element — which CSS resolves to its own bottom
   edge for baseline alignment. The dotted rule therefore lands exactly on the text baseline, the
   way it does in print, with no `translateY` guesswork. See `.leader` in `app/globals.css`.
2. **Inlaid photography in the About section.** The oven shot overlaps the dough shot and carries a
   6px paper border, so the two read as one composition rather than a gallery.
3. **The signature dot.** Items flagged `signature: true` in the config get a 6px ember dot before
   the name — a house-speciality marker, no extra markup required.
4. **Paper grain.** A single decorative overlay, generated from an inline SVG, adds a faint tooth to
   the background with no image request. Delete the `.grain` rule in `app/globals.css` and the
   matching `<div>` in `app/layout.tsx` for a flat surface.

---

## 7. Engineering decisions

**There is no client-side JavaScript.** Every component is a React Server Component. Things that
usually pull in a bundle are handled differently:

| Usually | Here |
| --- | --- |
| Hamburger menu + state | The nav is one `<nav>` that wraps onto its own row below `sm` |
| `IntersectionObserver` scroll reveals | A staggered CSS `rise` animation on the hero only. Scroll reveals were cut deliberately: they cost JavaScript for very little, and the design carries itself on typography and whitespace. |
| `position: sticky` from a scroll listener | Native `position: sticky` for the header and the menu title block |
| JS "open now" indicator | Omitted. It requires the visitor's clock to be correct and is wrong for anyone travelling. The hours table is authoritative. |
| Framer Motion | Nothing. Hover and entrance transitions are CSS. |

**Accessibility.** Semantic landmarks (`header` / `main` / `section` / `footer`), one `h1`, ordered
headings, a skip link, visible `:focus-visible` rings in ember, `sr-only` text on icon-only links
and on off-site links that open a new tab, `aria-label` on every `<nav>`, `aria-hidden` on
decorative SVG, an `<address>` element for the address, a `<dl>` for opening hours, and full
`prefers-reduced-motion` support.

**Performance.** Fonts are self-hosted by `next/font` — no render-blocking request to Google and no
layout shift. Images go through `next/image` with explicit `sizes`, AVIF/WebP output and `priority`
on the hero. `overflow-x: clip` on `body` prevents any horizontal scroll from the negative offset of
the inlaid About photo. It is `clip` rather than `hidden` deliberately: `hidden` turns the element
into a scroll container, which silently kills `position: sticky` on everything inside it — including
the header and the menu title block.

**Verification.** `npm run test:e2e` runs a Playwright smoke test in Chromium at 375 / 768 / 1440px,
covering console errors, horizontal overflow, images that failed to load, a correctly parsed
`srcset`, WCAG 2.2 target sizes, the sticky header and the skip link. Chromium only, on purpose —
adding WebKit and Firefox would triple the browser download to re-check a page that ships no
client-side JavaScript.

**SEO.** Metadata, canonical URL, Open Graph and Twitter cards, a 1200×630 OG image, and
`Restaurant` JSON-LD (address, phone, email, opening hours) all generated from `lib/site.ts`.

---

## 8. Deployment — GitHub Pages

The live site is **https://emartsantos.github.io/ember-and-oak/**.

`next.config.ts` sets `output: "export"`, so `npm run build` writes a complete static site to `out/`.
`.github/workflows/deploy.yml` fires on every push to `main`, and runs: install → typecheck → lint →
build → smoke test → publish `out/` to Pages. A red test blocks the deploy.

### The one non-obvious detail

A GitHub Pages *project* page is served from a **subpath** (`/<repo>/`), never the domain root. So
the workflow sets:

```bash
BASE_PATH=/ember-and-oak
```

which `next.config.ts` turns into `basePath`. Get this wrong and the HTML still loads while every
stylesheet, font and script 404s — which looks like a broken build rather than a config mistake.

`next/image` needs help here. With `images.unoptimized: true` it applies `basePath` to the `/_next/…`
assets it generates itself but **not** to `<img>` sources, so a photo declared as `/images/hero.webp`
works perfectly in local development and then 404s in production. That is why photo paths go through
`asset()` in `lib/asset.ts`. The "every asset the page references returns 200" test exists purely to
catch a regression in this.

### Local preview

```bash
npm run build
npm run preview                            # http://127.0.0.1:3000
BASE_PATH=/ember-and-oak npm run preview    # emulates the deployed subpath
```

`scripts/serve-out.mjs` is a dependency-free static server, because `next start` does not work with
`output: "export"`.

### Pushing a change

```bash
git add -A
git commit -m "Update the menu"
git push
```

The workflow redeploys in about two minutes. Watch it under the repository's **Actions** tab. Pages
must be set to **Source: GitHub Actions** once, under Settings → Pages — the workflow cannot switch
that on itself.

### Alternatives

- **Vercel** — remove `output: "export"`, `images: { unoptimized: true }` and `basePath`, then
  import the repo at [vercel.com/new](https://vercel.com/new). You get the server-side image
  optimiser back (AVIF/WebP on demand, per-device sizing) for roughly another 30% off the
  photography, and a deploy preview per pull request. Free at this traffic level.
- **Any static host** — Netlify, Cloudflare Pages and S3 all serve `out/` directly. Only set
  `BASE_PATH` if you are hosting under a subpath.

**Before going live:** confirm `site.url` in `lib/site.ts` (it drives the canonical URL, the Open
Graph tags and the JSON-LD `@id` — it currently points at the Pages URL), and set
`usingPlaceholderPhotography: false` once real photography is in place.

---

## 9. Scope — what is deliberately not here

Per the Starter package:

- No CMS, admin dashboard or database
- No e-commerce or checkout
- No booking/reservation system (the WhatsApp deep link is the booking mechanism)
- No contact form (a form needs a backend, spam handling and a reply SLA — a phone call converts faster)
- No additional pages, blog or news section
- No analytics or cookie banner
- No reviews/testimonials section — the brief forbids invented testimonials, and no verified reviews
  were supplied. If the client has real Google reviews to embed, that is a small paid addition.

---

## 10. Client materials still required

Nothing was supplied for this build, so **everything below must be confirmed before launch.**

**Facts to confirm** *(all currently placeholders in `lib/site.ts`)*

1. **Trading name** and any legal entity name for the footer.
2. **Live domain** — needed for the canonical URL and Open Graph.
3. **Full address** as it should be printed, plus a Google Maps place link.
4. **Phone number** — confirm this is the number that actually gets answered.
5. **WhatsApp number.** ⚠️ Is it the same as the phone number, or a separate WhatsApp Business
   account? If separate, both `contact.whatsapp` and `contact.phoneHref` change.
6. **Email address** that a human monitors.
7. **Social profiles** — `contact.social` is currently an empty array, so no social links render.
   Supply the Instagram / Facebook URLs.
8. **Opening hours**, including public holidays and any seasonal closures.
9. **Dietary and allergen policy.** The menu uses `V` / `VG` / `GF` tags. Confirm what the kitchen
   can genuinely promise about cross-contamination — this has legal weight, particularly for coeliac
   customers. Confirm the gluten-free upcharge.
10. **Booking and catering policy** — minimum spend, lead time, deposit, maximum headcount.
11. **Parking and accessibility** details for the "Good to know" list.

**Content to write or approve**

12. **The real menu** — items, descriptions and prices. The twelve pies here are invented to show
    the layout.
13. **Brand copy** — headline, About paragraphs, the pull quote and its attribution. The pull quote
    currently says "The kitchen" because attributing it to a person would be inventing a claim.
14. **A colour decision.** The palette is a plausible pizzeria identity, not an extracted brand
    palette — no logo or existing site was supplied to sample from. Confirm or supply brand colours.

**Assets**

15. **Photography — 5–6 images minimum**, ideally shot on one visit:
    - Hero: portrait, `1400 × 1750`, a finished pizza or the oven in use, leaving headroom for type
    - About 1: portrait, `1200 × 1500`, hands at work / dough
    - About 2: landscape, `1200 × 900`, the oven
    - Menu: landscape, `1200 × 1200` or square, a signature pie from above
    - Visit: portrait, `1200 × 900`+, the room
    - OG image: `1200 × 630`, used for link previews

    Images should be supplied at these dimensions or larger, in focus, and **with permission for any
    staff or customers who are identifiable.** The current images are licensed placeholders from
    Unsplash and do not depict this business's premises or food. The page shows a visible note to
    that effect, controlled by `site.usingPlaceholderPhotography`.

16. **Logo**, as SVG or EPS, if the plain text wordmark should be replaced.

**Nice to have**

17. Analytics or Google Tag Manager ID, if the client wants traffic reporting.
18. Confirmation of whether takeaway ordering stays on WhatsApp or should point to a third-party
    platform (Deliveroo, Toast, etc.).

---

## 11. Verification

Run before every handover:

```bash
npm run typecheck && npm run lint && npm run test:e2e
```

`test:e2e` builds first, then runs the Playwright smoke test against the exported `out/` directory.
Set `BASE_PATH` to check the deployed subpath configuration as well. The results for this delivery
are recorded in §12 below.

---

## 12. Verified on this build

Recorded on the delivered source, Node 24.13.0, npm 11.12.0, Windows. Everything below was run
against the source exactly as delivered.

### Static checks

| Check | Command | Result |
| --- | --- | --- |
| Types | `npm run typecheck` | **Clean** — `tsc --noEmit`, no output |
| Lint | `npm run lint` | **Clean** — `eslint .`, no errors, no warnings |
| Build | `npm run build` | **Succeeded** — static export written to `out/` |

Build output — every route is static:

```
Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /icon.svg

○  (Static)  prerendered as static content
```

### Browser checks — `npm run test:e2e`

Playwright, Chromium, three viewports (375 / 768 / 1440). These run against the **exported `out/`
directory**, not a dev server, because the export is what actually deploys.

Both configurations were checked, because they genuinely differ:

| Check | `BASE_PATH=/ember-and-oak` | no base path |
| --- | --- | --- |
| Loads and scrolls the whole page with no console errors | Pass | Pass |
| Nothing overflows the viewport horizontally | Pass | Pass |
| Every rendered image loads, lazy ones included | Pass | Pass |
| **Every asset the page references returns 200** | Pass | Pass |
| Photographs are the pre-encoded WebP files, all with alt text | Pass | Pass |
| Interactive targets clear the WCAG 2.2 minimum of 24 × 24 px | Pass | Pass |
| One `h1`, every in-page anchor resolves, and the nav moves the page | Pass | Pass |
| Header stays pinned while scrolling, and the skip link focuses and shows | Pass | Pass |
| **Total** | **24 passed** | **24 passed** |

Two of these earn their place:

- **"Every asset the page references returns 200"** is the check that matters most on GitHub Pages.
  A wrong `basePath` leaves the page rendering with every stylesheet, font and script 404ing — a
  failure that is obvious in a browser but invisible to `next build`.
- **The target-size check** caught real defects: several text-style links were only ~18–22 px tall,
  below the WCAG 2.2 minimum. They now carry `min-h-6`, which the underline styling hides. Worth
  knowing if you restyle those links.

Two further things checked by hand:

| Check | Result |
| --- | --- |
| `.nojekyll` reaches `out/` | Yes — `public/.nojekyll` is copied through, and the workflow also `touch`es it |
| Canonical / `og:url` / `og:image` under the subpath | `https://emartsantos.github.io/ember-and-oak/…` — correct, no dropped `/ember-and-oak` |
| `"use client"` modules in the source | **0** — no application JavaScript is shipped |
| `TODO(client)` strings leaked into the markup | 0 |

### Payload

Measured on the exported `out/` directory, gzipped as a host would serve it:

| Asset | Size |
| --- | --- |
| Photography, all six files | **705 KB** total (was 1,785 KB — 61% smaller) |
| Hero — the only image loaded up front | 205 KB |
| HTML | 16 KB |
| CSS | 6 KB |
| JavaScript | 177 KB |
| Fonts, the preloaded subset | ~83 KB across 3 files |

### One honest caveat about that 177 KB

**None of it is our code** — the page has zero client components. It is React 19 plus the App
Router's client runtime and router, which Next ships and hydrates on every App Router page. It is
the cost of the mandated stack, not of this page.

Static export does **not** remove it. `output: "export"` changes how the page is *rendered*, not how
it is hydrated, so a page with no interactivity still pays for the full runtime.

If that cost is unacceptable, the same design can be shipped as hand-written HTML and CSS for
effectively **0 KB of JavaScript** — but that is a different stack and would be a separate quote.

### What was not verified

Everything above runs in **Chromium at emulated viewports**, which is not the same as a real phone.
iOS Safari and Android Chrome on a mid-range handset each have their own font metrics, viewport
quirks and sticky behaviour. The risk here is low — the page uses no `backdrop-filter`, no `:has()`
for layout and no container queries, and it ships no JavaScript to go wrong — but ten minutes on the
client's own phone is still the right last step before launch.

There is also no automated **visual** regression check. The smoke test asserts behaviour and
geometry, not appearance; nothing will fail if a colour or a font weight is changed by accident.

### Formatting note

`next build` rewrites `tsconfig.json` on first run (`jsx` → `react-jsx`, and
`.next/dev/types/**/*.ts` added to `include`). Those changes are already applied, so a fresh clone
builds without the rewrite.

---

## 13. Licence

Project code: provided to the client for this engagement.
Photography in `public/images/`: [Unsplash Licence](https://unsplash.com/license) — **must be
replaced** with client-owned imagery before launch (§10.15).
Fonts: Instrument Serif and Archivo, both SIL Open Font License.
