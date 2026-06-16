import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, certificatesTable } from "@workspace/db";
import {
  ListCertificatesResponse,
  CreateCertificateBody,
  UpdateCertificateParams,
  UpdateCertificateBody,
  UpdateCertificateResponse,
  DeleteCertificateParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/certificates", async (_req, res): Promise<void> => {
  const certs = await db.select().from(certificatesTable).orderBy(certificatesTable.createdAt);
  res.json(ListCertificatesResponse.parse(certs));
});

router.post("/certificates", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCertificateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [cert] = await db.insert(certificatesTable).values(parsed.data).returning();
  res.status(201).json(cert);
});

router.patch("/certificates/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCertificateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [cert] = await db
    .update(certificatesTable)
    .set(parsed.data)
    .where(eq(certificatesTable.id, params.data.id))
    .returning();
  if (!cert) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }
  res.json(UpdateCertificateResponse.parse(cert));
});

router.delete("/certificates/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteCertificateParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cert] = await db
    .delete(certificatesTable)
    .where(eq(certificatesTable.id, params.data.id))
    .returning();
  if (!cert) {
    res.status(404).json({ error: "Certificate not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
