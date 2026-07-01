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

// Shim pino and pino-http with console-based equivalents so the bundle has
// zero native addons and zero worker-thread dependencies (both crash Vercel).
const pinoShim = `
const noop = () => {};
const logger = {
  info: (...a) => console.log('[INFO]', ...a),
  error: (...a) => console.error('[ERROR]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  debug: noop,
  trace: noop,
  fatal: (...a) => console.error('[FATAL]', ...a),
  child: () => logger,
};
module.exports = () => logger;
module.exports.default = module.exports;
`;

const pinoHttpShim = `
module.exports = () => (req, res, next) => next();
module.exports.default = module.exports;
`;

const pinoPrettyShim = `module.exports = {};`;

writeFileSync("/tmp/pino-shim.js", pinoShim);
writeFileSync("/tmp/pino-http-shim.js", pinoHttpShim);
writeFileSync("/tmp/pino-pretty-shim.js", pinoPrettyShim);

await build({
  entryPoints: ["artifacts/api-server/src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: `${fnDir}/index.js`,
  // Shim pino so it has no worker threads or native addons
  alias: {
    "pino": "/tmp/pino-shim.js",
    "pino-http": "/tmp/pino-http-shim.js",
    "pino-pretty": "/tmp/pino-pretty-shim.js",
  },
  // Only exclude the optional native pg addon
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
      // Serve static files if they exist
      { handle: "filesystem" },
      // SPA fallback: everything else → index.html
      { src: "^/.*", dest: "/index.html" }
    ]
  }, null, 2)
);

console.log("Build Output API complete");
