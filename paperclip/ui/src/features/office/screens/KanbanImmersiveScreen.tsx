import React, { useState, useEffect } from "react";
import { Kanban, Plus, X, CheckCircle2, Clock, AlertCircle, User } from "lucide-react";

interface IssueItem {
  id: string;
  identifier: string;
  title: string;
  status: "backlog" | "todo" | "in_progress" | "review" | "done";
  priority: string;
  assigneeName?: string;
}

interface KanbanImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
}

export const KanbanImmersiveScreen: React.FC<KanbanImmersiveScreenProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    async function fetchIssues() {
      if (!companyId) {
        setIssues(getMockIssues());
        return;
      }
      try {
        const res = await fetch(`/api/companies/${companyId}/issues`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setIssues(
              data.map((item: any) => ({
                id: item.id,
                identifier: item.identifier || `PAP-${item.id.slice(0, 4)}`,
                title: item.title,
                status: normalizeStatus(item.status),
                priority: item.priority || "medium",
                assigneeName: item.assignee?.name || "Unassigned",
              }))
            );
          } else {
            setIssues(getMockIssues());
          }
        } else {
          setIssues(getMockIssues());
        }
      } catch {
        setIssues(getMockIssues());
      }
    }

    if (isOpen) fetchIssues();
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  const columns = [
    { id: "todo", label: "To Do", color: "border-slate-700 bg-slate-900/50" },
    { id: "in_progress", label: "In Progress", color: "border-blue-500/30 bg-blue-950/20" },
    { id: "review", label: "In Review", color: "border-purple-500/30 bg-purple-950/20" },
    { id: "done", label: "Completed", color: "border-emerald-500/30 bg-emerald-950/20" },
  ];

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIssue: IssueItem = {
      id: `issue-${Date.now()}`,
      identifier: `PAP-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      status: "todo",
      priority: "high",
      assigneeName: "OpenClaw Coder (Bot)",
    };

    setIssues((prev) => [newIssue, ...prev]);
    setNewTitle("");
    setShowNewModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-5xl h-[700px] shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Kanban className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Interactive 3D Kanban Task Board
              </h2>
              <p className="text-xs text-slate-400">
                Synchronized Paperclip Issues & Agent Task Execution
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Board Columns Grid */}
        <div className="flex-1 p-6 grid grid-cols-4 gap-4 overflow-x-auto">
          {columns.map((col) => {
            const colIssues = issues.filter((i) => i.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-xl border p-3 ${col.color} space-y-3`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span>{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                    {colIssues.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 p-3 rounded-lg space-y-2 shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-cyan-400">
                          {issue.identifier}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                          {issue.priority}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-100 leading-snug">
                        {issue.title}
                      </p>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="w-3 h-3 text-cyan-400" />
                          {issue.assigneeName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Task Modal */}
        {showNewModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Create New Workspace Task
              </h3>

              <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement automated test pipeline"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow"
                  >
                    Add Task to Board
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

function normalizeStatus(s?: string): "todo" | "in_progress" | "review" | "done" {
  if (s === "in_progress" || s === "working" || s === "running") return "in_progress";
  if (s === "review" || s === "done") return s;
  return "todo";
}

function getMockIssues(): IssueItem[] {
  return [
    {
      id: "issue-1",
      identifier: "PAP-101",
      title: "Refactor Claw3D & Paperclip into unified 3D office platform",
      status: "in_progress",
      priority: "high",
      assigneeName: "OpenClaw Coder (Bot)",
    },
    {
      id: "issue-2",
      identifier: "PAP-102",
      title: "Add Human Employee configuration & 3D desk seating model",
      status: "review",
      priority: "high",
      assigneeName: "Alex Mercer (Human)",
    },
    {
      id: "issue-3",
      identifier: "PAP-103",
      title: "Setup ATM Treasury & Budget Ledger Station Terminal",
      status: "done",
      priority: "medium",
      assigneeName: "Sarah Chen (Human)",
    },
    {
      id: "issue-4",
      identifier: "PAP-104",
      title: "Integrate Daily Standup Room & Briefing Sync",
      status: "todo",
      priority: "low",
      assigneeName: "Hermes Manager (Bot)",
    },
  ];
}
