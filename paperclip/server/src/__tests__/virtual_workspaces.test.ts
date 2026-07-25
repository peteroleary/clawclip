import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockVirtualWorkspaceService = vi.hoisted(() => ({
  listWorkspaces: vi.fn(),
  getWorkspace: vi.fn(),
  createWorkspace: vi.fn(),
  updateWorkspace: vi.fn(),
  deleteWorkspace: vi.fn(),
  ensureDefaultWorkspace: vi.fn(),
  getWorkspacePresence: vi.fn(),
  upsertMemberPresence: vi.fn(),
  removeMemberPresence: vi.fn(),
  sweepStalePresence: vi.fn(),
}));

vi.mock("../services/virtual_workspaces.js", () => ({
  virtualWorkspaceService: () => mockVirtualWorkspaceService,
}));

async function createApp() {
  vi.resetModules();
  const [{ virtualWorkspacesRouter }] = await Promise.all([
    import("../routes/virtual_workspaces.js"),
  ]);
  const app = express();
  app.use(express.json());
  app.use("/companies/:companyId/virtual-workspaces", virtualWorkspacesRouter({} as any));
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("TEST APP ERROR:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  });
  return app;
}

describe("virtual workspaces routes", () => {
  beforeEach(() => {
    for (const mock of Object.values(mockVirtualWorkspaceService)) {
      mock.mockReset();
    }
  });

  it("GET / lists workspaces", async () => {
    mockVirtualWorkspaceService.listWorkspaces.mockResolvedValue([
      { id: "ws-1", name: "Main Office", slug: "main", isDefault: true },
    ]);

    const app = await createApp();
    const res = await request(app).get("/companies/company-1/virtual-workspaces");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "ws-1", name: "Main Office", slug: "main", isDefault: true },
    ]);
    expect(mockVirtualWorkspaceService.listWorkspaces).toHaveBeenCalledWith("company-1");
  });

  it("POST / creates workspace", async () => {
    mockVirtualWorkspaceService.createWorkspace.mockResolvedValue({
      id: "ws-2",
      name: "Engineering Lab",
      slug: "engineering-lab",
    });

    const app = await createApp();
    const res = await request(app)
      .post("/companies/company-1/virtual-workspaces")
      .send({ name: "Engineering Lab" });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("ws-2");
    expect(mockVirtualWorkspaceService.createWorkspace).toHaveBeenCalledWith(
      "company-1",
      expect.objectContaining({ name: "Engineering Lab" })
    );
  });

  it("GET /:workspaceId returns workspace detail", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      name: "Main Office",
      slug: "main",
    });

    const app = await createApp();
    const res = await request(app).get("/companies/company-1/virtual-workspaces/main");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("ws-1");
  });

  it("POST /:workspaceId/presence updates member presence", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      name: "Main Office",
    });
    mockVirtualWorkspaceService.upsertMemberPresence.mockResolvedValue({
      id: "p-1",
      memberType: "agent",
      memberId: "agent-123",
      status: "working",
      position: { x: 5, y: 10 },
    });

    const app = await createApp();
    const res = await request(app)
      .post("/companies/company-1/virtual-workspaces/ws-1/presence")
      .send({
        memberType: "agent",
        memberId: "agent-123",
        status: "working",
        position: { x: 5, y: 10 },
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("working");
    expect(mockVirtualWorkspaceService.upsertMemberPresence).toHaveBeenCalledWith(
      "company-1",
      "ws-1",
      expect.objectContaining({
        memberType: "agent",
        memberId: "agent-123",
        status: "working",
        position: { x: 5, y: 10 },
      })
    );
  });

  it("DELETE /:workspaceId/presence/:memberType/:memberId removes presence", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      name: "Main Office",
    });
    mockVirtualWorkspaceService.removeMemberPresence.mockResolvedValue({
      id: "p-1",
      memberType: "agent",
      memberId: "agent-123",
    });

    const app = await createApp();
    const res = await request(app).delete(
      "/companies/company-1/virtual-workspaces/ws-1/presence/agent/agent-123"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockVirtualWorkspaceService.removeMemberPresence).toHaveBeenCalledWith(
      "company-1",
      "ws-1",
      "agent",
      "agent-123"
    );
  });
});
