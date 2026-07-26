import React, { useState, useEffect } from "react";
import { X, Brain, Key, FileText, Plus, Lock, Database, Edit2, Trash2 } from "lucide-react";
import ForceGraph3D from "react-force-graph-3d";
import { supabase } from "../../../lib/supabaseClient.js";
import type { Workforce3DMember } from "../types.js";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

interface MemoryImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const MemoryImmersiveScreen: React.FC<MemoryImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const [activeTab, setActiveTab] = useState<"memories" | "notes" | "providers" | "graph">("memories");
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loadingGraph, setLoadingGraph] = useState(false);

  // Modals state
  const [showMemModal, setShowMemModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Memory Form state
  const [memAgent, setMemAgent] = useState("");
  const [memKey, setMemKey] = useState("");
  const [memValue, setMemValue] = useState("");

  // Note Form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Lists state
  const [memories, setMemories] = useState([
    { id: "m1", agent: "OpenClaw Coder", key: "r3f_office_layout", value: "3D camera position centered at x:0, y:12, z:18 with orthographic zoom level 45.", updatedAt: "20 mins ago" },
    { id: "m2", agent: "Hermes Manager", key: "master_board_feeding_rules", value: "Sub-boards (Engineering, Swarm) feed completed issues into Master Executive Board.", updatedAt: "1 hour ago" },
  ]);

  const [notes, setNotes] = useState([
    { id: "n1", title: "Architecture Principles & Conventions", content: "Paperclip backend provides execution and storage muscle, while Claw3D handles 3D isometric office rendering and SPA interactive UI controls." },
  ]);

  const [mockKeys] = useState([
    { provider: "OpenAI API", envVar: "OPENAI_API_KEY", status: "Configured (sk-...8a91)", active: true },
    { provider: "Anthropic API", envVar: "ANTHROPIC_API_KEY", status: "Configured (sk-ant-...02)", active: true },
    { provider: "Google Gemini AI", envVar: "GEMINI_API_KEY", status: "Configured (AIzaSy...7f)", active: true },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showMemModal) setShowMemModal(false);
        else if (showNoteModal) setShowNoteModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showMemModal, showNoteModal]);

  // Fetch Graph Data
  useEffect(() => {
    if (activeTab === "graph" && graphData.nodes.length === 0 && !loadingGraph) {
      setLoadingGraph(true);
      const fetchGraph = async () => {
        try {
          const { data: nodesData } = await supabase.from('nodes').select('*');
          const { data: edgesData } = await supabase.from('edges').select('*');
          
          if (nodesData && edgesData) {
            setGraphData({
              nodes: nodesData.map((n: any) => ({
                id: n.id,
                name: n.name,
                type: n.type,
                val: 1.5,
                color: n.type === 'human' ? '#a855f7' : n.type === 'agent' ? '#ec4899' : n.type === 'project' ? '#3b82f6' : '#f59e0b'
              })),
              links: edgesData.map((e: any) => ({
                source: e.source_id,
                target: e.target_id,
                name: e.relationship_type
              }))
            });
          }
        } catch (error) {
          console.error("Error fetching graph data:", error);
        } finally {
          setLoadingGraph(false);
        }
      };
      fetchGraph();
    }
  }, [activeTab]);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memKey.trim() || !memValue.trim()) return;

    if (editingMemoryId) {
      setMemories(memories.map(m => m.id === editingMemoryId ? {
        ...m,
        agent: memAgent || m.agent,
        key: memKey.trim(),
        value: memValue.trim(),
        updatedAt: "Just now",
      } : m));
      setEditingMemoryId(null);
    } else {
      setMemories([
        {
          id: `mem_${Date.now()}`,
          agent: memAgent || (workforce.length > 0 ? workforce[0].name : "OpenClaw Coder"),
          key: memKey.trim(),
          value: memValue.trim(),
          updatedAt: "Just now",
        },
        ...memories,
      ]);
    }

    setMemKey("");
    setMemValue("");
    setShowMemModal(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    if (editingNoteId) {
      setNotes(notes.map(n => n.id === editingNoteId ? {
        ...n,
        title: noteTitle.trim(),
        content: noteContent.trim() || "No content provided.",
      } : n));
      setEditingNoteId(null);
    } else {
      setNotes([
        {
          id: `note_${Date.now()}`,
          title: noteTitle.trim(),
          content: noteContent.trim() || "No content provided.",
        },
        ...notes,
      ]);
    }

    setNoteTitle("");
    setNoteContent("");
    setShowNoteModal(false);
  };

  const getTabAction = () => {
    switch (activeTab) {
      case "memories":
        return { label: "Add Memory", action: () => { setEditingMemoryId(null); setMemKey(""); setMemValue(""); setShowMemModal(true); } };
      case "notes":
        return { label: "Add Note", action: () => { setEditingNoteId(null); setNoteTitle(""); setNoteContent(""); setShowNoteModal(true); } };
      default:
        return null;
    }
  };

  const tabAction = getTabAction();

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Memory & Provider Credentials"
      subtitle="Agent memory stores, shared notes, and LLM API provider key management"
      icon={Brain}
      iconColorClass="text-pink-400"
      iconBgClass="bg-pink-500/10 border-pink-500/30"
      closeOnEsc={!showMemModal && !showNoteModal}
      showHeader={false}
    >
      {/* Control bar */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          <button onClick={() => setActiveTab("memories")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "memories" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Agent Memories ({memories.length})</button>
          <button onClick={() => setActiveTab("notes")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "notes" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Notes & Context ({notes.length})</button>
          <button onClick={() => setActiveTab("providers")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "providers" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Providers & Keys</button>
          <button onClick={() => setActiveTab("graph")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "graph" ? "bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Entity Graph</button>
        </div>

        {/* Action Button */}
        {tabAction && (
          <div className="relative group shrink-0">
            <button
              onClick={tabAction.action}
              className="p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              {tabAction.label}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className={`flex-1 overflow-y-auto ${activeTab === 'graph' ? 'overflow-hidden' : 'p-6'}`}>
        {activeTab === "memories" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {memories.map((mem) => (
              <div key={mem.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-pink-500/40 transition flex flex-col">
                <div className="flex justify-between items-center text-xs font-mono text-slate-450" onClick={(e) => e.stopPropagation()}>
                  <span className="font-bold text-pink-300">[{mem.agent}] {mem.key}</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-500 mr-2">{mem.updatedAt}</span>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditingMemoryId(mem.id);
                          setMemAgent(mem.agent);
                          setMemKey(mem.key);
                          setMemValue(mem.value);
                          setShowMemModal(true);
                        }}
                        className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Edit
                      </span>
                    </div>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setMemories(memories.filter(item => item.id !== mem.id));
                        }}
                        className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-250 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 font-sans text-xs leading-relaxed">{mem.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {notes.map((n) => (
              <div key={n.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-pink-500/40 transition flex flex-col">
                <div className="flex justify-between items-start" onClick={(e) => e.stopPropagation()}>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-pink-400" /> {n.title}
                  </h4>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditingNoteId(n.id);
                          setNoteTitle(n.title);
                          setNoteContent(n.content);
                          setShowNoteModal(true);
                        }}
                        className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Edit
                      </span>
                    </div>

                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setNotes(notes.filter(item => item.id !== n.id));
                        }}
                        className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{n.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "providers" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="grid gap-3">
              {mockKeys.map((k, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-pink-500/40 transition">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-pink-400" /> {k.provider}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{k.envVar} • {k.status}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "graph" && (
          <div className="w-full h-full relative">
            {loadingGraph && (
              <div className="absolute inset-0 flex items-center justify-center text-pink-400">
                Loading Graph Nodes...
              </div>
            )}
            {!loadingGraph && (
              <ForceGraph3D
                graphData={graphData}
                nodeLabel="name"
                nodeColor="color"
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                backgroundColor="#06090d"
              />
            )}
          </div>
        )}
      </div>

      {/* 1. Add Memory Modal */}
      {showMemModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-400" /> {editingMemoryId ? "Edit Agent Memory" : "Add Agent Memory Entry"}
              </h3>
              <button onClick={() => setShowMemModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Agent</label>
                <select
                  value={memAgent}
                  onChange={(e) => setMemAgent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-pink-500"
                >
                  <option value="">Select Agent...</option>
                  {workforce.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.type === "agent" ? "🤖" : "👤"} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Memory Key / Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. r3f_camera_angle"
                  value={memKey}
                  onChange={(e) => setMemKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Memory Content / Value</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter memory knowledge..."
                  value={memValue}
                  onChange={(e) => setMemValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowMemModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-950/50">
                  {editingMemoryId ? "Save Changes" : "Add Memory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Note Modal */}
      {showNoteModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" /> {editingNoteId ? "Edit Company Note" : "Create Company Note"}
              </h3>
              <button onClick={() => setShowNoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Growth Goals & Strategy"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write note contents..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowNoteModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-950/50">
                  {editingNoteId ? "Save Changes" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
