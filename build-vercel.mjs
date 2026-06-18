import { execSync } from "child_process";

console.log("Building frontend...");
execSync('pnpm -r --filter "./artifacts/portfolio" run build', { stdio: "inherit" });

console.log("Frontend build complete. API is built independently by Vercel from api/index.ts.");
