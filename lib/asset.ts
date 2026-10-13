/**
 * Deployment-aware path helper.
 *
 * A GitHub Pages *project* page is served from `https://<user>.github.io/<repo>/`
 * rather than the domain root, so `next.config.ts` sets `basePath` from the
 * `BASE_PATH` environment variable.
 *
 * Next.js applies `basePath` to everything it generates itself — the `/_next/…`
 * chunks, fonts, the favicon — but **not** to `<img>` sources when
 * `images.unoptimized` is on. So a photo declared as `/images/hero.webp` renders
 * as a root-absolute URL, works perfectly in local development, and then 404s in
 * production. `asset()` closes that gap.
 *
 * `BASE_PATH` is empty by default, which is what local development and a
 * root-domain deployment both want.
 */
export const BASE_PATH = process.env.BASE_PATH ?? "";

/** Prefix a path in `/public` with the deployment base path. */
export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
