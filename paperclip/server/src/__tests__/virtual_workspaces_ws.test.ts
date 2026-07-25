import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WebSocket from "ws";

const mockVirtualWorkspaceService = vi.hoisted(() => ({
  getWorkspace: vi.fn(),
  getWorkspacePresence: vi.fn(),
  upsertMemberPresence: vi.fn(),
  removeMemberPresence: vi.fn(),
  sweepStalePresence: vi.fn(),
}));

vi.mock("../services/virtual_workspaces.js", () => ({
  virtualWorkspaceService: () => mockVirtualWorkspaceService,
}));

async function createTestWssServer() {
  vi.resetModules();
  const [{ setupVirtualWorkspaceWebSocketServer }] = await Promise.all([
    import("../realtime/virtual-workspace-ws.js"),
  ]);

  const httpServer = createServer((_req, res) => {
    res.writeHead(404);
    res.end();
  });

  const wss = setupVirtualWorkspaceWebSocketServer(httpServer, {} as any, {
    deploymentMode: "local_trusted",
  });

  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const port = (httpServer.address() as AddressInfo).port;

  return {
    httpServer,
    wss,
    port,
    close: async () => {
      wss.close();
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    },
  };
}

describe("virtual workspace websocket server", () => {
  let serverCtx: Awaited<ReturnType<typeof createTestWssServer>>;

  beforeEach(async () => {
    for (const mock of Object.values(mockVirtualWorkspaceService)) {
      mock.mockReset();
    }
    serverCtx = await createTestWssServer();
  });

  afterEach(async () => {
    if (serverCtx) {
      await serverCtx.close();
    }
  });

  it("sends initial presence state on connection", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      companyId: "company-1",
      name: "Main Office",
    });
    mockVirtualWorkspaceService.sweepStalePresence.mockResolvedValue([]);
    mockVirtualWorkspaceService.getWorkspacePresence.mockResolvedValue([
      {
        id: "p-1",
        memberType: "agent",
        memberId: "agent-1",
        name: "Agent One",
        status: "active",
      },
    ]);

    const wsUrl = `ws://127.0.0.1:${serverCtx.port}/api/companies/company-1/virtual-workspaces/ws-1/ws`;
    const ws = new WebSocket(wsUrl);

    const messagePromise = new Promise<any>((resolve) => {
      ws.on("message", (raw) => {
        resolve(JSON.parse(raw.toString()));
      });
    });

    const msg = await messagePromise;
    ws.close();

    expect(msg.type).toBe("presence:state");
    expect(msg.workspaceId).toBe("ws-1");
    expect(msg.payload.presence).toHaveLength(1);
    expect(msg.payload.presence[0].memberId).toBe("agent-1");
  });

  it("responds to ping with pong", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      companyId: "company-1",
      name: "Main Office",
    });
    mockVirtualWorkspaceService.sweepStalePresence.mockResolvedValue([]);
    mockVirtualWorkspaceService.getWorkspacePresence.mockResolvedValue([]);

    const wsUrl = `ws://127.0.0.1:${serverCtx.port}/api/companies/company-1/virtual-workspaces/ws-1/ws`;
    const ws = new WebSocket(wsUrl);

    await new Promise<void>((resolve) => ws.on("open", resolve));

    const pongPromise = new Promise<any>((resolve) => {
      ws.on("message", (raw) => {
        const data = JSON.parse(raw.toString());
        if (data.type === "pong") resolve(data);
      });
    });

    ws.send(JSON.stringify({ type: "ping" }));
    const response = await pongPromise;
    ws.close();

    expect(response.type).toBe("pong");
  });

  it("handles presence:update message", async () => {
    mockVirtualWorkspaceService.getWorkspace.mockResolvedValue({
      id: "ws-1",
      companyId: "company-1",
      name: "Main Office",
    });
    mockVirtualWorkspaceService.sweepStalePresence.mockResolvedValue([]);
    mockVirtualWorkspaceService.getWorkspacePresence.mockResolvedValue([]);
    mockVirtualWorkspaceService.upsertMemberPresence.mockResolvedValue({
      id: "p-2",
      memberType: "human",
      memberId: "user-1",
      status: "working",
      position: { x: 10, y: 15 },
    });

    const wsUrl = `ws://127.0.0.1:${serverCtx.port}/api/companies/company-1/virtual-workspaces/ws-1/ws`;
    const ws1 = new WebSocket(wsUrl);
    const ws2 = new WebSocket(wsUrl);

    await Promise.all([
      new Promise<void>((resolve) => ws1.on("open", resolve)),
      new Promise<void>((resolve) => ws2.on("open", resolve)),
    ]);

    const broadcastPromise = new Promise<any>((resolve) => {
      ws2.on("message", (raw) => {
        const data = JSON.parse(raw.toString());
        if (data.type === "presence:update") resolve(data);
      });
    });

    ws1.send(
      JSON.stringify({
        type: "presence:update",
        payload: {
          memberType: "human",
          memberId: "user-1",
          status: "working",
          position: { x: 10, y: 15 },
        },
      })
    );

    const broadcast = await broadcastPromise;
    ws1.close();
    ws2.close();

    expect(broadcast.type).toBe("presence:update");
    expect(broadcast.payload.presence.memberId).toBe("user-1");
    expect(broadcast.payload.presence.status).toBe("working");
    expect(mockVirtualWorkspaceService.upsertMemberPresence).toHaveBeenCalledWith(
      "company-1",
      "ws-1",
      expect.objectContaining({ memberType: "human", memberId: "user-1" })
    );
  });
});
