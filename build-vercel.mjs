import { build } from "esbuild";
import { createRequire } from "node:module";
import { execSync } from "child_process";
import { mkdirSync, readFileSync, appendFileSync } from "fs";

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

const bundle = readFileSync("api/index.js", "utf8");
const hasExport = bundle.includes("module.exports");
console.log(hasExport ? "module.exports found" : "WARNING: no module.exports!");

appendFileSync("api/index.js", "\nmodule.exports = module.exports.default || module.exports;\n");

console.log("Bundle complete");
