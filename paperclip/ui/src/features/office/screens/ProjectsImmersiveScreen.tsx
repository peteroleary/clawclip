import React, { useState, useEffect } from "react";
import { X, FolderKanban, Plus, ExternalLink, Kanban, MessageSquare, Link2 } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { useOfficeStore } from "../../../store/officeStore.js";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

interface ProjectsImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const ProjectsImmersiveScreen: React.FC<ProjectsImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const openEntityBoard = useOfficeStore((state) => state.openEntityBoard);
  const openEntityChat = useOfficeStore((state) => state.openEntityChat);
  const openLinkModal = useOfficeStore((state) => state.openLinkModal);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [lead, setLead] = useState("");
  const [budget, setBudget] = useState("100000");
  const [targetDate, setTargetDate] = useState("2026-08-30");

  const [projects, setProjects] = useState([
    {
      id: "p1",
      name: "ClawClip Unified 3D Office Platform",
      status: "In Progress",
      progress: 85,
      tasks: "14 / 18 Completed",
      desc: "Merge Claw3D Three.js isometric canvas with Paperclip engine and full-screen immersive tools.",
      budget: 150000,
      spent: 125000,
    },
    {
      id: "p2",
      name: "ATM Treasury & Cost Tracking System",
      status: "Review",
      progress: 92,
      tasks: "8 / 9 Completed",
      desc: "Financial ledger station for managing model API token spend and company budgets.",
      budget: 50000,
      spent: 42000,
    },
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

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setProjects([
      {
        id: `p_${Date.now()}`,
        name: name.trim(),
        status: "Planning",
        progress: 0,
        tasks: "0 / 5 Completed",
        desc: desc || "New strategic initiative.",
        budget: parseInt(budget, 10) || 0,
        spent: 0,
      },
      ...projects,
    ]);

    setName("");
    setDesc("");
    setShowModal(false);
  };

  const headerActions = (
    <button
      onClick={() => setShowModal(true)}
      className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-950/50"
    >
      <Plus className="w-4 h-4" />
      <span>+ New Project</span>
    </button>
  );

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Company Projects & Initiatives"
      subtitle="Active project catalogs, progress metrics, and milestone tracking"
      icon={FolderKanban}
      iconColorClass="text-blue-400"
      iconBgClass="bg-blue-500/10 border-blue-500/30"
      headerActions={headerActions}
      closeOnEsc={!showModal}
    >
      {/* Content Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 max-w-5xl mx-auto w-full">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-blue-500/40 transition shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  {proj.name}
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400 cursor-pointer transition" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{proj.desc}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {proj.status}
              </span>
            </div>

            {/* Actions & Progress bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2 font-mono text-slate-400">
                  <span>Progress: {proj.progress}%</span>
                  <span>• {proj.tasks}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openLinkModal(proj.id, "project", proj.name)}
                    className="px-3 py-1 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" /> Link
                  </button>
                  <button
                    onClick={() => openEntityBoard(proj.id === "p1" ? "proj_clawclip" : "proj_atm")}
                    className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Kanban className="w-3.5 h-3.5" /> Open Board
                  </button>
                  <button
                    onClick={() => openEntityChat(proj.id === "p1" ? "proj_clawclip" : "proj_atm")}
                    className="px-3 py-1 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Open Chat
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              {/* Financial Utilization */}
              <div className="pt-2 border-t border-slate-800/50 mt-2 space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Budget Utilized: {proj.budget > 0 ? ((proj.spent / proj.budget) * 100).toFixed(1) : 0}%</span>
                  <span><span className="text-white">${proj.spent.toLocaleString()}</span> / ${proj.budget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${proj.budget > 0 && (proj.spent / proj.budget) >= 0.85 ? (proj.spent >= proj.budget ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                    style={{ width: `${proj.budget > 0 ? Math.min((proj.spent / proj.budget) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-400" /> Create New Project
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Agent Swarm V2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Project roadmap & goals..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Project Lead</label>
                <select
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Project Lead...</option>
                  {workforce.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.type === "human" ? "👤" : "🤖"} {m.name} ({m.title || m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Budget ($)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-950/50">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
