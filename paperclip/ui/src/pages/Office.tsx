import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RetroOffice3D } from "../features/office/RetroOffice3D.js";
import { HQSidebar } from "../features/office/components/HQSidebar.js";
import { OfficeFloorNav } from "../features/office/components/OfficeFloorNav.js";
import { SkillsMarketplaceModal } from "../features/office/components/panels/SkillsMarketplaceModal.js";
import { RemoteAgentChatPanel } from "../features/office/components/RemoteAgentChatPanel.js";
import type { Workforce3DMember } from "../features/office/types.js";
import { Users, Bot, Building2, Sparkles } from "lucide-react";

export const OfficePage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [workforce, setWorkforce] = useState<Workforce3DMember[]>([]);
  const [filterType, setFilterType] = useState<"all" | "human" | "agent">("all");
  const [selectedMember, setSelectedMember] = useState<Workforce3DMember | null>(null);
  const [activeZone, setActiveZone] = useState<string>("main");
  const [hqOpen, setHqOpen] = useState<boolean>(true);
  const [marketplaceOpen, setMarketplaceOpen] = useState<boolean>(false);
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

  const filteredWorkforce = workforce.filter((m) => {
    if (filterType === "human") return m.type === "human";
    if (filterType === "agent") return m.type === "agent";
    return true;
  });

  const humanCount = workforce.filter((m) => m.type === "human").length;
  const agentCount = workforce.filter((m) => m.type === "agent").length;

  return (
    <div className="flex flex-col h-screen w-full bg-[#06090d] text-slate-100 font-sans overflow-hidden relative">
      {/* Top Application Header */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Claw3D Virtual Office HQ
            </h1>
          </div>

          <span className="text-slate-700">|</span>

          {/* Floor & Zone Navigation Switcher */}
          <OfficeFloorNav activeZone={activeZone} onZoneChange={(zone) => setActiveZone(zone)} />
        </div>

        {/* Top Controls & Member Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Staff:</span>
            <span className="font-bold text-emerald-400">{humanCount}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Bots:</span>
            <span className="font-bold text-blue-400">{agentCount}</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#090d16] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                filterType === "all" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({workforce.length})
            </button>
            <button
              onClick={() => setFilterType("human")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                filterType === "human" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Humans
            </button>
            <button
              onClick={() => setFilterType("agent")}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                filterType === "agent" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Agents
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Office Workspace Viewport */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 space-x-2 bg-[#06090d]">
            <Sparkles className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm">Initializing Claw3D Office HQ Environment...</span>
          </div>
        ) : (
          <RetroOffice3D
            workforce={filteredWorkforce}
            selectedMemberId={selectedMember?.id}
            onSelectMember={(member) => setSelectedMember(member)}
            companyId={companyId}
          />
        )}

        {/* Floating Headquarters Control Sidebar */}
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
      </div>
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
