import { build } from "esbuild";
import { createRequire } from "node:module";
import { execSync } from "child_process";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

globalThis.require = createRequire(import.meta.url);

console.log("Building frontend...");
execSync('pnpm -r --filter "./artifacts/portfolio" run build', { stdio: "inherit" });

console.log("Bundling API for Vercel...");
mkdirSync("api", { recursive: true });

await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: "api/index.js",
  external: ["pg-native", "pino", "pino-pretty", "pino-http", "thread-stream"],
  sourcemap: false,
});

// Fix the export shape: esbuild's CJS output for `export default app`
// produces exports.default = app, but Vercel's Node runtime needs
// module.exports itself to BE the request handler (an Express app counts).
const bundle = readFileSync("api/index.js", "utf8");
writeFileSync(
  "api/index.js",
  bundle + "\nmodule.exports = module.exports.default || module.exports;\n"
);

console.log("Bundle complete");
