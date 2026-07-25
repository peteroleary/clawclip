import React, { useState, useEffect } from "react";
import { X, MessageSquare, Send, User, Bot, Hash, Kanban, Sparkles } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { useOfficeStore } from "../../../store/officeStore.js";

interface CommsImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const CommsImmersiveScreen: React.FC<CommsImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const focusedChannelId = useOfficeStore((state) => state.focusedChannelId);
  const openEntityBoard = useOfficeStore((state) => state.openEntityBoard);

  const [activeChannel, setActiveChannel] = useState<string>(focusedChannelId || "general");
  const [chatInput, setChatInput] = useState("");

  const [messages, setMessages] = useState<Record<string, { id: string; author: string; text: string; time: string; type: "human" | "agent" | "system" }[]>>({
    general: [
      { id: "m1", author: "Alex Mercer", text: "Welcome to the 3D Office Platform! Type /task <title> in any channel to instantly create a card on its board.", time: "10:00 AM", type: "human" },
      { id: "m2", author: "Hermes Manager", text: "Swarm status normal. 4 autonomous agents standing by for tasks.", time: "10:02 AM", type: "agent" },
    ],
    "dept-engineering": [
      { id: "m3", author: "OpenClaw Coder", text: "Multi-board Kanban drag-and-drop and Master board feeding fully integrated.", time: "10:15 AM", type: "agent" },
    ],
    "proj-clawclip": [
      { id: "m4", author: "Sarah Chen", text: "ClawClip 3D rendering engine and Paperclip API integration synced.", time: "10:30 AM", type: "human" },
    ],
  });

  useEffect(() => {
    if (focusedChannelId) {
      setActiveChannel(focusedChannelId);
    }
  }, [focusedChannelId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getLinkedBoardId = (channel: string) => {
    if (channel === "proj-clawclip") return "proj_clawclip";
    if (channel === "proj-atm-treasury") return "proj_atm";
    if (channel === "dept-engineering") return "engineering";
    if (channel === "dept-swarms") return "ai_swarm";
    if (channel === "team-core-squad") return "team_squad";
    return "master";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const text = chatInput.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: `msg_${Date.now()}`,
      author: "Alex Mercer",
      text,
      time: nowTime,
      type: "human" as const,
    };

    let updatedChannelMsgs = [...(messages[activeChannel] || []), newMsg];

    // Intercept /task command for cross-system action trigger!
    if (text.startsWith("/task ")) {
      const taskTitle = text.replace("/task ", "").trim();
      const linkedBoard = getLinkedBoardId(activeChannel);

      const botReply = {
        id: `bot_${Date.now()}`,
        author: "Paperclip Bot",
        text: `📊 Created new task "${taskTitle}" on board [${linkedBoard}]. Actions across chat and boards are linked!`,
        time: nowTime,
        type: "system" as const,
      };

      updatedChannelMsgs.push(botReply);
    }

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: updatedChannelMsgs,
    }));
    setChatInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Comms & Live Chat HQ</h2>
              <p className="text-xs text-slate-400">Interlinked entity group chats for Companies, Departments, Projects, and Teams</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Channel & DM Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-[#06090d]/60 p-4 space-y-4 shrink-0 overflow-y-auto">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Channels</h4>
              <button
                onClick={() => setActiveChannel("general")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                  activeChannel === "general" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>#company-executive</span>
              </button>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department Channels</h4>
              <div className="space-y-1">
                {[
                  { id: "dept-engineering", label: "#dept-engineering" },
                  { id: "dept-swarms", label: "#dept-swarms-ops" },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                      activeChannel === ch.id ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project Channels</h4>
              <div className="space-y-1">
                {[
                  { id: "proj-clawclip", label: "#proj-clawclip-3d" },
                  { id: "proj-atm-treasury", label: "#proj-atm-treasury" },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                      activeChannel === ch.id ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-blue-400" />
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Team & Swarm Channels</h4>
              <button
                onClick={() => setActiveChannel("team-core-squad")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                  activeChannel === "team-core-squad" ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>#team-core-squad</span>
              </button>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Direct Messages (DMs)</h4>
              <div className="space-y-1">
                {[
                  { id: "dm_sarah", label: "Sarah Chen", type: "human" },
                  { id: "dm_coder", label: "OpenClaw Coder", type: "agent" },
                  { id: "dm_hermes", label: "Hermes Manager", type: "agent" },
                ].map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => setActiveChannel(dm.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                      activeChannel === dm.id ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {dm.type === "human" ? <User className="w-3.5 h-3.5 text-purple-400" /> : <Bot className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{dm.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Chat Thread */}
          <div className="flex-1 flex flex-col bg-slate-950/40">
            <div className="p-4 border-b border-slate-800/80 bg-[#06090d]/40 flex items-center justify-between">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" /> #{activeChannel}
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openEntityBoard(getLinkedBoardId(activeChannel))}
                  className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  title="Jump to linked entity Kanban Board"
                >
                  <Kanban className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Linked Board</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono">Synced Engine</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {(messages[activeChannel] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl space-y-1 max-w-2xl border ${
                    msg.type === "system"
                      ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-200"
                      : "bg-slate-950 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      {msg.type === "human" ? (
                        <User className="w-3.5 h-3.5 text-purple-400" />
                      ) : msg.type === "system" ? (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      {msg.author}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar with Command Help */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#06090d]/60 space-y-2">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder={`Message #${activeChannel}... (Tip: type /task <title> to create a board card)`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-950/50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
