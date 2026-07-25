import React, { useState } from "react";
import { Network, Users, Building, ShieldCheck, X, Plus, GripVertical } from "lucide-react";
import type { Workforce3DMember } from "../types.js";

interface OrgChartImmersiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  workforce: Workforce3DMember[];
}

export const OrgChartImmersiveModal: React.FC<OrgChartImmersiveModalProps> = ({
  isOpen,
  onClose,
  workforce,
}) => {
  const [activeTab, setActiveTab] = useState<"org" | "departments" | "teams">("org");

  if (!isOpen) return null;

  const humans = workforce.filter((m) => m.type === "human");
  const agents = workforce.filter((m) => m.type === "agent");

  const departments = [
    { name: "Executive & Leadership", count: 2, head: "Alex Mercer", color: "border-purple-500/40 bg-purple-950/20" },
    { name: "Engineering & AI Ops", count: 5, head: "Sarah Chen", color: "border-cyan-500/40 bg-cyan-950/20" },
    { name: "Product & Design", count: 3, head: "Luke Skywalker", color: "border-emerald-500/40 bg-emerald-950/20" },
    { name: "Automated Agents & Swarms", count: agents.length, head: "Hermes Bot", color: "border-amber-500/40 bg-amber-950/20" },
  ];

  const teams = [
    { name: "Core Platform Team", members: ["Alex Mercer", "Sarah Chen", "OpenClaw Coder"] },
    { name: "AI Agent Swarm Alpha", members: ["Hermes Bot", "Claude Local", "Codex Assistant"] },
    { name: "UI & Visualization Unit", members: ["Luke Skywalker", "Cory", "Ben"] },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-5xl h-[750px] shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Organizational Hierarchy & Structure
              </h2>
              <p className="text-xs text-slate-400">
                Interactive Drag & Drop Workforce Topology
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 3 Personnel Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("org")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "org" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Org Structure
              </button>
              <button
                onClick={() => setActiveTab("departments")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "departments" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Departments
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "teams" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Teams
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "org" && (
            <div className="space-y-6 flex flex-col items-center">
              {/* Executive Level */}
              <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl max-w-md w-full text-center shadow-lg relative group">
                <div className="absolute top-3 left-3 text-purple-400 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Chief Executive</span>
                <h4 className="text-base font-bold text-white mt-1">CEO & Founder (Human)</h4>
                <p className="text-xs text-purple-300">Alex Mercer</p>
              </div>

              <div className="w-0.5 h-6 bg-slate-800" />

              {/* Management Level */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
                <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-center shadow-lg relative">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Head of Engineering</span>
                  <h4 className="text-sm font-bold text-white mt-1">Sarah Chen (Human)</h4>
                  <p className="text-xs text-cyan-300">Lead Architect</p>
                </div>
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center shadow-lg relative">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Chief AI Agent</span>
                  <h4 className="text-sm font-bold text-white mt-1">Hermes Orchestrator (Bot)</h4>
                  <p className="text-xs text-emerald-300">Autonomous Manager</p>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-800" />

              {/* Workforce Nodes Grid */}
              <div className="w-full">
                <h4 className="text-xs font-bold text-slate-400 mb-3 text-center uppercase tracking-wider">
                  Active Personnel Nodes ({workforce.length})
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {workforce.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl flex items-center space-x-3 cursor-grab hover:border-cyan-500/50 transition shadow"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{m.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{m.type} • {m.role || "Staff"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div className="grid grid-cols-2 gap-4">
              {departments.map((dept, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${dept.color} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">{dept.name}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-xs font-bold text-slate-300 border border-slate-800">
                      {dept.count} Members
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Department Lead: <span className="text-slate-200 font-semibold">{dept.head}</span></p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-4">
              {teams.map((team, i) => (
                <div key={i} className="p-4 bg-[#0f172a] border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-cyan-400">{team.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((m, j) => (
                      <span key={j} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
