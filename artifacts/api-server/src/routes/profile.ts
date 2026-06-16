import { Router, type IRouter } from "express";
import { db, profileTable } from "@workspace/db";
import { GetProfileResponse, UpdateProfileBody, UpdateProfileResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  let [profile] = await db.select().from(profileTable).limit(1);
  if (!profile) {
    [profile] = await db
      .insert(profileTable)
      .values({ name: "Moshfiqur Rahman Ajmain", tagline: "Building AI that understands both data and people." })
      .returning();
  }
  res.json(GetProfileResponse.parse(profile));
});

router.patch("/profile", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let [profile] = await db.select().from(profileTable).limit(1);
  if (!profile) {
    [profile] = await db
      .insert(profileTable)
      .values({ name: "Moshfiqur Rahman Ajmain", tagline: "Building AI that understands both data and people." })
      .returning();
  }

  const { eq } = await import("drizzle-orm");
  const [updated] = await db
    .update(profileTable)
    .set(parsed.data)
    .where(eq(profileTable.id, profile.id))
    .returning();

  res.json(UpdateProfileResponse.parse(updated));
});

export default router;
