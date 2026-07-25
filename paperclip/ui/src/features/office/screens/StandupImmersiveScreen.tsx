import React from "react";
import { Users, Sparkles, X, CheckCircle, Clock } from "lucide-react";

interface StandupImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandupImmersiveScreen: React.FC<StandupImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const updates = [
    {
      author: "Alex Mercer (VP Product & Eng)",
      type: "human",
      done: "Approved unified 3D office architecture plan & database migration.",
      today: "Coordinating human staff and AI bot team desk assignments.",
      blocker: "None",
    },
    {
      author: "OpenClaw Coder (Bot)",
      type: "agent",
      done: "Executed typecheck validation on database, server, and ui packages.",
      today: "Refactoring isometric retro office viewport & station modals.",
      blocker: "None",
    },
    {
      author: "Sarah Chen (Senior Full-Stack)",
      type: "human",
      done: "Created human_employees REST API endpoints.",
      today: "Testing workforce roster synchronization across client state.",
      blocker: "None",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-3xl h-[600px] shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Daily Standup Meeting Room
              </h2>
              <p className="text-xs text-slate-400">
                Synchronized Standup Briefings for AI Agents & Human Staff
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {updates.map((update, idx) => (
            <div
              key={idx}
              className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  {update.type === "human" ? "👤" : "🤖"} {update.author}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Standup Reported
                </span>
              </div>

              <div className="space-y-1 pt-1 text-slate-300">
                <p>
                  <strong className="text-emerald-400">Yesterday:</strong> {update.done}
                </p>
                <p>
                  <strong className="text-cyan-400">Today:</strong> {update.today}
                </p>
                <p>
                  <strong className="text-amber-400">Blockers:</strong> {update.blocker}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
