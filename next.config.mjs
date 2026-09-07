/**
 * Kept as .mjs rather than .ts on purpose: Next 15 transpiles a TypeScript
 * config at startup, and on this setup that step rewrites
 * .next/server/webpack-runtime.js after the build has finished, leaving it
 * pointing at chunk paths that no longer exist ("Cannot find module ./585.js"
 * from pages/_document). There is no config to express here anyway.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {};

export default nextConfig;
