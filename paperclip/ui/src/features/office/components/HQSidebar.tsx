import React, { useState } from "react";
import {
  Inbox,
  History,
  Kanban,
  BookOpen,
  BarChart3,
  Sparkles,
  UserPlus,
  Bot,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Workforce3DMember } from "../types.js";

export type HQSidebarTab = "artifacts" | "skills" | "playbooks" | "stats" | "activity" | "settings";

interface HQSidebarProps {
  open: boolean;
  onToggle: () => void;
  onOpenMarketplace: () => void;
  onAddHuman?: () => void;
  onAddAgent?: () => void;
  workforce: Workforce3DMember[];
}

export const HQSidebar: React.FC<HQSidebarProps> = ({
  open,
  onToggle,
  onOpenMarketplace,
  onAddHuman,
  onAddAgent,
  workforce,
}) => {
  const [activeTab, setActiveTab] = useState<HQSidebarTab>("activity");

  const humanCount = workforce.filter((m) => m.type === "human").length;
  const agentCount = workforce.filter((m) => m.type === "agent").length;

  return (
    <aside className="pointer-events-none fixed inset-y-0 right-0 z-30 flex justify-end select-none">
      <div className="pointer-events-auto mt-16 flex shrink-0 flex-row items-start">
        {/* Toggle & Quick Action Buttons */}
        <div className="flex flex-col gap-2 mr-2">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-l-xl border border-r-0 border-cyan-500/40 bg-[#06090d]/95 px-2 py-3 font-mono text-[11px] font-bold tracking-widest text-cyan-300 shadow-2xl backdrop-blur transition-all hover:border-cyan-400 hover:text-white"
            aria-label={open ? "Collapse HQ" : "Open HQ"}
          >
            <span className="block leading-none [writing-mode:vertical-rl] uppercase">
              {open ? "COLLAPSE HQ" : "OPEN HQ PANELS"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenMarketplace}
            className="rounded-l-xl border border-r-0 border-fuchsia-500/40 bg-[#120617]/95 px-2 py-3 font-mono text-[11px] font-bold tracking-widest text-fuchsia-300 shadow-2xl backdrop-blur transition-all hover:border-fuchsia-400 hover:text-white flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 mb-1" />
            <span className="block leading-none [writing-mode:vertical-rl] uppercase">
              MARKETPLACE
            </span>
          </button>
        </div>

        {/* Expandable HQ Sidebar Body */}
        {open && (
          <div className="w-96 h-[calc(100vh-5rem)] bg-[#090d16]/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 font-sans">
            {/* Header & Tabs */}
            <div className="p-4 border-b border-slate-800 bg-[#06090d]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
                  <span>🏢</span> Platform HQ
                </h3>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={onOpenMarketplace}
                    className="p-1.5 bg-fuchsia-950/80 hover:bg-fuchsia-900 border border-fuchsia-500/40 text-fuchsia-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Platform Marketplace"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Store</span>
                  </button>
                  <button
                    onClick={onAddHuman}
                    className="p-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Add Human Staff"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Staff</span>
                  </button>
                </div>
              </div>

              {/* Tab Selector: Platform Tabs */}
              <div className="grid grid-cols-6 gap-1 bg-[#0f172a] p-1 rounded-xl border border-slate-800 text-[10px] font-medium text-slate-400">
                <button
                  onClick={() => setActiveTab("artifacts")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "artifacts" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Artifacts
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "skills" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab("playbooks")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "playbooks" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Plays
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "stats" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "activity" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-1 rounded-md flex items-center justify-center transition ${
                    activeTab === "settings" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Tab Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeTab === "artifacts" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Artifacts & Documents Vault
                  </h4>
                  <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl space-y-1">
                    <span className="font-semibold text-white">📄 System Architecture Blueprint</span>
                    <p className="text-[11px] text-slate-400">Generated by OpenClaw Coder • Updated 2m ago</p>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    Installed Skills & Capabilities
                  </h4>
                  <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl space-y-1">
                    <span className="font-semibold text-fuchsia-300">⚡ PR Code Reviewer Skill</span>
                    <p className="text-[11px] text-slate-400">Active across 3 AI Agent Workers</p>
                  </div>
                </div>
              )}

              {activeTab === "playbooks" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Workforce Routines & Playbooks
                  </h4>
                  <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl space-y-1 text-slate-300">
                    <span className="font-semibold text-slate-100">📖 Automated Standup Routine</span>
                    <p className="text-[11px] text-slate-400">Triggers daily 9:00 AM sync meeting in Standup Room.</p>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    Workforce Spend & Cost Analytics
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">Humans ({humanCount})</span>
                      <span className="text-sm font-bold text-emerald-400">$175.00/hr</span>
                    </div>
                    <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">AI Bots ({agentCount})</span>
                      <span className="text-sm font-bold text-blue-400">$770.00/mo</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <History className="w-4 h-4 text-cyan-400" />
                    Live Audit Activity Stream
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-300">
                      <span className="text-cyan-400 font-medium">🤖 OpenClaw Coder</span> updated 4-sided office layout
                    </div>
                    <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-300">
                      <span className="text-emerald-400 font-medium">👤 Alex Mercer</span> opened Top Personnel Bar
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <span>⚙️</span> Platform Settings
                  </h4>
                  <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Firebase Auth</span>
                      <span className="text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Firestore Collection</span>
                      <span className="text-cyan-400 font-mono text-[10px]">default</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
