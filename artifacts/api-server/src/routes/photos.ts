import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, photosTable } from "@workspace/db";
import {
  ListPhotosResponse,
  CreatePhotoBody,
  UpdatePhotoParams,
  UpdatePhotoBody,
  UpdatePhotoResponse,
  DeletePhotoParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/photos", async (_req, res): Promise<void> => {
  const photos = await db.select().from(photosTable).orderBy(photosTable.createdAt);
  res.json(ListPhotosResponse.parse(photos));
});

router.post("/photos", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [photo] = await db.insert(photosTable).values(parsed.data).returning();
  res.status(201).json(photo);
});

router.patch("/photos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [photo] = await db
    .update(photosTable)
    .set(parsed.data)
    .where(eq(photosTable.id, params.data.id))
    .returning();
  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json(UpdatePhotoResponse.parse(photo));
});

router.delete("/photos/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeletePhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [photo] = await db
    .delete(photosTable)
    .where(eq(photosTable.id, params.data.id))
    .returning();
  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
