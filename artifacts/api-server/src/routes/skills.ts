import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, skillsTable } from "@workspace/db";
import {
  ListSkillsResponse,
  CreateSkillBody,
  UpdateSkillParams,
  UpdateSkillBody,
  UpdateSkillResponse,
  DeleteSkillParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/skills", async (_req, res): Promise<void> => {
  const skills = await db.select().from(skillsTable).orderBy(skillsTable.createdAt);
  res.json(ListSkillsResponse.parse(skills));
});

router.post("/skills", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [skill] = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(skill);
});

router.patch("/skills/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [skill] = await db
    .update(skillsTable)
    .set(parsed.data)
    .where(eq(skillsTable.id, params.data.id))
    .returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.json(UpdateSkillResponse.parse(skill));
});

router.delete("/skills/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [skill] = await db
    .delete(skillsTable)
    .where(eq(skillsTable.id, params.data.id))
    .returning();
  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
