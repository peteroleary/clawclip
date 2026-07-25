import type { Db } from "@paperclipai/db";
import { humanEmployees } from "@paperclipai/db";
import { eq, and, desc } from "drizzle-orm";

export function humanEmployeeService(db: Db) {
  return {
    async list(companyId: string) {
      return db
        .select()
        .from(humanEmployees)
        .where(eq(humanEmployees.companyId, companyId))
        .orderBy(desc(humanEmployees.createdAt));
    },

    async getById(id: string) {
      const [item] = await db
        .select()
        .from(humanEmployees)
        .where(eq(humanEmployees.id, id))
        .limit(1);
      return item ?? null;
    },

    async create(data: {
      companyId: string;
      userId?: string;
      name: string;
      email: string;
      role?: string;
      title?: string;
      department?: string;
      reportsTo?: string;
      status?: string;
      workingHours?: { start: string; end: string; timezone: string };
      hourlyCostCents?: number;
      skills?: string[];
      deskPosition?: { x: number; y: number; floor?: number; zone?: string };
      avatarConfig?: Record<string, unknown>;
    }) {
      const [created] = await db
        .insert(humanEmployees)
        .values({
          companyId: data.companyId,
          userId: data.userId || null,
          name: data.name,
          email: data.email,
          role: data.role ?? "member",
          title: data.title ?? null,
          department: data.department ?? "Engineering",
          reportsTo: data.reportsTo ?? null,
          status: data.status ?? "active",
          workingHours: data.workingHours ?? { start: "09:00", end: "17:00", timezone: "UTC" },
          hourlyCostCents: data.hourlyCostCents ?? 5000,
          skills: data.skills ?? [],
          deskPosition: data.deskPosition ?? { x: 0, y: 0, floor: 1, zone: "Main Open Office" },
          avatarConfig: data.avatarConfig ?? {
            hairStyle: "short",
            hairColor: "#3b82f6",
            outfitColor: "#1e293b",
            skinTone: "#f87171",
            accessory: "none",
            spriteId: "human_1",
          },
        })
        .returning();
      return created;
    },

    async update(
      id: string,
      data: Partial<{
        name: string;
        email: string;
        role: string;
        title: string | null;
        department: string;
        reportsTo: string | null;
        status: string;
        workingHours: { start: string; end: string; timezone: string };
        hourlyCostCents: number;
        skills: string[];
        deskPosition: { x: number; y: number; floor?: number; zone?: string };
        avatarConfig: Record<string, unknown>;
      }>
    ) {
      const [updated] = await db
        .update(humanEmployees)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(humanEmployees.id, id))
        .returning();
      return updated ?? null;
    },

    async delete(id: string) {
      const [deleted] = await db
        .delete(humanEmployees)
        .where(eq(humanEmployees.id, id))
        .returning();
      return deleted ?? null;
    },
  };
}
