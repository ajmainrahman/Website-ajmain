import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { timingSafeEqual } from "node:crypto";
import { AdminLoginBody, AdminLoginResponse, AdminLogoutResponse, AdminMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

router.post("/admin/login", loginLimiter, async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !safeCompare(parsed.data.password, adminPassword)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  req.session.isAdmin = true;
  res.json(AdminLoginResponse.parse({ message: "Login successful" }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json(AdminLogoutResponse.parse({ message: "Logged out" }));
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  res.json(AdminMeResponse.parse({ authenticated: !!req.session.isAdmin }));
});

export default router;
