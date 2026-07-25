import { createHash } from "node:crypto";
import type { IncomingMessage, Server as HttpServer } from "node:http";
import { createRequire } from "node:module";
import type { Duplex } from "node:stream";
import { and, eq, isNull } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { agentApiKeys, companyMemberships, instanceUserRoles } from "@paperclipai/db";
import type { DeploymentMode } from "@paperclipai/shared";
import type { BetterAuthSessionResult } from "../auth/better-auth.js";
import { logger } from "../middleware/logger.js";
import { virtualWorkspaceService } from "../services/virtual_workspaces.js";
import { updateMemberPresenceSchema } from "@paperclipai/shared";

interface WsSocket {
  readyState: number;
  ping(): void;
  send(data: string): void;
  terminate(): void;
  close(code?: number, reason?: string): void;
  on(event: "message", listener: (data: Buffer | string) => void): void;
  on(event: "pong", listener: () => void): void;
  on(event: "close", listener: () => void): void;
  on(event: "error", listener: (err: Error) => void): void;
}

interface WsServer {
  clients: Set<WsSocket>;
  on(event: "connection", listener: (socket: WsSocket, req: IncomingMessage) => void): void;
  on(event: "close", listener: () => void): void;
  handleUpgrade(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer,
    callback: (ws: WsSocket) => void,
  ): void;
  emit(event: "connection", ws: WsSocket, req: IncomingMessage): boolean;
}

const require = createRequire(import.meta.url);
const { WebSocket, WebSocketServer } = require("ws") as {
  WebSocket: { OPEN: number };
  WebSocketServer: new (opts: { noServer: boolean }) => WsServer;
};

interface UpgradeContext {
  companyId: string;
  workspaceId: string;
  actorType: "board" | "agent";
  actorId: string;
}

interface IncomingMessageWithContext extends IncomingMessage {
  paperclipWebSocketHandled?: boolean;
  paperclipWorkspaceUpgradeContext?: UpgradeContext;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function isWritableUpgradeSocket(socket: Duplex) {
  const maybeWritableState = socket as Duplex & { writable?: boolean; writableEnded?: boolean; writableDestroyed?: boolean };
  return !socket.destroyed && maybeWritableState.writable !== false && !maybeWritableState.writableEnded && !maybeWritableState.writableDestroyed;
}

function closeUpgradeSocket(socket: Duplex) {
  if (!socket.destroyed) {
    socket.destroy();
  }
}

function rejectUpgrade(socket: Duplex, statusLine: string, message: string) {
  const safe = message.replace(/[\r\n]+/g, " ").trim();
  if (!isWritableUpgradeSocket(socket)) {
    closeUpgradeSocket(socket);
    return;
  }

  try {
    socket.once("finish", () => closeUpgradeSocket(socket));
    socket.end(`HTTP/1.1 ${statusLine}\r\nConnection: close\r\nContent-Type: text/plain\r\n\r\n${safe}`);
  } catch (err) {
    logger.warn({ err }, "failed to reject virtual workspace websocket upgrade");
    closeUpgradeSocket(socket);
  }
}

function parseWorkspacePath(pathname: string): { companyId: string; workspaceId: string } | null {
  const match = pathname.match(/^\/api\/companies\/([^/]+)\/virtual-workspaces\/([^/]+)\/ws$/);
  if (!match) return null;

  try {
    return {
      companyId: decodeURIComponent(match[1] ?? ""),
      workspaceId: decodeURIComponent(match[2] ?? ""),
    };
  } catch {
    return null;
  }
}

function parseBearerToken(rawAuth: string | string[] | undefined) {
  const auth = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
  if (!auth) return null;
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  const token = auth.slice("bearer ".length).trim();
  return token.length > 0 ? token : null;
}

function headersFromIncomingMessage(req: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [key, raw] of Object.entries(req.headers)) {
    if (!raw) continue;
    if (Array.isArray(raw)) {
      for (const value of raw) headers.append(key, value);
      continue;
    }
    headers.set(key, raw);
  }
  return headers;
}

async function authorizeUpgrade(
  db: Db,
  req: IncomingMessage,
  companyId: string,
  workspaceId: string,
  url: URL,
  opts: {
    deploymentMode: DeploymentMode;
    resolveSessionFromHeaders?: (headers: Headers) => Promise<BetterAuthSessionResult | null>;
  },
): Promise<UpgradeContext | null> {
  const queryToken = url.searchParams.get("token")?.trim() ?? "";
  const authToken = parseBearerToken(req.headers.authorization);
  const token = authToken ?? (queryToken.length > 0 ? queryToken : null);

  if (!token) {
    if (opts.deploymentMode === "local_trusted") {
      return {
        companyId,
        workspaceId,
        actorType: "board",
        actorId: "board",
      };
    }

    if (opts.deploymentMode !== "authenticated" || !opts.resolveSessionFromHeaders) {
      return null;
    }

    const session = await opts.resolveSessionFromHeaders(headersFromIncomingMessage(req));
    const userId = session?.user?.id;
    if (!userId) return null;

    const [roleRow, memberships] = await Promise.all([
      db
        .select({ id: instanceUserRoles.id })
        .from(instanceUserRoles)
        .where(and(eq(instanceUserRoles.userId, userId), eq(instanceUserRoles.role, "instance_admin")))
        .then((rows) => rows[0] ?? null),
      db
        .select({ companyId: companyMemberships.companyId })
        .from(companyMemberships)
        .where(
          and(
            eq(companyMemberships.principalType, "user"),
            eq(companyMemberships.principalId, userId),
            eq(companyMemberships.status, "active"),
          ),
        ),
    ]);

    const hasCompanyMembership = memberships.some((row) => row.companyId === companyId);
    if (!roleRow && !hasCompanyMembership) return null;

    return {
      companyId,
      workspaceId,
      actorType: "board",
      actorId: userId,
    };
  }

  const tokenHash = hashToken(token);
  const key = await db
    .select()
    .from(agentApiKeys)
    .where(and(eq(agentApiKeys.keyHash, tokenHash), isNull(agentApiKeys.revokedAt)))
    .then((rows) => rows[0] ?? null);

  if (!key || key.companyId !== companyId) {
    return null;
  }

  await db
    .update(agentApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(agentApiKeys.id, key.id));

  return {
    companyId,
    workspaceId,
    actorType: "agent",
    actorId: key.agentId,
  };
}

export function setupVirtualWorkspaceWebSocketServer(
  server: HttpServer,
  db: Db,
  opts: {
    deploymentMode: DeploymentMode;
    resolveSessionFromHeaders?: (headers: Headers) => Promise<BetterAuthSessionResult | null>;
  },
) {
  const wss = new WebSocketServer({ noServer: true });
  const workspaceSockets = new Map<string, Set<WsSocket>>();
  const socketContexts = new Map<WsSocket, UpgradeContext>();
  const aliveByClient = new Map<WsSocket, boolean>();
  const service = virtualWorkspaceService(db);

  function broadcastToWorkspace(workspaceId: string, message: Record<string, unknown>, sender?: WsSocket) {
    const clients = workspaceSockets.get(workspaceId);
    if (!clients) return;

    const payload = JSON.stringify(message);
    for (const client of clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  const pingInterval = setInterval(() => {
    for (const socket of wss.clients) {
      if (!aliveByClient.get(socket)) {
        socket.terminate();
        continue;
      }
      aliveByClient.set(socket, false);
      socket.ping();
    }
  }, 30000);

  wss.on("connection", async (socket: WsSocket, req: IncomingMessage) => {
    const context = (req as IncomingMessageWithContext).paperclipWorkspaceUpgradeContext;
    if (!context) {
      socket.close(1008, "missing context");
      return;
    }

    const { companyId, workspaceId } = context;

    // Resolve workspace ID if slug was passed
    const workspace = await service.getWorkspace(companyId, workspaceId);
    if (!workspace) {
      socket.close(1008, "workspace not found");
      return;
    }

    const resolvedWorkspaceId = workspace.id;
    context.workspaceId = resolvedWorkspaceId;

    if (!workspaceSockets.has(resolvedWorkspaceId)) {
      workspaceSockets.set(resolvedWorkspaceId, new Set());
    }
    workspaceSockets.get(resolvedWorkspaceId)!.add(socket);
    socketContexts.set(socket, context);
    aliveByClient.set(socket, true);

    // Send initial presence state
    try {
      await service.sweepStalePresence(companyId, resolvedWorkspaceId);
      const initialPresence = await service.getWorkspacePresence(companyId, resolvedWorkspaceId);
      socket.send(
        JSON.stringify({
          type: "presence:state",
          workspaceId: resolvedWorkspaceId,
          companyId,
          timestamp: new Date().toISOString(),
          payload: { presence: initialPresence },
        })
      );
    } catch (err) {
      logger.error({ err, companyId, workspaceId: resolvedWorkspaceId }, "failed to send initial presence state");
    }

    socket.on("pong", () => {
      aliveByClient.set(socket, true);
    });

    socket.on("message", async (rawMessage: Buffer | string) => {
      try {
        const text = rawMessage.toString();
        const data = JSON.parse(text);

        if (data.type === "ping") {
          socket.send(JSON.stringify({ type: "pong" }));
          return;
        }

        if (data.type === "presence:update") {
          const parsed = updateMemberPresenceSchema.safeParse(data.payload || {});
          if (parsed.success) {
            const updated = await service.upsertMemberPresence(companyId, resolvedWorkspaceId, parsed.data);
            broadcastToWorkspace(
              resolvedWorkspaceId,
              {
                type: "presence:update",
                workspaceId: resolvedWorkspaceId,
                companyId,
                timestamp: new Date().toISOString(),
                payload: { presence: updated },
              },
              socket
            );
          }
          return;
        }

        if (data.type === "presence:leave") {
          const { memberType, memberId } = data.payload || {};
          if (memberType && memberId) {
            await service.removeMemberPresence(companyId, resolvedWorkspaceId, memberType, memberId);
            broadcastToWorkspace(
              resolvedWorkspaceId,
              {
                type: "presence:leave",
                workspaceId: resolvedWorkspaceId,
                companyId,
                timestamp: new Date().toISOString(),
                payload: { memberType, memberId },
              },
              socket
            );
          }
          return;
        }
      } catch (err) {
        logger.warn({ err, companyId, workspaceId: resolvedWorkspaceId }, "invalid websocket message format");
      }
    });

    socket.on("close", () => {
      const socketSet = workspaceSockets.get(resolvedWorkspaceId);
      if (socketSet) {
        socketSet.delete(socket);
        if (socketSet.size === 0) {
          workspaceSockets.delete(resolvedWorkspaceId);
        }
      }
      socketContexts.delete(socket);
      aliveByClient.delete(socket);
    });

    socket.on("error", (err: Error) => {
      logger.warn({ err, companyId, workspaceId: resolvedWorkspaceId }, "virtual workspace websocket error");
    });
  });

  wss.on("close", () => {
    clearInterval(pingInterval);
  });

  server.on("upgrade", (req, socket, head) => {
    if ((req as IncomingMessageWithContext).paperclipWebSocketHandled) {
      return;
    }

    const onRawSocketError = (err: Error) => {
      logger.warn({ err, path: req.url }, "virtual workspace websocket upgrade socket error");
    };
    const cleanupRawSocketListeners = () => {
      socket.off("error", onRawSocketError);
      socket.off("close", cleanupRawSocketListeners);
    };

    socket.on("error", onRawSocketError);
    socket.once("close", cleanupRawSocketListeners);

    if (!req.url) {
      return;
    }

    const url = new URL(req.url, "http://localhost");
    const parsedPath = parseWorkspacePath(url.pathname);
    if (!parsedPath) {
      return;
    }

    (req as IncomingMessageWithContext).paperclipWebSocketHandled = true;

    void authorizeUpgrade(db, req, parsedPath.companyId, parsedPath.workspaceId, url, {
      deploymentMode: opts.deploymentMode,
      resolveSessionFromHeaders: opts.resolveSessionFromHeaders,
    })
      .then((context) => {
        if (!context) {
          rejectUpgrade(socket, "403 Forbidden", "forbidden");
          return;
        }

        if (!isWritableUpgradeSocket(socket)) {
          cleanupRawSocketListeners();
          return;
        }

        const reqWithContext = req as IncomingMessageWithContext;
        reqWithContext.paperclipWorkspaceUpgradeContext = context;

        cleanupRawSocketListeners();
        wss.handleUpgrade(req, socket, head, (ws: WsSocket) => {
          wss.emit("connection", ws, reqWithContext);
        });
      })
      .catch((err) => {
        logger.error({ err, path: req.url }, "failed virtual workspace websocket upgrade authorization");
        rejectUpgrade(socket, "500 Internal Server Error", "upgrade failed");
      });
  });

  return wss;
}
