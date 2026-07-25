import { Router, type Request, type Response } from "express";
import type { Db } from "@paperclipai/db";
import { virtualWorkspaceService } from "../services/virtual_workspaces.js";
import {
  createVirtualWorkspaceSchema,
  updateVirtualWorkspaceSchema,
  updateMemberPresenceSchema,
} from "@paperclipai/shared";

export function virtualWorkspacesRouter(db: Db) {
  const router = Router({ mergeParams: true });
  const service = virtualWorkspaceService(db);

  // GET /companies/:companyId/virtual-workspaces
  router.get("/", async (req: Request, res: Response) => {
    const { companyId } = req.params as { companyId: string };
    const workspaces = await service.listWorkspaces(companyId);
    res.json(workspaces);
  });

  // POST /companies/:companyId/virtual-workspaces
  router.post("/", async (req: Request, res: Response) => {
    const { companyId } = req.params as { companyId: string };
    const parsed = createVirtualWorkspaceSchema.safeParse(req.body || {});
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request payload", details: parsed.error.format() });
      return;
    }

    const created = await service.createWorkspace(companyId, parsed.data);
    res.status(201).json(created);
  });

  // GET /companies/:companyId/virtual-workspaces/:workspaceId
  router.get("/:workspaceId", async (req: Request, res: Response) => {
    const { companyId, workspaceId } = req.params as { companyId: string; workspaceId: string };
    const workspace = await service.getWorkspace(companyId, workspaceId);
    if (!workspace) {
      res.status(404).json({ error: "Virtual workspace not found" });
      return;
    }
    res.json(workspace);
  });

  // PATCH /companies/:companyId/virtual-workspaces/:workspaceId
  router.patch("/:workspaceId", async (req: Request, res: Response) => {
    const { companyId, workspaceId } = req.params as { companyId: string; workspaceId: string };
    const parsed = updateVirtualWorkspaceSchema.safeParse(req.body || {});
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request payload", details: parsed.error.format() });
      return;
    }

    const updated = await service.updateWorkspace(companyId, workspaceId, parsed.data);
    if (!updated) {
      res.status(404).json({ error: "Virtual workspace not found" });
      return;
    }
    res.json(updated);
  });

  // DELETE /companies/:companyId/virtual-workspaces/:workspaceId
  router.delete("/:workspaceId", async (req: Request, res: Response) => {
    const { companyId, workspaceId } = req.params as { companyId: string; workspaceId: string };
    const deleted = await service.deleteWorkspace(companyId, workspaceId);
    if (!deleted) {
      res.status(404).json({ error: "Virtual workspace not found" });
      return;
    }
    res.json({ success: true, deleted });
  });

  // GET /companies/:companyId/virtual-workspaces/:workspaceId/presence
  router.get("/:workspaceId/presence", async (req: Request, res: Response) => {
    const { companyId, workspaceId } = req.params as { companyId: string; workspaceId: string };
    const workspace = await service.getWorkspace(companyId, workspaceId);
    if (!workspace) {
      res.status(404).json({ error: "Virtual workspace not found" });
      return;
    }

    await service.sweepStalePresence(companyId, workspace.id);
    const presenceList = await service.getWorkspacePresence(companyId, workspace.id);
    res.json(presenceList);
  });

  // POST /companies/:companyId/virtual-workspaces/:workspaceId/presence
  router.post("/:workspaceId/presence", async (req: Request, res: Response) => {
    const { companyId, workspaceId } = req.params as { companyId: string; workspaceId: string };
    const workspace = await service.getWorkspace(companyId, workspaceId);
    if (!workspace) {
      res.status(404).json({ error: "Virtual workspace not found" });
      return;
    }

    const parsed = updateMemberPresenceSchema.safeParse(req.body || {});
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid presence payload", details: parsed.error.format() });
      return;
    }

    const updated = await service.upsertMemberPresence(companyId, workspace.id, parsed.data);
    res.json(updated);
  });

  // DELETE /companies/:companyId/virtual-workspaces/:workspaceId/presence/:memberType/:memberId
  router.delete(
    "/:workspaceId/presence/:memberType/:memberId",
    async (req: Request, res: Response) => {
      const { companyId, workspaceId, memberType, memberId } = req.params as {
        companyId: string;
        workspaceId: string;
        memberType: string;
        memberId: string;
      };

      const workspace = await service.getWorkspace(companyId, workspaceId);
      if (!workspace) {
        res.status(404).json({ error: "Virtual workspace not found" });
        return;
      }

      const removed = await service.removeMemberPresence(companyId, workspace.id, memberType, memberId);
      if (!removed) {
        res.status(404).json({ error: "Presence record not found" });
        return;
      }
      res.json({ success: true, removed });
    }
  );

  return router;
}
