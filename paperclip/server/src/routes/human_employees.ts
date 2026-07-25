import { Router, type Request, type Response } from "express";
import type { Db } from "@paperclipai/db";
import { humanEmployeeService } from "../services/human_employees.js";

export function humanEmployeesRouter(db: Db) {
  const router = Router({ mergeParams: true });
  const service = humanEmployeeService(db);

  router.get("/", async (req: Request, res: Response) => {
    const { companyId } = req.params as { companyId: string };
    const employees = await service.list(companyId);
    res.json(employees);
  });

  router.post("/", async (req: Request, res: Response) => {
    const { companyId } = req.params as { companyId: string };
    const body = req.body || {};
    if (!body.name || !body.email) {
      res.status(400).json({ error: "name and email are required" });
      return;
    }
    const created = await service.create({
      companyId,
      ...body,
    });
    res.status(201).json(created);
  });

  router.patch("/:id", async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const updated = await service.update(id, req.body || {});
    if (!updated) {
      res.status(404).json({ error: "Human employee not found" });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const deleted = await service.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "Human employee not found" });
      return;
    }
    res.json({ success: true, deleted });
  });

  return router;
}
