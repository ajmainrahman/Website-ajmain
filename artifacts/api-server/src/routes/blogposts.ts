import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsResponse,
  CreateBlogPostBody,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  UpdateBlogPostResponse,
  DeleteBlogPostParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/blog-posts", async (_req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable).orderBy(blogPostsTable.createdAt);
  res.json(ListBlogPostsResponse.parse(posts));
});

router.post("/blog-posts", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
  res.status(201).json(post);
});

router.patch("/blog-posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db
    .update(blogPostsTable)
    .set(parsed.data)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(UpdateBlogPostResponse.parse(post));
});

router.delete("/blog-posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.id, params.data.id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
