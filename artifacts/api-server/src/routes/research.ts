import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, researchPapersTable } from "@workspace/db";
import {
  ListResearchPapersResponse,
  CreateResearchPaperBody,
  UpdateResearchPaperParams,
  UpdateResearchPaperBody,
  UpdateResearchPaperResponse,
  DeleteResearchPaperParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/research", async (_req, res): Promise<void> => {
  const papers = await db
    .select()
    .from(researchPapersTable)
    .orderBy(researchPapersTable.year);
  res.json(ListResearchPapersResponse.parse(papers));
});

router.post("/research", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateResearchPaperBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [paper] = await db.insert(researchPapersTable).values(parsed.data).returning();
  res.status(201).json(paper);
});

router.patch("/research/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateResearchPaperParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateResearchPaperBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [paper] = await db
    .update(researchPapersTable)
    .set(parsed.data)
    .where(eq(researchPapersTable.id, params.data.id))
    .returning();
  if (!paper) {
    res.status(404).json({ error: "Research paper not found" });
    return;
  }
  res.json(UpdateResearchPaperResponse.parse(paper));
});

router.delete("/research/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteResearchPaperParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [paper] = await db
    .delete(researchPapersTable)
    .where(eq(researchPapersTable.id, params.data.id))
    .returning();
  if (!paper) {
    res.status(404).json({ error: "Research paper not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
