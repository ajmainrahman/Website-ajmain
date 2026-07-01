import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";

// Warn loudly when SESSION_SECRET is missing — sessions will work but be signed
// with a fixed dev-only fallback, meaning admin cookies are insecure.
const sessionSecret = process.env.SESSION_SECRET;
if (isProduction && !sessionSecret) {
  // eslint-disable-next-line no-console
  console.error(
    "[SECURITY] SESSION_SECRET env var is not set. Admin sessions are signed with an insecure fallback. Set SESSION_SECRET in your deployment environment immediately."
  );
}

// Comma-separated list of allowed origins, e.g. "https://moshfiqurrahman-ajmain.vercel.app"
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser requests (no Origin header) and anything in the whitelist.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: sessionSecret ?? "portfolio-secret-fallback-dev-only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/api", router);

export default app;
