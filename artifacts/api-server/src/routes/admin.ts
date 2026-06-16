import { Router, type IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse, AdminLogoutResponse, AdminMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || parsed.data.password !== adminPassword) {
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
