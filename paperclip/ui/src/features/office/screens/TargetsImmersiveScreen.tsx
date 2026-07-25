import React, { useState, useEffect } from "react";
import { X, Target, TrendingUp, Sparkles, CheckSquare, Plus, Flag, ShieldCheck } from "lucide-react";
import type { Workforce3DMember } from "../types.js";

interface TargetsImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const TargetsImmersiveScreen: React.FC<TargetsImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const [activeTab, setActiveTab] = useState<"goals" | "kpis" | "insights" | "actions">("goals");

  // Add Target Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Goal" | "KPI" | "Action">("Goal");
  const [targetVal, setTargetVal] = useState("100%");
  const [owner, setOwner] = useState("");
  const [deadline, setDeadline] = useState("2026-09-30");

  const [goals, setGoals] = useState([
    { id: "g1", title: "Complete 3D Office Platform & Immersive Integration", progress: 85, target: "100%", status: "On Track", owner: "Sarah Chen" },
    { id: "g2", title: "Achieve 99.9% Autonomous Swarm Execution Reliability", progress: 92, target: "99.9%", status: "Exceeding", owner: "Hermes Manager" },
  ]);

  const [kpis] = useState([
    { id: "k1", name: "LLM Token Efficiency Index", val: "94.2%", change: "+4.1% vs last week", status: "Healthy" },
    { id: "k2", name: "Task Completion Velocity", val: "42 tasks/wk", change: "+12 tasks", status: "High" },
    { id: "k3", name: "Monthly Recurring Treasury Revenue", val: "$48,500", change: "+15% MoM", status: "Growing" },
  ]);

  const [insights] = useState([
    { id: "i1", title: "AI Swarm Task Delegation Optimization", desc: "Delegating code review tasks to OpenClaw Coder reduced pull request merge latency by 35%.", priority: "High" },
    { id: "i2", title: "Facility Space Utilization Alert", desc: "Classroom office capacity is at 80% occupancy. Recommend expanding floorplan layout.", priority: "Medium" },
  ]);

  const [actions, setActions] = useState([
    { id: "a1", title: "Deploy Automated Memory Indexer for Agents", owner: "OpenClaw Coder", status: "Pending" },
    { id: "a2", title: "Audit Monthly Token Expenditure & ATM Ledger", owner: "Alex Mercer", status: "Completed" },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showModal) setShowModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showModal, onClose]);

  if (!isOpen) return null;

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (category === "Goal") {
      setGoals([
        { id: `g_${Date.now()}`, title: title.trim(), progress: 0, target: targetVal, status: "Planning", owner: owner || "Alex Mercer" },
        ...goals,
      ]);
    } else if (category === "Action") {
      setActions([
        { id: `a_${Date.now()}`, title: title.trim(), owner: owner || "Alex Mercer", status: "Pending" },
        ...actions,
      ]);
    }

    setTitle("");
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Targets, Goals & Performance Insights</h2>
              <p className="text-xs text-slate-400">Strategic milestone goals, KPI metrics, AI diagnostic insights, and action items</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("goals")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "goals" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Goals ({goals.length})
              </button>
              <button
                onClick={() => setActiveTab("kpis")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "kpis" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                KPIs ({kpis.length})
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "insights" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Insights ({insights.length})
              </button>
              <button
                onClick={() => setActiveTab("actions")}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeTab === "actions" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Actions ({actions.length})
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Target</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "goals" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {goals.map((g) => (
                <div key={g.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-rose-500/40 transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <Flag className="w-4 h-4 text-rose-400" /> {g.title}
                    </h4>
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                      {g.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Progress: {g.progress}%</span>
                      <span>Target: {g.target} • Owner: {g.owner}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full" style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "kpis" && (
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {kpis.map((k) => (
                <div key={k.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-rose-500/40 transition">
                  <span className="text-xs text-slate-400 font-medium">{k.name}</span>
                  <div className="text-2xl font-bold text-rose-400 font-mono">{k.val}</div>
                  <span className="text-[10px] text-emerald-400 block font-semibold">{k.change}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {insights.map((ins) => (
                <div key={ins.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-rose-500/40 transition">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> {ins.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {ins.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ins.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-3 max-w-4xl mx-auto">
              {actions.map((act) => (
                <div key={act.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="w-5 h-5 text-rose-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{act.title}</h4>
                      <p className="text-xs text-slate-400">Assigned to: {act.owner}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">{act.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Target Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-400" /> Add Target / Goal / Action
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTarget} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Achieve 10,000 Active Users"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Goal">Goal Milestone</option>
                    <option value="Action">Action Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Owner</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="">Select Owner...</option>
                    {workforce.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.type === "human" ? "👤" : "🤖"} {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-950/50">
                    Create Target
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
