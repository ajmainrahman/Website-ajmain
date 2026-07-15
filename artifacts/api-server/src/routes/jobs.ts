import { Router, type IRouter } from "express";
import { db, jobsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/jobs", async (_req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable).orderBy(jobsTable.displayOrder);
  res.json(jobs);
});

router.post("/jobs", requireAdmin, async (req, res): Promise<void> => {
  const { title, company, startDate, endDate, description, location, displayOrder } = req.body;
  if (!title || !company || !startDate || !description) {
    res.status(400).json({ error: "title, company, startDate, description are required" });
    return;
  }
  const [job] = await db
    .insert(jobsTable)
    .values({ title, company, startDate, endDate: endDate ?? null, description, location: location ?? null, displayOrder: displayOrder ?? 0 })
    .returning();
  res.status(201).json(job);
});

router.patch("/jobs/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { title, company, startDate, endDate, description, location, displayOrder } = req.body;
  const [job] = await db
    .update(jobsTable)
    .set({ title, company, startDate, endDate, description, location, displayOrder })
    .where(eq(jobsTable.id, id))
    .returning();
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.json(job);
});

router.delete("/jobs/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [job] = await db.delete(jobsTable).where(eq(jobsTable.id, id)).returning();
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).end();
});

export default router;
