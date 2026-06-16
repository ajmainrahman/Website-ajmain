import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, hobbiesTable } from "@workspace/db";
import {
  ListHobbiesResponse,
  CreateHobbyBody,
  UpdateHobbyParams,
  UpdateHobbyBody,
  UpdateHobbyResponse,
  DeleteHobbyParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/hobbies", async (_req, res): Promise<void> => {
  const hobbies = await db.select().from(hobbiesTable).orderBy(hobbiesTable.createdAt);
  res.json(ListHobbiesResponse.parse(hobbies));
});

router.post("/hobbies", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateHobbyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [hobby] = await db.insert(hobbiesTable).values(parsed.data).returning();
  res.status(201).json(hobby);
});

router.patch("/hobbies/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateHobbyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateHobbyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [hobby] = await db
    .update(hobbiesTable)
    .set(parsed.data)
    .where(eq(hobbiesTable.id, params.data.id))
    .returning();
  if (!hobby) {
    res.status(404).json({ error: "Hobby not found" });
    return;
  }
  res.json(UpdateHobbyResponse.parse(hobby));
});

router.delete("/hobbies/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteHobbyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [hobby] = await db
    .delete(hobbiesTable)
    .where(eq(hobbiesTable.id, params.data.id))
    .returning();
  if (!hobby) {
    res.status(404).json({ error: "Hobby not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
