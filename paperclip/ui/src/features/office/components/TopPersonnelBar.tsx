import React, { useState } from "react";
import { Users, Bot, Network, MessageSquare, Info, X, ChevronRight } from "lucide-react";
import type { Workforce3DMember } from "../types.js";

interface TopPersonnelBarProps {
  workforce: Workforce3DMember[];
  onSelectMember: (member: Workforce3DMember) => void;
  onOpenOrgChart: () => void;
}

export const TopPersonnelBar: React.FC<TopPersonnelBarProps> = ({
  workforce,
  onSelectMember,
  onOpenOrgChart,
}) => {
  const [hoveredMember, setHoveredMember] = useState<Workforce3DMember | null>(null);
  const [infoMember, setInfoMember] = useState<Workforce3DMember | null>(null);

  const humans = workforce.filter((m) => m.type === "human");
  const agents = workforce.filter((m) => m.type === "agent");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getColorClass = (id: string, type: "human" | "agent") => {
    const colors =
      type === "human"
        ? [
            "bg-emerald-600 border-emerald-400 text-emerald-100",
            "bg-teal-600 border-teal-400 text-teal-100",
            "bg-cyan-600 border-cyan-400 text-cyan-100",
            "bg-green-600 border-green-400 text-green-100",
          ]
        : [
            "bg-purple-600 border-purple-400 text-purple-100",
            "bg-indigo-600 border-indigo-400 text-indigo-100",
            "bg-blue-600 border-blue-400 text-blue-100",
            "bg-violet-600 border-violet-400 text-violet-100",
          ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
    return colors[hash % colors.length];
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-[#06090d]/95 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shadow-2xl select-none">
        <div className="flex items-center space-x-6 w-full max-w-7xl mx-auto justify-between">
          {/* Section 1: Humans */}
          <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800/80 shrink-0">
            <div className="flex items-center space-x-1.5 mr-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Humans</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded-full border border-emerald-500/30">
                {humans.length}
              </span>
            </div>

            <div className="flex items-center -space-x-1.5 overflow-x-auto max-w-[240px] py-1 scrollbar-none">
              {humans.map((member) => (
                <div
                  key={member.id}
                  className="relative group shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredMember(member)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <button
                    onClick={() => onSelectMember(member)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-md ${getColorClass(
                      member.id,
                      "human"
                    )}`}
                  >
                    {getInitials(member.name)}
                  </button>

                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                      member.status === "active" || member.status === "working"
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Agents */}
          <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800/80 shrink-0">
            <div className="flex items-center space-x-1.5 mr-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Agents</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded-full border border-purple-500/30">
                {agents.length}
              </span>
            </div>

            <div className="flex items-center -space-x-1.5 overflow-x-auto max-w-[280px] py-1 scrollbar-none">
              {agents.map((member) => (
                <div
                  key={member.id}
                  className="relative group shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredMember(member)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <button
                    onClick={() => onSelectMember(member)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-md ${getColorClass(
                      member.id,
                      "agent"
                    )}`}
                  >
                    {getInitials(member.name)}
                  </button>

                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${
                      member.status === "active" || member.status === "working"
                        ? "bg-purple-400"
                        : "bg-slate-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Org Chart Trigger Modal Button */}
          <button
            onClick={onOpenOrgChart}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-900/30 border border-cyan-400/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Network className="w-4 h-4 text-cyan-200" />
            <span>Org Chart</span>
          </button>
        </div>
      </header>

      {/* Hover Reveal Floating Tooltip Card */}
      {hoveredMember && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-40 bg-[#0f172a]/95 border border-cyan-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center space-x-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getColorClass(
                hoveredMember.id,
                hoveredMember.type
              )}`}
            >
              {getInitials(hoveredMember.name)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white">{hoveredMember.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                  {hoveredMember.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{hoveredMember.role || "Team Member"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={() => setInfoMember(hoveredMember)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition"
              title="Member Info"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectMember(hoveredMember)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition"
              title="Open Chat Window"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getColorClass(
                    infoMember.id,
                    infoMember.type
                  )}`}
                >
                  {getInitials(infoMember.name)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{infoMember.name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{infoMember.type} Personnel</p>
                </div>
              </div>
              <button
                onClick={() => setInfoMember(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Role</span>
                <span className="font-medium text-slate-200">{infoMember.role || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-emerald-400 capitalize">{infoMember.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-400">{infoMember.id}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onSelectMember(infoMember);
                  setInfoMember(null);
                }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Direct Chat Window</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
