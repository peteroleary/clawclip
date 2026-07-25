import React, { useState } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import type { Workforce3DMember } from "../types.js";

interface ChatMessage {
  id: string;
  sender: "user" | "member";
  text: string;
  timestamp: string;
}

interface RemoteAgentChatPanelProps {
  member: Workforce3DMember | null;
  onClose: () => void;
}

export const RemoteAgentChatPanel: React.FC<RemoteAgentChatPanelProps> = ({
  member,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "member",
      text: member
        ? `Hello! I'm ${member.name} (${member.title || member.role}). How can I assist you in the workspace?`
        : "Select a team member or AI agent to start chatting.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");

  if (!member) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    // Simulated reply from agent / human staff
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "member",
        text: member.type === "agent"
          ? `[Agent ${member.name}]: Executing response for "${currentInput}". Task context updated.`
          : `[Staff ${member.name}]: Got your message regarding "${currentInput}". Reviewing now!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 w-96 bg-[#0f172a]/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#090d16] border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg ${member.type === "human" ? "bg-emerald-950 text-emerald-400" : "bg-blue-950 text-blue-400"}`}>
            {member.type === "human" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {member.name}
            </h3>
            <p className="text-[11px] text-slate-400 capitalize">
              {member.type} • {member.title || member.role}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 h-72 overflow-y-auto bg-[#0f172a]/50 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2 leading-relaxed shadow ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#090d16] border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          placeholder={`Message ${member.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
