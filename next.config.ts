import type { NextConfig } from "next";

/**
 * This site is deployed to GitHub Pages, which serves static files and nothing
 * else — so `next build` exports a complete site to `out/` instead of producing
 * a Node server.
 *
 * `BASE_PATH` is set by the deploy workflow to `/<repo-name>`, because a project
 * page lives at `https://<user>.github.io/<repo>/` rather than at the domain
 * root. Leave it unset for local development.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Emit a fully static site into `out/`.
  output: "export",

  // Required by `output: "export"`: with no server there is nothing to resize
  // images on request, so the files in /public are served as-is. That is why the
  // photography is pre-encoded to compressed WebP at fixed sizes — see README §4.
  images: { unoptimized: true },

  basePath,
};

export default nextConfig;
