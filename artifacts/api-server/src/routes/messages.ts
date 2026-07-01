import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import rateLimit from "express-rate-limit";
import { eq } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const CreateMessageBody = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

// Basic abuse protection on the public contact form endpoint.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

// Public: submit a contact form message.
router.post("/contact-messages", contactLimiter, async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [saved] = await db.insert(messagesTable).values(parsed.data).returning();
  res.status(201).json({ id: saved?.id, message: "Message sent" });
});

// Admin: list all contact messages.
router.get("/contact-messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db.select().from(messagesTable).orderBy(messagesTable.createdAt);
  res.json(messages);
});

// Admin: mark a message as read.
router.patch("/contact-messages/:id/read", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [updated] = await db
    .update(messagesTable)
    .set({ read: true })
    .where(eq(messagesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(updated);
});

export default router;
