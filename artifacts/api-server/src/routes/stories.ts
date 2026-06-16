import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, storiesTable } from "@workspace/db";
import {
  ListStoriesResponse,
  CreateStoryBody,
  UpdateStoryParams,
  UpdateStoryBody,
  UpdateStoryResponse,
  DeleteStoryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/stories", async (_req, res): Promise<void> => {
  const stories = await db.select().from(storiesTable).orderBy(storiesTable.createdAt);
  res.json(ListStoriesResponse.parse(stories));
});

router.post("/stories", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [story] = await db.insert(storiesTable).values(parsed.data).returning();
  res.status(201).json(story);
});

router.patch("/stories/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateStoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [story] = await db
    .update(storiesTable)
    .set(parsed.data)
    .where(eq(storiesTable.id, params.data.id))
    .returning();
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.json(UpdateStoryResponse.parse(story));
});

router.delete("/stories/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteStoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [story] = await db
    .delete(storiesTable)
    .where(eq(storiesTable.id, params.data.id))
    .returning();
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
