/**
 * Minimal static file server for the exported site in `out/`.
 *
 * `next start` does not work with `output: "export"`, so this stands in for it.
 *
 * GitHub Pages serves a *project* page from `https://<user>.github.io/<repo>/`,
 * not from the domain root, so `BASE_PATH` is emulated here too: a request for
 * `/ember-and-oak/images/hero.webp` is served from `out/images/hero.webp`. That
 * makes the local preview match production exactly, and lets the Playwright
 * suite run against the real exported artefact instead of a dev server.
 *
 * No dependencies.
 *
 *   node scripts/serve-out.mjs [port]
 *
 *   BASE_PATH=/ember-and-oak node scripts/serve-out.mjs 3000
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const ROOT = resolve("out");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3000);
const BASE_PATH = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(ROOT)) {
  console.error(`No export found at ${ROOT} — run \`npm run build\` first.`);
  process.exit(1);
}

/** Map a request path to a file inside `out/`, or null if it escapes or misses. */
function resolveFile(requestUrl) {
  let pathname = decodeURIComponent(requestUrl.split("?")[0]);

  if (BASE_PATH) {
    if (pathname === BASE_PATH) pathname = "/";
    else if (pathname.startsWith(`${BASE_PATH}/`)) pathname = pathname.slice(BASE_PATH.length);
    else return null;
  }

  const target = normalize(join(ROOT, pathname));

  // Never serve anything outside the export directory. The `+ sep` matters:
  // without it, a sibling directory like `out-old` would also pass.
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;

  if (existsSync(target) && statSync(target).isFile()) return target;

  // Directory URLs (`/`, `/foo/`) resolve to their index.html.
  const index = join(target, "index.html");
  if (existsSync(index) && statSync(index).isFile()) return index;

  // `/foo` -> `/foo.html`, which is how `output: "export"` writes routes.
  const asHtml = `${target}.html`;
  if (existsSync(asHtml) && statSync(asHtml).isFile()) return asHtml;

  return null;
}

const server = createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");

  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("404");
    return;
  }

  const immutable = /[\\/]_next[\\/]/.test(file) || /[\\/]fonts[\\/]/.test(file);

  response.writeHead(200, {
    "content-type": CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": immutable
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  });

  createReadStream(file).pipe(response);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serving out/ at http://127.0.0.1:${PORT}${BASE_PATH}/`);
});
