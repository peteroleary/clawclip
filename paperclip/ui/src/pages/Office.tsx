import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { RetroOffice3D } from "../features/office/RetroOffice3D.js";
import { HQSidebar } from "../features/office/components/HQSidebar.js";
import { TopPersonnelBar } from "../features/office/components/TopPersonnelBar.js";
import { OrgChartImmersiveModal } from "../features/office/components/OrgChartImmersiveModal.js";
import { BottomActionDock } from "../features/office/components/BottomActionDock.js";
import { LeftBusinessDrawer } from "../features/office/components/LeftBusinessDrawer.js";
import { SkillsMarketplaceModal } from "../features/office/components/panels/SkillsMarketplaceModal.js";
import { RemoteAgentChatPanel } from "../features/office/components/RemoteAgentChatPanel.js";
import type { Workforce3DMember } from "../features/office/types.js";
import { Sparkles } from "lucide-react";
import { useOfficeStore, OfficeEntity } from "../store/officeStore.js";

import { KanbanImmersiveScreen } from "../features/office/screens/KanbanImmersiveScreen.js";
import { SchedulingImmersiveScreen } from "../features/office/screens/SchedulingImmersiveScreen.js";
import { TeamImmersiveScreen } from "../features/office/screens/TeamImmersiveScreen.js";
import { DiscoverImmersiveScreen } from "../features/office/screens/DiscoverImmersiveScreen.js";
import { ProjectsImmersiveScreen } from "../features/office/screens/ProjectsImmersiveScreen.js";
import { MemoryImmersiveScreen } from "../features/office/screens/MemoryImmersiveScreen.js";
import { ArtifactsImmersiveScreen } from "../features/office/screens/ArtifactsImmersiveScreen.js";
import { WalletImmersiveScreen } from "../features/office/screens/WalletImmersiveScreen.js";
import { CommsImmersiveScreen } from "../features/office/screens/CommsImmersiveScreen.js";
import { TargetsImmersiveScreen } from "../features/office/screens/TargetsImmersiveScreen.js";
import { DirectoryImmersiveScreen } from "../features/office/screens/DirectoryImmersiveScreen.js";
import { FacilitiesImmersiveScreen } from "../features/office/screens/FacilitiesImmersiveScreen.js";

export const OfficePage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialNewTask = searchParams.get("action") === "new_task";
  const navigate = useNavigate();
  const [workforce, setWorkforce] = useState<Workforce3DMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const activePanels = useOfficeStore((state) => state.activePanels);
  const setActiveDrawer = useOfficeStore((state) => state.setActiveDrawer);
  const selectedEntity = useOfficeStore((state) => state.selectedEntity);
  const setSelectedEntity = useOfficeStore((state) => state.setSelectedEntity);
  const setCameraTarget = useOfficeStore((state) => state.setCameraTarget);

  // Sync URL search params with Zustand store
  useEffect(() => {
    const panel = searchParams.get("panel");
    const rightPanel = searchParams.get("rightPanel") || (panel === "hq" ? "hq" : null);
    const leftPanel = searchParams.get("leftPanel") || (panel === "projects" ? "projects" : null);
    const bottomPanel = searchParams.get("bottomPanel") || null;

    if (rightPanel) setActiveDrawer("right", rightPanel);
    if (leftPanel) setActiveDrawer("left", leftPanel);
    if (bottomPanel) setActiveDrawer("bottom", bottomPanel);

    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType") as OfficeEntity["type"];
    
    if (entityId && entityType) {
      setSelectedEntity({ id: entityId, type: entityType });
    }
  }, [searchParams, setActiveDrawer, setSelectedEntity]);

  // Sync Zustand store with URL (when state changes internally)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activePanels.right) params.set("rightPanel", activePanels.right);
    else params.delete("rightPanel");

    if (activePanels.left) params.set("leftPanel", activePanels.left);
    else params.delete("leftPanel");

    if (activePanels.bottom) params.set("bottomPanel", activePanels.bottom);
    else params.delete("bottomPanel");

    if (selectedEntity) {
      params.set("entityId", selectedEntity.id);
      params.set("entityType", selectedEntity.type);
    } else {
      params.delete("entityId");
      params.delete("entityType");
    }
    
    setSearchParams(params, { replace: true });
  }, [activePanels.right, activePanels.left, selectedEntity, setSearchParams]);

  useEffect(() => {
    async function fetchWorkforce() {
      try {
        setLoading(true);
        if (!companyId) {
          setWorkforce(getFallbackWorkforce());
          return;
        }
        const res = await fetch(`/api/companies/${companyId}/workforce`);
        if (res.ok) {
          const data = await res.json();
          const combined: Workforce3DMember[] = [
            ...(data.humans || []),
            ...(data.agents || []),
          ];
          setWorkforce(combined.length > 0 ? combined : getFallbackWorkforce());
        } else {
          setWorkforce(getFallbackWorkforce());
        }
      } catch {
        setWorkforce(getFallbackWorkforce());
      } finally {
        setLoading(false);
      }
    }

    fetchWorkforce();
  }, [companyId]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#06090d] text-slate-100 font-sans overflow-hidden relative select-none">
      {/* Main 3D Office Workspace Viewport (Bare) */}
      <div className="w-full h-full relative overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 space-x-2 bg-[#06090d]">
            <Sparkles className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm">Initializing Claw3D Office HQ Environment...</span>
          </div>
        ) : (
          <RetroOffice3D
            workforce={workforce}
            selectedMemberId={selectedEntity?.type === "human" || selectedEntity?.type === "agent" ? selectedEntity.id : undefined}
            onSelectMember={(member) => {
              setSelectedEntity({ type: member.type === "agent" ? "agent" : "human", id: member.id });
              setActiveDrawer("right", "chat");
            }}
            companyId={companyId}
            initialKanbanCreateMode={initialNewTask}
          />
        )}
      </div>

      {/* Floating Bottom Action Dock: Wallet | Team, Targets, Projects, Board, Scheduling, Facilities, Directory, Memory, Artifacts | Comms */}
      <BottomActionDock
        onOpenWallet={() => setActiveDrawer("bottom", "wallet")}
        onOpenTeam={() => setActiveDrawer("bottom", "team")}
        onOpenTargets={() => setActiveDrawer("bottom", "targets")}
        onOpenProjects={() => setActiveDrawer("bottom", "projects")}
        onOpenBoard={() => setActiveDrawer("bottom", "board")}
        onOpenScheduling={() => setActiveDrawer("bottom", "scheduling")}
        onOpenFacilities={() => setActiveDrawer("bottom", "facilities")}
        onOpenDiscover={() => setActiveDrawer("bottom", "discover")}
        onOpenDirectory={() => setActiveDrawer("bottom", "directory")}
        onOpenMemory={() => setActiveDrawer("bottom", "memory")}
        onOpenArtifacts={() => setActiveDrawer("bottom", "artifacts")}
        onOpenComms={() => setActiveDrawer("bottom", "comms")}
      />

      {/* 1. Full-Screen Immersive Wallet & Treasury Screen */}
      <WalletImmersiveScreen
        isOpen={activePanels.bottom === "wallet"}
        onClose={() => setActiveDrawer("bottom", null)}
      />

      {/* 2. Full-Screen Immersive Team & Org Chart Screen */}
      <TeamImmersiveScreen
        isOpen={activePanels.bottom === "team"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />

      {/* 3. Full-Screen Immersive Targets & KPIs Screen */}
      <TargetsImmersiveScreen
        isOpen={activePanels.bottom === "targets"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />

      {/* 4. Full-Screen Immersive Projects Screen */}
      <ProjectsImmersiveScreen
        isOpen={activePanels.bottom === "projects"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />

      {/* 5. Full-Screen Immersive Kanban Board Screen */}
      <KanbanImmersiveScreen
        isOpen={activePanels.bottom === "board"}
        onClose={() => setActiveDrawer("bottom", null)}
        companyId={companyId}
        initialCreateMode={initialNewTask}
        workforce={workforce}
      />

      {/* 6. Full-Screen Immersive Scheduling Screen */}
      <SchedulingImmersiveScreen
        isOpen={activePanels.bottom === "scheduling"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />

      {/* 7. Full-Screen Immersive Facilities & Spatial Screen */}
      <FacilitiesImmersiveScreen
        isOpen={activePanels.bottom === "facilities"}
        onClose={() => setActiveDrawer("bottom", null)}
      />

      {/* 7.5 Full-Screen Immersive Discover Screen */}
      <DiscoverImmersiveScreen
        isOpen={activePanels.bottom === "discover"}
        onClose={() => setActiveDrawer("bottom", null)}
      />

      {/* 8. Full-Screen Immersive Universal Directory Screen */}
      <DirectoryImmersiveScreen
        isOpen={activePanels.bottom === "directory"}
        onClose={() => setActiveDrawer("bottom", null)}
      />

      {/* 9. Full-Screen Immersive Memory Screen */}
      <MemoryImmersiveScreen
        isOpen={activePanels.bottom === "memory"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />

      {/* 10. Full-Screen Immersive Artifacts Screen */}
      <ArtifactsImmersiveScreen
        isOpen={activePanels.bottom === "artifacts"}
        onClose={() => setActiveDrawer("bottom", null)}
      />

      {/* 11. Full-Screen Immersive Comms Screen */}
      <CommsImmersiveScreen
        isOpen={activePanels.bottom === "comms"}
        onClose={() => setActiveDrawer("bottom", null)}
        workforce={workforce}
      />
    </div>
  );
};

function getFallbackWorkforce(): Workforce3DMember[] {
  return [
    {
      id: "human-1",
      type: "human",
      name: "Alex Mercer",
      role: "lead",
      title: "VP of Product & Engineering",
      department: "Engineering",
      status: "active",
      hourlyCostCents: 9500,
      workingHours: { start: "09:00", end: "17:00", timezone: "EST" },
      skills: ["React", "Architecture", "System Design"],
      deskPosition: { x: -4, y: 0, zone: "Human Wing" },
      avatarConfig: {
        spriteId: "human_1",
        hairStyle: "short",
        hairColor: "#d97706",
        outfitColor: "#1e293b",
        skinTone: "#fca5a5",
      },
      activeTask: {
        id: "task-101",
        identifier: "PAP-101",
        title: "Reviewing Q3 AI Multi-Agent Architecture Plan",
      },
    },
    {
      id: "human-2",
      type: "human",
      name: "Sarah Chen",
      role: "senior_engineer",
      title: "Senior Full-Stack Architect",
      department: "Engineering",
      status: "working",
      hourlyCostCents: 8000,
      workingHours: { start: "09:00", end: "17:00", timezone: "PST" },
      skills: ["TypeScript", "Node.js", "Drizzle ORM"],
      deskPosition: { x: -4, y: 0, zone: "Human Wing" },
      avatarConfig: {
        spriteId: "human_2",
        hairStyle: "long",
        hairColor: "#0284c7",
        outfitColor: "#047857",
        skinTone: "#fde047",
      },
      currentSpeech: "💬 Optimizing PostgreSQL query performance for workforce state",
    },
    {
      id: "agent-1",
      type: "agent",
      name: "OpenClaw Coder",
      role: "coder",
      title: "Autonomous Senior Developer Bot",
      department: "AI Swarm",
      status: "active",
      monthlyCostCents: 45000,
      skills: ["Refactoring", "Code Review", "Vitest", "Playwright"],
      deskPosition: { x: 4, y: 0, zone: "AI Swarm" },
      avatarConfig: {
        spriteId: "bot_1",
        primaryColor: "#3b82f6",
      },
      activeTask: {
        id: "task-202",
        identifier: "BOT-202",
        title: "Executing unit tests & linting rules",
      },
    },
    {
      id: "agent-2",
      type: "agent",
      name: "Hermes Manager",
      role: "pm",
      title: "AI Orchestration Supervisor",
      department: "Operations",
      status: "working",
      monthlyCostCents: 32000,
      skills: ["Issue Delegation", "Roadmap Sync", "Budget Control"],
      deskPosition: { x: 4, y: 0, zone: "AI Swarm" },
      avatarConfig: {
        spriteId: "bot_2",
        primaryColor: "#0284c7",
      },
      currentSpeech: "⚡ Re-assigning high priority tickets across human & bot subtrees",
    },
  ];
}
