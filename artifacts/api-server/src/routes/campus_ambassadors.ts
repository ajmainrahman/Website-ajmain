import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, campusAmbassadorsTable } from "@workspace/db";
import {
  ListCampusAmbassadorsResponse,
  CreateCampusAmbassadorBody,
  UpdateCampusAmbassadorParams,
  UpdateCampusAmbassadorBody,
  UpdateCampusAmbassadorResponse,
  DeleteCampusAmbassadorParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/campus-ambassadors", async (_req, res): Promise<void> => {
  const items = await db.select().from(campusAmbassadorsTable).orderBy(campusAmbassadorsTable.createdAt);
  res.json(ListCampusAmbassadorsResponse.parse(items));
});

router.post("/campus-ambassadors", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCampusAmbassadorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(campusAmbassadorsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.patch("/campus-ambassadors/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateCampusAmbassadorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCampusAmbassadorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(campusAmbassadorsTable)
    .set(parsed.data)
    .where(eq(campusAmbassadorsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Campus ambassador not found" });
    return;
  }
  res.json(UpdateCampusAmbassadorResponse.parse(item));
});

router.delete("/campus-ambassadors/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteCampusAmbassadorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db
    .delete(campusAmbassadorsTable)
    .where(eq(campusAmbassadorsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Campus ambassador not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
