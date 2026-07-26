import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Sparkles, CheckSquare, Plus, Flag, X, Edit2, Trash2 } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

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
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
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
      if (e.key === "Escape" && isOpen && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showModal]);

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTargetId) {
      if (category === "Goal") {
        setGoals(goals.map(g => g.id === editingTargetId ? { ...g, title: title.trim(), target: targetVal, owner: owner || "Alex Mercer" } : g));
      } else if (category === "Action") {
        setActions(actions.map(a => a.id === editingTargetId ? { ...a, title: title.trim(), owner: owner || "Alex Mercer" } : a));
      }
      setEditingTargetId(null);
    } else {
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
    }

    setTitle("");
    setShowModal(false);
  };

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Targets, Goals & Performance Insights"
      subtitle="Strategic milestone goals, KPI metrics, AI diagnostic insights, and action items"
      icon={Target}
      iconColorClass="text-rose-400"
      iconBgClass="bg-rose-500/10 border-rose-500/30"
      closeOnEsc={!showModal}
      showHeader={false}
    >
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-slate-800/80">
          {/* Left side: Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
            <button onClick={() => setActiveTab("goals")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "goals" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Goals ({goals.length})</button>
            <button onClick={() => setActiveTab("kpis")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "kpis" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>KPIs ({kpis.length})</button>
            <button onClick={() => setActiveTab("insights")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "insights" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Insights ({insights.length})</button>
            <button onClick={() => setActiveTab("actions")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "actions" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Actions ({actions.length})</button>
          </div>

          {/* Right side: Add button */}
          <div className="relative group">
            <button
              onClick={() => {
                setTitle("");
                setCategory("Goal");
                setShowModal(true);
              }}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              Add Target
            </span>
          </div>
        </div>
        {activeTab === "goals" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {goals.map((g) => (
              <div key={g.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-rose-500/40 transition">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Flag className="w-4 h-4 text-rose-400" /> {g.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                      {g.status}
                    </span>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditingTargetId(g.id);
                          setTitle(g.title);
                          setCategory("Goal");
                          setTargetVal(g.target);
                          setOwner(g.owner);
                          setShowModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Edit
                      </span>
                    </div>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setGoals(goals.filter(item => item.id !== g.id));
                        }}
                        className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
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
              <div key={act.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-rose-500/40 transition">
                <div className="flex items-center space-x-3">
                  <CheckSquare className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{act.title}</h4>
                    <p className="text-xs text-slate-400">Assigned to: {act.owner}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/20 rounded-md">{act.status}</span>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingTargetId(act.id);
                        setTitle(act.title);
                        setCategory("Action");
                        setOwner(act.owner);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setActions(actions.filter(item => item.id !== act.id));
                      }}
                      className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
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
    </ImmersiveScreenWrapper>
  );
};
