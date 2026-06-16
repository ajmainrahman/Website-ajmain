import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, educationTable } from "@workspace/db";
import {
  ListEducationResponse,
  CreateEducationBody,
  UpdateEducationParams,
  UpdateEducationBody,
  UpdateEducationResponse,
  DeleteEducationParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/education", async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(educationTable)
    .orderBy(educationTable.startYear);
  res.json(ListEducationResponse.parse(entries));
});

router.post("/education", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateEducationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [entry] = await db.insert(educationTable).values(parsed.data).returning();
  res.status(201).json(entry);
});

router.patch("/education/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateEducationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEducationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [entry] = await db
    .update(educationTable)
    .set(parsed.data)
    .where(eq(educationTable.id, params.data.id))
    .returning();
  if (!entry) {
    res.status(404).json({ error: "Education entry not found" });
    return;
  }
  res.json(UpdateEducationResponse.parse(entry));
});

router.delete("/education/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteEducationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [entry] = await db
    .delete(educationTable)
    .where(eq(educationTable.id, params.data.id))
    .returning();
  if (!entry) {
    res.status(404).json({ error: "Education entry not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
