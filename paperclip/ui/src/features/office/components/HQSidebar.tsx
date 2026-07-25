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

export type HQSidebarTab = "inbox" | "history" | "kanban" | "playbooks" | "analytics";

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
  const [activeTab, setActiveTab] = useState<HQSidebarTab>("inbox");

  const humanCount = workforce.filter((m) => m.type === "human").length;
  const agentCount = workforce.filter((m) => m.type === "agent").length;

  return (
    <aside className="pointer-events-none fixed inset-y-0 right-0 z-30 flex justify-end">
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
                  <span>🏢</span> Headquarters Control
                </h3>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      setActiveTab("kanban");
                    }}
                    className="p-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Dispatch New Task"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>
                  <button
                    onClick={onAddHuman}
                    className="p-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Add Human Staff"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Staff</span>
                  </button>
                  <button
                    onClick={onAddAgent}
                    className="p-1.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Add AI Agent"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Agent</span>
                  </button>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-5 gap-1 bg-[#0f172a] p-1 rounded-xl border border-slate-800 text-[11px] font-medium text-slate-400">
                <button
                  onClick={() => setActiveTab("inbox")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === "inbox" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  <Inbox className="w-3 h-3" />
                  <span>Inbox</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === "history" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  <History className="w-3 h-3" />
                  <span>History</span>
                </button>
                <button
                  onClick={() => setActiveTab("kanban")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === "kanban" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  <Kanban className="w-3 h-3" />
                  <span>Board</span>
                </button>
                <button
                  onClick={() => setActiveTab("playbooks")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === "playbooks" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === "analytics" ? "bg-cyan-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Stats</span>
                </button>
              </div>
            </div>

            {/* Tab Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeTab === "inbox" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Inbox className="w-4 h-4 text-cyan-400" />
                    Attention Inbox & Approvals
                  </h4>
                  <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All Agent Tasks Healthy
                      </span>
                      <span className="text-[10px] text-slate-500">Just now</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      No urgent approval blockers. Autonomous workforce is active across 3D office desks.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <History className="w-4 h-4 text-cyan-400" />
                    Recent Activity Audit Stream
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-300">
                      <span className="text-cyan-400 font-medium">🤖 OpenClaw Coder</span> updated schema definition in <span className="text-slate-100 font-mono">human_employees.ts</span>
                    </div>
                    <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg text-slate-300">
                      <span className="text-emerald-400 font-medium">👤 Alex Mercer</span> assigned 3D desk seat #1 in Main Office
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "kanban" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Kanban className="w-4 h-4 text-cyan-400" />
                    Active Issues Task Board
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl space-y-1">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">In Progress</span>
                      <p className="font-bold text-slate-100 text-xs">PAP-101: 3D Office HQ Interface Integration</p>
                      <p className="text-[11px] text-slate-400">Assigned: Alex Mercer (Human) & OpenClaw (Bot)</p>
                    </div>
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
                    <span className="font-semibold text-slate-100">📖 Automated PR Review & CI Pipeline</span>
                    <p className="text-[11px] text-slate-400">Runs daily standup and reviews all merged PRs automatically.</p>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
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
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
