import React, { useState, useEffect } from "react";
import {
  Kanban,
  Plus,
  X,
  User,
  Edit2,
  LayoutGrid,
  ChevronDown,
  ArrowRight,
  Trash2,
  CheckCircle2,
  MoveRight,
  Calendar,
  MessageSquare,
  Clock,
  Send,
} from "lucide-react";
import type { Workforce3DMember } from "../types.js";

export type IssueStatus =
  | "triage"
  | "todo"
  | "scheduled"
  | "ready"
  | "running"
  | "blocked"
  | "review"
  | "done"
  | "archived"
  | string;

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface IssueItem {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: string;
  assigneeName?: string;
  boardId?: string;
  dueDate?: string;
  comments?: TaskComment[];
}

interface KanbanColumn {
  id: string;
  label: string;
  color: string;
}

interface BoardConfig {
  id: string;
  name: string;
  feedsInto?: string; // Board ID that this board feeds tasks into
  columns: KanbanColumn[];
}

interface KanbanImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
  initialCreateMode?: boolean;
  workforce?: Workforce3DMember[];
}

const defaultColumns: KanbanColumn[] = [
  { id: "triage", label: "Triage", color: "border-slate-800 bg-slate-900/40" },
  { id: "todo", label: "To Do", color: "border-slate-700 bg-slate-900/60" },
  { id: "scheduled", label: "Scheduled", color: "border-indigo-500/30 bg-indigo-950/20" },
  { id: "ready", label: "Ready", color: "border-cyan-500/30 bg-cyan-950/20" },
  { id: "running", label: "Running", color: "border-blue-500/30 bg-blue-950/20" },
  { id: "blocked", label: "Blocked", color: "border-rose-500/30 bg-rose-950/20" },
  { id: "review", label: "Review", color: "border-purple-500/30 bg-purple-950/20" },
  { id: "done", label: "Done", color: "border-emerald-500/30 bg-emerald-950/20" },
  { id: "archived", label: "Archived", color: "border-slate-800/80 bg-slate-950/40" },
];

const initialBoards: BoardConfig[] = [
  {
    id: "master",
    name: "Master Executive Board",
    columns: defaultColumns,
  },
  {
    id: "engineering",
    name: "Engineering & Architecture",
    feedsInto: "master",
    columns: [
      { id: "todo", label: "To Do", color: "border-slate-700 bg-slate-900/60" },
      { id: "running", label: "In Development", color: "border-blue-500/30 bg-blue-950/20" },
      { id: "review", label: "Code Review", color: "border-purple-500/30 bg-purple-950/20" },
      { id: "done", label: "Merged", color: "border-emerald-500/30 bg-emerald-950/20" },
    ],
  },
  {
    id: "ai_swarm",
    name: "Autonomous Agent Swarm",
    feedsInto: "master",
    columns: [
      { id: "triage", label: "Agent Queue", color: "border-slate-800 bg-slate-900/40" },
      { id: "running", label: "Executing", color: "border-blue-500/30 bg-blue-950/20" },
      { id: "review", label: "Verification", color: "border-purple-500/30 bg-purple-950/20" },
      { id: "done", label: "Task Completed", color: "border-emerald-500/30 bg-emerald-950/20" },
    ],
  },
  {
    id: "social_media",
    name: "Social Media Campaign",
    feedsInto: "master",
    columns: [
      { id: "ideation", label: "Ideation & Copy", color: "border-slate-700 bg-slate-900/60" },
      { id: "graphics", label: "Graphics & Assets", color: "border-purple-500/30 bg-purple-950/20" },
      { id: "approval", label: "Review & Approval", color: "border-amber-500/30 bg-amber-950/20" },
      { id: "scheduled", label: "Scheduled", color: "border-blue-500/30 bg-blue-950/20" },
      { id: "published", label: "Published", color: "border-emerald-500/30 bg-emerald-950/20" },
    ],
  },
  {
    id: "new_hire",
    name: "New Hire Onboarding",
    feedsInto: "master",
    columns: [
      { id: "preboarding", label: "Pre-boarding", color: "border-slate-800 bg-slate-900/40" },
      { id: "day_1", label: "Day 1 Setup", color: "border-indigo-500/30 bg-indigo-950/20" },
      { id: "week_1", label: "Week 1 Orientation", color: "border-cyan-500/30 bg-cyan-950/20" },
      { id: "month_1", label: "Month 1 Goals", color: "border-blue-500/30 bg-blue-950/20" },
      { id: "completed", label: "Completed", color: "border-emerald-500/30 bg-emerald-950/20" },
    ],
  },
];

export const KanbanImmersiveScreen: React.FC<KanbanImmersiveScreenProps> = ({
  isOpen,
  onClose,
  companyId,
  initialCreateMode = false,
  workforce = [],
}) => {
  const [boards, setBoards] = useState<BoardConfig[]>(initialBoards);
  const [activeBoardId, setActiveBoardId] = useState<string>("master");
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);

  const currentBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempBoardTitle, setTempBoardTitle] = useState(currentBoard.name);

  // Expanded card modal state
  const [selectedCard, setSelectedCard] = useState<IssueItem | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newStatus, setNewStatus] = useState<IssueStatus>("todo");
  const [newAssignee, setNewAssignee] = useState<string>("");
  const [showNewModal, setShowNewModal] = useState(initialCreateMode);

  // New board modal state
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardTitleInput, setNewBoardTitleInput] = useState("");
  const [newBoardListsInput, setNewBoardListsInput] = useState("Triage, To Do, In Progress, Review, Done");
  const [newBoardFeedsInto, setNewBoardFeedsInto] = useState("master");

  // 1. ESC Key closes kanban board or open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (selectedCard) {
          setSelectedCard(null);
        } else if (showNewModal) {
          setShowNewModal(false);
        } else if (showNewBoardModal) {
          setShowNewBoardModal(false);
        } else if (showBoardDropdown) {
          setShowBoardDropdown(false);
        } else if (isEditingTitle) {
          setIsEditingTitle(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedCard, showNewModal, showNewBoardModal, showBoardDropdown, isEditingTitle, onClose]);

  useEffect(() => {
    if (isOpen && initialCreateMode) {
      setShowNewModal(true);
    }
  }, [isOpen, initialCreateMode]);

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
                description: item.description || "",
                status: normalizeStatus(item.status),
                priority: item.priority || "medium",
                assigneeName: item.assignee?.name || "Unassigned",
                boardId: item.boardId || "master",
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

  const [newDueDate, setNewDueDate] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");

  if (!isOpen) return null;

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignee = newAssignee || (workforce.length > 0 ? workforce[0].name : "OpenClaw Coder (Bot)");

    if (companyId) {
      try {
        await fetch(`/api/companies/${companyId}/issues`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            priority: newPriority,
            status: newStatus,
            assigneeName: assignee,
            boardId: activeBoardId,
            dueDate: newDueDate,
          }),
        });
      } catch (err) {
        console.error("Failed to post issue to backend:", err);
      }
    }

    const newIssue: IssueItem = {
      id: `issue-${Date.now()}`,
      identifier: `PAP-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      description: newDescription,
      status: newStatus,
      priority: newPriority,
      assigneeName: assignee,
      boardId: activeBoardId,
      dueDate: newDueDate || undefined,
      comments: [],
    };

    setIssues((prev) => [newIssue, ...prev]);
    setNewTitle("");
    setNewDescription("");
    setNewStatus("todo");
    setNewAssignee("");
    setNewDueDate("");
    setShowNewModal(false);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitleInput.trim()) return;

    const newId = `board_${Date.now()}`;
    const parsedLists = newBoardListsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const generatedColumns: KanbanColumn[] =
      parsedLists.length > 0
        ? parsedLists.map((name) => ({
            id: name.toLowerCase().replace(/\s+/g, "_"),
            label: name,
            color: "border-slate-700 bg-slate-900/60",
          }))
        : defaultColumns;

    const newBoard: BoardConfig = {
      id: newId,
      name: newBoardTitleInput.trim(),
      feedsInto: newBoardFeedsInto === "none" ? undefined : newBoardFeedsInto,
      columns: generatedColumns,
    };

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardId(newId);
    setTempBoardTitle(newBoardTitleInput.trim());
    setNewBoardTitleInput("");
    setShowNewBoardModal(false);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData("text/plain", issueId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: IssueStatus) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData("text/plain");
    if (!issueId) return;

    setIssues((prev) =>
      prev.map((item) => (item.id === issueId ? { ...item, status: targetStatus } : item))
    );
  };

  // Filter issues for active board
  const visibleIssues = issues.filter((issue) => {
    if (activeBoardId === "master") return true;
    return issue.boardId === activeBoardId || !issue.boardId;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0 relative z-20">
          <div className="flex items-center space-x-3">
            {/* Clickable Board Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBoardDropdown(!showBoardDropdown)}
                className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 transition flex items-center gap-1 group"
                title="Select Active Kanban Board"
              >
                <Kanban className="w-6 h-6" />
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </button>

              {/* Board Selection Dropdown */}
              {showBoardDropdown && (
                <div className="absolute top-12 left-0 w-72 bg-[#0d131f] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Board
                  </div>

                  {boards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBoardId(b.id);
                        setTempBoardTitle(b.name);
                        setShowBoardDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                        activeBoardId === b.id
                          ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div>
                        <div>{b.name}</div>
                        {b.feedsInto && (
                          <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
                            <MoveRight className="w-2.5 h-2.5" /> Feeds into Master
                          </div>
                        )}
                      </div>
                      {activeBoardId === b.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setShowBoardDropdown(false);
                        setShowNewBoardModal(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-cyan-400 hover:bg-cyan-950/40 font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Custom Board
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              {/* Editable Board Title */}
              {isEditingTitle ? (
                <input
                  type="text"
                  value={tempBoardTitle}
                  onChange={(e) => setTempBoardTitle(e.target.value)}
                  onBlur={() => {
                    if (tempBoardTitle.trim()) {
                      setBoards((prev) =>
                        prev.map((b) =>
                          b.id === activeBoardId ? { ...b, name: tempBoardTitle.trim() } : b
                        )
                      );
                    }
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (tempBoardTitle.trim()) {
                        setBoards((prev) =>
                          prev.map((b) =>
                            b.id === activeBoardId ? { ...b, name: tempBoardTitle.trim() } : b
                          )
                        );
                      }
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  className="bg-slate-900 border border-cyan-500/60 rounded px-2.5 py-0.5 text-base font-bold text-white focus:outline-none shadow-inner"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2
                    onClick={() => {
                      setTempBoardTitle(currentBoard.name);
                      setIsEditingTitle(true);
                    }}
                    className="text-lg font-bold text-white flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition group"
                    title="Click to edit board title"
                  >
                    <span>{currentBoard.name}</span>
                    <Edit2 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-cyan-400 transition" />
                  </h2>

                  {currentBoard.feedsInto && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                      <MoveRight className="w-3 h-3" /> Feeds Master Board
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-400">
                Drag cards to move status • Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">ESC</kbd> to exit board
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewBoardModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>+ New Board</span>
            </button>

            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/50 border border-cyan-400/30 transition hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Close Board (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Board Columns Drag-and-Drop Grid */}
        <div className="flex-1 p-6 flex space-x-4 overflow-x-auto overflow-y-hidden">
          {currentBoard.columns.map((col) => {
            const colIssues = visibleIssues.filter((i) => i.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-72 shrink-0 flex flex-col rounded-2xl border p-3.5 ${col.color} space-y-3 h-full transition-colors`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-200 pb-2 border-b border-slate-800/80">
                  <span className="uppercase tracking-wider text-[11px] font-mono">{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {colIssues.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colIssues.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-[11px] text-slate-600 italic">
                      Drop cards here
                    </div>
                  ) : (
                    colIssues.map((issue) => (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue.id)}
                        onClick={() => setSelectedCard(issue)}
                        className="bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/60 p-3.5 rounded-xl space-y-2.5 shadow-md hover:shadow-cyan-950/40 transition cursor-pointer group active:opacity-60 select-none"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-cyan-400">
                            {issue.identifier}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            {issue.priority}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-slate-100 leading-snug group-hover:text-cyan-200 transition">
                          {issue.title}
                        </p>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <User className="w-3 h-3 text-cyan-400" />
                            {issue.assigneeName || "Unassigned"}
                          </span>

                          <div className="flex items-center space-x-2">
                            {issue.dueDate && (
                              <span className="flex items-center gap-1 text-[9px] text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                                <Calendar className="w-2.5 h-2.5" />
                                {issue.dueDate}
                              </span>
                            )}
                            {issue.comments && issue.comments.length > 0 && (
                              <span className="flex items-center gap-0.5 text-[9px] text-cyan-300 font-semibold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                <MessageSquare className="w-2.5 h-2.5 text-cyan-400" />
                                {issue.comments.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Expanded Card Detail Modal */}
        {selectedCard && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {selectedCard.identifier}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {selectedCard.priority}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white mb-2">{selectedCard.title}</h3>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 min-h-[70px]">
                  {selectedCard.description || "No detailed description provided for this task."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Status / Column</label>
                  <select
                    value={selectedCard.status}
                    onChange={(e) => {
                      const updatedStatus = e.target.value as IssueStatus;
                      setSelectedCard({ ...selectedCard, status: updatedStatus });
                      setIssues((prev) =>
                        prev.map((i) => (i.id === selectedCard.id ? { ...i, status: updatedStatus } : i))
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 capitalize"
                  >
                    {currentBoard.columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assigned To</label>
                  <select
                    value={selectedCard.assigneeName || ""}
                    onChange={(e) => {
                      const updatedAssignee = e.target.value;
                      setSelectedCard({ ...selectedCard, assigneeName: updatedAssignee });
                      setIssues((prev) =>
                        prev.map((i) =>
                          i.id === selectedCard.id ? { ...i, assigneeName: updatedAssignee } : i
                        )
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {workforce.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.type === "human" ? "👤" : "🤖"} {m.name} ({m.title || m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Due Date</label>
                  <input
                    type="date"
                    value={selectedCard.dueDate || ""}
                    onChange={(e) => {
                      const dateVal = e.target.value;
                      setSelectedCard({ ...selectedCard, dueDate: dateVal });
                      setIssues((prev) =>
                        prev.map((i) => (i.id === selectedCard.id ? { ...i, dueDate: dateVal } : i))
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Comments ({selectedCard.comments?.length || 0})</span>
                  </h4>
                </div>

                {/* Comments List */}
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {(!selectedCard.comments || selectedCard.comments.length === 0) ? (
                    <p className="text-[11px] text-slate-500 italic">No comments yet. Start the conversation below.</p>
                  ) : (
                    selectedCard.comments.map((c) => (
                      <div key={c.id} className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-cyan-300 flex items-center gap-1">
                            <User className="w-3 h-3 text-cyan-400" /> {c.author}
                          </span>
                          <span className="font-mono text-slate-500">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-200 text-[11px] leading-snug">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commentText.trim()) {
                        e.preventDefault();
                        const newComment: TaskComment = {
                          id: `c_${Date.now()}`,
                          author: workforce.length > 0 ? workforce[0].name : "Alex Mercer",
                          text: commentText.trim(),
                          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        };
                        const updatedComments = [...(selectedCard.comments || []), newComment];
                        setSelectedCard({ ...selectedCard, comments: updatedComments });
                        setIssues((prev) =>
                          prev.map((i) => (i.id === selectedCard.id ? { ...i, comments: updatedComments } : i))
                        );
                        setCommentText("");
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!commentText.trim()) return;
                      const newComment: TaskComment = {
                        id: `c_${Date.now()}`,
                        author: workforce.length > 0 ? workforce[0].name : "Alex Mercer",
                        text: commentText.trim(),
                        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      };
                      const updatedComments = [...(selectedCard.comments || []), newComment];
                      setSelectedCard({ ...selectedCard, comments: updatedComments });
                      setIssues((prev) =>
                        prev.map((i) => (i.id === selectedCard.id ? { ...i, comments: updatedComments } : i))
                      );
                      setCommentText("");
                    }}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIssues((prev) => prev.filter((i) => i.id !== selectedCard.id));
                    setSelectedCard(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow"
                >
                  Done Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Create Task Modal with Workforce Assignee */}
        {showNewModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-400" /> Create New Task
                </h3>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement automated test pipeline"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the task..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Assign To (Human / Agent)</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Assignee...</option>
                    {workforce.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.type === "human" ? "👤" : "🤖"} {m.name} ({m.title || m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Status / List</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 capitalize"
                    >
                      {currentBoard.columns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/50"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Create New Board Modal with Parent "Feeds Into" Option */}
        {showNewBoardModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cyan-400" /> Create Custom Board
                </h3>
                <button
                  onClick={() => setShowNewBoardModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateBoard} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Load Template Preset (Optional)</label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "social_media") {
                        setNewBoardTitleInput("Social Media Campaign");
                        setNewBoardListsInput("Ideation & Copy, Graphics & Assets, Review & Approval, Scheduled, Published");
                      } else if (val === "new_hire") {
                        setNewBoardTitleInput("New Hire Onboarding");
                        setNewBoardListsInput("Pre-boarding, Day 1 Setup, Week 1 Orientation, Month 1 Goals, Completed");
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Custom Board (Empty)</option>
                    <option value="social_media">📢 Social Media Campaign Template</option>
                    <option value="new_hire">👋 New Hire Onboarding Template</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Board Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Sprint Roadmap"
                    value={newBoardTitleInput}
                    onChange={(e) => setNewBoardTitleInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Lists / Columns (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Triage, Backlog, In Progress, QA, Done"
                    value={newBoardListsInput}
                    onChange={(e) => setNewBoardListsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Feeds Tasks Into Parent Board
                  </label>
                  <select
                    value={newBoardFeedsInto}
                    onChange={(e) => setNewBoardFeedsInto(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="none">None (Standalone Board)</option>
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Tasks from this board will automatically mirror into the selected parent board (e.g. Master Executive Board).
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewBoardModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/50"
                  >
                    Create Board
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

function normalizeStatus(s?: string): IssueStatus {
  if (!s) return "todo";
  const lower = s.toLowerCase();
  if (lower === "triage") return "triage";
  if (lower === "scheduled") return "scheduled";
  if (lower === "ready") return "ready";
  if (lower === "running" || lower === "in_progress" || lower === "working") return "running";
  if (lower === "blocked") return "blocked";
  if (lower === "review" || lower === "in_review") return "review";
  if (lower === "done" || lower === "completed") return "done";
  if (lower === "archived") return "archived";
  return "todo";
}

function getMockIssues(): IssueItem[] {
  return [
    {
      id: "issue-1",
      identifier: "PAP-101",
      title: "Refactor Claw3D & Paperclip into unified 3D office platform",
      description: "Seamlessly integrate R3F isometric office engine with Paperclip backend and SPA Zustand routing.",
      status: "running",
      priority: "high",
      assigneeName: "OpenClaw Coder",
      boardId: "engineering",
    },
    {
      id: "issue-2",
      identifier: "PAP-102",
      title: "Add Human Employee configuration & 3D desk seating model",
      description: "Define workforce schemas for human employees and position avatars on the 3D desk slots.",
      status: "review",
      priority: "high",
      assigneeName: "Alex Mercer",
      boardId: "engineering",
    },
    {
      id: "issue-3",
      identifier: "PAP-103",
      title: "Setup ATM Treasury & Budget Ledger Station Terminal",
      description: "Interactive ATM terminal in office space for managing company finances and spend.",
      status: "done",
      priority: "medium",
      assigneeName: "Sarah Chen",
      boardId: "master",
    },
    {
      id: "issue-4",
      identifier: "PAP-104",
      title: "Integrate Daily Standup Room & Briefing Sync",
      description: "Meeting room screen for agent/human daily standup briefings.",
      status: "todo",
      priority: "low",
      assigneeName: "Hermes Manager",
      boardId: "ai_swarm",
    },
    {
      id: "issue-5",
      identifier: "PAP-105",
      title: "Incoming untriaged feature request",
      description: "Feature request submitted from client dashboard requiring triaging.",
      status: "triage",
      priority: "medium",
      assigneeName: "Unassigned",
      boardId: "master",
    },
    // Social Media Campaign seed tasks
    {
      id: "issue-sm-1",
      identifier: "SM-101",
      title: "Draft Q4 Product Launch Tweet Sequence & Copy",
      description: "Prepare 5-part thread detailing the new 3D office features and Paperclip engine release.",
      status: "ideation",
      priority: "high",
      assigneeName: "Alex Mercer",
      boardId: "social_media",
      dueDate: "2026-07-28",
    },
    {
      id: "issue-sm-2",
      identifier: "SM-102",
      title: "Design Hero Banner 1200x675 for Campaign",
      description: "Render high resolution 3D office isometric graphic for social media preview cards.",
      status: "graphics",
      priority: "medium",
      assigneeName: "Sarah Chen",
      boardId: "social_media",
      dueDate: "2026-07-29",
    },
    {
      id: "issue-sm-3",
      identifier: "SM-103",
      title: "Review & Approve LinkedIn Post Copy",
      description: "Final approval step before scheduling campaign broadcast.",
      status: "approval",
      priority: "high",
      assigneeName: "Alex Mercer",
      boardId: "social_media",
    },
    // New Hire Onboarding seed tasks
    {
      id: "issue-nh-1",
      identifier: "HR-101",
      title: "Provision Google Workspace & Slack Account",
      description: "Create email alias, invite to workspace channels, and assign default role permissions.",
      status: "preboarding",
      priority: "urgent",
      assigneeName: "Hermes Manager",
      boardId: "new_hire",
      dueDate: "2026-07-27",
    },
    {
      id: "issue-nh-2",
      identifier: "HR-102",
      title: "Hardware Laptop Setup & Security Keys",
      description: "Configure MacBook M3, install developer tools, YubiKey 2FA setup.",
      status: "day_1",
      priority: "high",
      assigneeName: "Sarah Chen",
      boardId: "new_hire",
    },
    {
      id: "issue-nh-3",
      identifier: "HR-103",
      title: "1-on-1 Intro Meetings with Team Leads",
      description: "Schedule 30-minute introductory syncs with engineering and product leads.",
      status: "week_1",
      priority: "medium",
      assigneeName: "Alex Mercer",
      boardId: "new_hire",
    },
  ];
}

