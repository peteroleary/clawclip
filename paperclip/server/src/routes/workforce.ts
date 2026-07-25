import { Router, type Request, type Response } from "express";
import type { Db } from "@paperclipai/db";
import { agentService } from "../services/agents.js";
import { humanEmployeeService } from "../services/human_employees.js";

export function workforceRouter(db: Db) {
  const router = Router({ mergeParams: true });
  const agentSvc = agentService(db);
  const humanSvc = humanEmployeeService(db);

  router.get("/", async (req: Request, res: Response) => {
    const { companyId } = req.params as { companyId: string };
    
    const [agentsList, humansList] = await Promise.all([
      agentSvc.list(companyId),
      humanSvc.list(companyId),
    ]);

    const normalizedAgents = agentsList.map((agent) => ({
      id: agent.id,
      type: "agent" as const,
      name: agent.name,
      role: agent.role,
      title: agent.title ?? agent.role,
      department: (agent.metadata?.department as string) ?? "Engineering",
      status: agent.status,
      reportsTo: agent.reportsTo ?? null,
      monthlyCostCents: agent.spentMonthlyCents ?? 0,
      deskPosition: (agent.metadata?.deskPosition as any) ?? { x: 0, y: 0, floor: 1, zone: "AI Wing" },
      avatarConfig: (agent.metadata?.avatarConfig as any) ?? {
        spriteId: "bot_1",
        primaryColor: "#3b82f6",
      },
      skills: agent.capabilities ? [agent.capabilities] : [],
      updatedAt: agent.updatedAt,
    }));

    const normalizedHumans = humansList.map((human) => ({
      id: human.id,
      type: "human" as const,
      name: human.name,
      email: human.email,
      role: human.role,
      title: human.title ?? human.role,
      department: human.department,
      status: human.status,
      reportsTo: human.reportsTo ?? null,
      hourlyCostCents: human.hourlyCostCents,
      workingHours: human.workingHours,
      deskPosition: human.deskPosition ?? { x: 0, y: 0, floor: 1, zone: "Main Open Office" },
      avatarConfig: human.avatarConfig ?? {
        spriteId: "human_1",
        hairStyle: "short",
        hairColor: "#3b82f6",
        outfitColor: "#1e293b",
      },
      skills: human.skills ?? [],
      updatedAt: human.updatedAt,
    }));

    res.json({
      agents: normalizedAgents,
      humans: normalizedHumans,
      totalCount: normalizedAgents.length + normalizedHumans.length,
    });
  });

  return router;
}
