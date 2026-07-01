import { build } from "esbuild";
import { createRequire } from "node:module";
import { execSync } from "child_process";
import { mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";

globalThis.require = createRequire(import.meta.url);

// Vercel Build Output API v3
// https://vercel.com/docs/build-output-api/v3
const OUT = ".vercel/output";

console.log("Building frontend...");
execSync('pnpm -r --filter "./artifacts/portfolio" run build', { stdio: "inherit" });

console.log("Copying static assets to .vercel/output/static ...");
mkdirSync(`${OUT}/static`, { recursive: true });
cpSync("artifacts/portfolio/dist", `${OUT}/static`, { recursive: true });

console.log("Bundling API function...");
const fnDir = `${OUT}/functions/api/index.func`;
mkdirSync(fnDir, { recursive: true });

await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: `${fnDir}/index.js`,
  // Only exclude pg-native which is an optional native addon — everything else
  // including pino, pino-http, pino-pretty must be bundled since Vercel
  // serverless functions have no node_modules at runtime.
  external: ["pg-native"],
  sourcemap: false,
});

// Fix export shape: Vercel Node runtime needs module.exports to BE the handler
const bundle = readFileSync(`${fnDir}/index.js`, "utf8");
writeFileSync(
  `${fnDir}/index.js`,
  bundle + "\nmodule.exports = module.exports.default || module.exports;\n"
);

// .vc-config.json tells Vercel this is a Node.js serverless function
writeFileSync(
  `${fnDir}/.vc-config.json`,
  JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", launcherType: "Nodejs" }, null, 2)
);

// config.json: routes for the entire deployment
writeFileSync(
  `${OUT}/config.json`,
  JSON.stringify({
    version: 3,
    routes: [
      // API: route all /api/* to the function
      { src: "^/api(/.*)?$", dest: "/api/index" },
      // SPA fallback: everything else → index.html
      { handle: "filesystem" },
      { src: "^/(?!api/).*", dest: "/index.html" }
    ]
  }, null, 2)
);

console.log("Build Output API complete");
