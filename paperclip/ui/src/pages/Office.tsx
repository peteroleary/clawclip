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

export const OfficePage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [searchParams] = useSearchParams();
  const initialNewTask = searchParams.get("action") === "new_task";
  const navigate = useNavigate();
  const [workforce, setWorkforce] = useState<Workforce3DMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<Workforce3DMember | null>(null);
  const [hqOpen, setHqOpen] = useState<boolean>(true);
  const [marketplaceOpen, setMarketplaceOpen] = useState<boolean>(false);
  const [orgChartOpen, setOrgChartOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
      {/* 1. Top Personnel Command Bar */}
      <TopPersonnelBar
        workforce={workforce}
        onSelectMember={(member) => setSelectedMember(member)}
        onOpenOrgChart={() => setOrgChartOpen(true)}
      />

      {/* 3. Left Side Business Drawer Panel */}
      <LeftBusinessDrawer
        onOpenProjects={() => navigate(companyId ? `/companies/${companyId}/projects` : "/projects")}
        onOpenFacilities={() => navigate("/office")}
        onOpenDirectory={() => navigate(companyId ? `/companies/${companyId}/human-employees` : "/human-employees")}
        onOpenOffers={() => navigate(companyId ? `/companies/${companyId}/apps` : "/apps")}
        onOpenCreateBusiness={() => navigate(companyId ? `/companies/${companyId}/projects` : "/projects")}
      />

      {/* Main 3D Office Workspace Viewport */}
      <div className="flex-1 w-full h-full relative overflow-hidden pt-16 pb-16">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 space-x-2 bg-[#06090d]">
            <Sparkles className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm">Initializing Claw3D Office HQ Environment...</span>
          </div>
        ) : (
          <RetroOffice3D
            workforce={workforce}
            selectedMemberId={selectedMember?.id}
            onSelectMember={(member) => setSelectedMember(member)}
            companyId={companyId}
            initialKanbanCreateMode={initialNewTask}
          />
        )}

        {/* 4. Right Side Platform HQ Drawer */}
        <HQSidebar
          open={hqOpen}
          onToggle={() => setHqOpen(!hqOpen)}
          onOpenMarketplace={() => setMarketplaceOpen(true)}
          onAddHuman={() => navigate(companyId ? `/companies/${companyId}/human-employees` : "/human-employees")}
          onAddAgent={() => navigate(companyId ? `/companies/${companyId}/agents/new` : "/agents/new")}
          workforce={workforce}
        />

        {/* Chat Drawer when a member is selected */}
        <RemoteAgentChatPanel
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />

        {/* Skills & Capability Marketplace Modal */}
        <SkillsMarketplaceModal
          isOpen={marketplaceOpen}
          onClose={() => setMarketplaceOpen(false)}
          companyId={companyId}
        />

        {/* Org Chart Modal */}
        <OrgChartImmersiveModal
          isOpen={orgChartOpen}
          onClose={() => setOrgChartOpen(false)}
          workforce={workforce}
        />
      </div>

      {/* 2. Bottom Action & Time Floating Dock */}
      <BottomActionDock
        onOpenGoals={() => navigate(companyId ? `/companies/${companyId}/goals` : "/goals")}
        onOpenBoard={() => navigate(companyId ? `/companies/${companyId}/issues` : "/issues")}
        onOpenTimeline={() => navigate(companyId ? `/companies/${companyId}/timeline` : "/timeline")}
        onOpenRoutines={() => navigate(companyId ? `/companies/${companyId}/routines` : "/routines")}
        onOpenCreateMenu={() => navigate("/office?action=new_task")}
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
