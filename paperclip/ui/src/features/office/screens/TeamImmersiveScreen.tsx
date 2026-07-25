import React, { useState, useEffect } from "react";
import { X, Users, User, Bot, Network, Layers, ShieldCheck, Plus, Move, DollarSign, Mail, Phone, Clock, Shield, Kanban, MessageSquare, Link2 } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { useOfficeStore } from "../../../store/officeStore.js";

interface TeamImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const TeamImmersiveScreen: React.FC<TeamImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const openEntityBoard = useOfficeStore((state) => state.openEntityBoard);
  const openEntityChat = useOfficeStore((state) => state.openEntityChat);
  const openLinkModal = useOfficeStore((state) => state.openLinkModal);

  const [activeTab, setActiveTab] = useState<"org" | "departments" | "teams" | "swarms" | "troops" | "humans" | "agents">("org");

  // Modal Visibility States
  const [showHumanModal, setShowHumanModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSwarmModal, setShowSwarmModal] = useState(false);
  const [showTroopModal, setShowTroopModal] = useState(false);
  const [showOrgLinkModal, setShowOrgLinkModal] = useState(false);

  // Human Form State
  const [hFirstName, setHFirstName] = useState("");
  const [hLastName, setHLastName] = useState("");
  const [hRole, setHRole] = useState("");
  const [hResp, setHResp] = useState("");
  const [hEmail, setHEmail] = useState("");
  const [hPhone, setHPhone] = useState("");
  const [hSchedDay, setHSchedDay] = useState("Mon - Fri");
  const [hSchedStart, setHSchedStart] = useState("09:00");
  const [hSchedEnd, setHSchedEnd] = useState("17:00");
  const [hReportsTo, setHReportsTo] = useState("");
  const [hPayType, setHPayType] = useState("Salaried");
  const [hSalary, setHSalary] = useState("120000");

  // Agent Form State
  const [aName, setAName] = useState("");
  const [aRole, setARole] = useState("");
  const [aModel, setAModel] = useState("Claude 3.5 Sonnet");
  const [aPrompt, setAPrompt] = useState("");
  const [aCost, setACost] = useState("500");

  // Dept Form State
  const [deptName, setDeptName] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [deptBudget, setDeptBudget] = useState("500000");

  // Team Form State
  const [teamName, setTeamName] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [teamBudget, setTeamBudget] = useState("500000");

  // Swarm Form State
  const [swarmName, setSwarmName] = useState("");
  const [swarmLead, setSwarmLead] = useState("");
  const [swarmBudget, setSwarmBudget] = useState("100000");

  // Troop Form State
  const [troopName, setTroopName] = useState("");
  const [troopLead, setTroopLead] = useState("");
  const [troopBudget, setTroopBudget] = useState("750000");

  // Org Link Form State
  const [orgManager, setOrgManager] = useState("");
  const [orgSubordinate, setOrgSubordinate] = useState("");

  // Collections State
  const [workforceList, setWorkforceList] = useState<Workforce3DMember[]>(() =>
    workforce.length > 0
      ? workforce
      : [
          {
            id: "h1",
            name: "Alex Mercer",
            role: "CEO & Founder",
            type: "human",
            title: "Chief Executive Officer",
            department: "Executive",
            status: "active",
            skills: ["Leadership", "Product Vision"],
            annualSalary: 250000,
            deskPosition: { x: 0, y: 0 },
            avatarConfig: {},
          },
          {
            id: "h2",
            name: "Sarah Chen",
            role: "Head of Product",
            type: "human",
            title: "VP of Engineering",
            department: "Engineering",
            status: "active",
            skills: ["Architecture", "React", "TypeScript"],
            annualSalary: 185000,
            deskPosition: { x: 2, y: 0 },
            avatarConfig: {},
          },
          {
            id: "a1",
            name: "OpenClaw Coder",
            role: "Lead Systems Architect",
            type: "agent",
            title: "Gemini 2.5 Flash",
            department: "Swarm Ops",
            status: "working",
            skills: ["Refactoring", "Code Review"],
            monthlyCost: 350,
            deskPosition: { x: -2, y: 0 },
            avatarConfig: {},
          },
          {
            id: "a2",
            name: "Hermes Manager",
            role: "Swarm Orchestrator",
            type: "agent",
            title: "Claude 3.5 Sonnet",
            department: "Swarm Ops",
            status: "working",
            skills: ["Orchestration", "Task Allocation"],
            monthlyCost: 600,
            deskPosition: { x: -4, y: 0 },
            avatarConfig: {},
          },
        ]
  );

  const [departments, setDepartments] = useState([
    { name: "Executive & HQ", lead: "Alex Mercer", count: "3 Members", color: "border-purple-500/30 bg-purple-950/20", budget: 1500000, spent: 450000 },
    { name: "Engineering & Architecture", lead: "Sarah Chen", count: "8 Members", color: "border-cyan-500/30 bg-cyan-950/20", budget: 3500000, spent: 1200000 },
    { name: "Autonomous Swarms & Ops", lead: "Hermes Manager", count: "12 Agents", color: "border-emerald-500/30 bg-emerald-950/20", budget: 800000, spent: 750000 },
  ]);

  const [teams, setTeams] = useState([
    { name: "Core Product Squad", desc: "Builds web UI and 3D office platform features.", members: "4 Staff", budget: 1200000, spent: 500000 },
  ]);

  const [swarms, setSwarms] = useState([
    { name: "AI Swarm Alpha", desc: "Autonomous background agents handling code reviews and deployments.", members: "6 Agents", budget: 20000, spent: 18000 },
  ]);

  const [troops, setTroops] = useState([
    { name: "Full-Stack Deployment Troop", desc: "Combined human engineers and agent automation swarms.", members: "4 Staff + 5 Agents", budget: 500000, spent: 210000 },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showHumanModal) setShowHumanModal(false);
        else if (showAgentModal) setShowAgentModal(false);
        else if (showDeptModal) setShowDeptModal(false);
        else if (showTeamModal) setShowTeamModal(false);
        else if (showSwarmModal) setShowSwarmModal(false);
        else if (showTroopModal) setShowTroopModal(false);
        else if (showOrgLinkModal) setShowOrgLinkModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    showHumanModal,
    showAgentModal,
    showDeptModal,
    showTeamModal,
    showSwarmModal,
    showTroopModal,
    showOrgLinkModal,
    onClose,
  ]);

  if (!isOpen) return null;

  const humans = workforceList.filter((m) => m.type === "human");
  const agents = workforceList.filter((m) => m.type === "agent");

  // Handlers
  const handleAddHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hFirstName.trim() || !hLastName.trim()) return;

    const newH: Workforce3DMember = {
      id: `h_${Date.now()}`,
      name: `${hFirstName.trim()} ${hLastName.trim()}`,
      role: hRole || "Software Engineer",
      title: hRole || "Software Engineer",
      type: "human",
      department: "Engineering",
      status: "active",
      reportsTo: hReportsTo || undefined,
      annualSalary: parseInt(hSalary, 10) || 0,
      skills: ["Generalist"],
      deskPosition: { x: 1, y: 1 },
      avatarConfig: {},
    };

    setWorkforceList([...workforceList, newH]);
    setHFirstName("");
    setHLastName("");
    setShowHumanModal(false);
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName.trim()) return;

    const newA: Workforce3DMember = {
      id: `a_${Date.now()}`,
      name: aName.trim(),
      role: aRole || "Autonomous Agent",
      title: aModel,
      type: "agent",
      department: "Swarm Ops",
      status: "working",
      monthlyCost: parseInt(aCost, 10) || 0,
      skills: ["AI Automation"],
      deskPosition: { x: -1, y: 1 },
      avatarConfig: {},
    };

    setWorkforceList([...workforceList, newA]);
    setAName("");
    setShowAgentModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Team & Personnel Headquarters</h2>
              <p className="text-xs text-slate-400">Manage company organization, departments, swarms, troops, human staff, and AI agents</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("org")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "org" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Org Chart
              </button>
              <button
                onClick={() => setActiveTab("departments")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "departments" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Departments
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "teams" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Teams (Humans)
              </button>
              <button
                onClick={() => setActiveTab("swarms")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "swarms" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Swarms (Agents)
              </button>
              <button
                onClick={() => setActiveTab("troops")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "troops" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Troops (Mixed)
              </button>
              <button
                onClick={() => setActiveTab("humans")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "humans" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Humans ({humans.length})
              </button>
              <button
                onClick={() => setActiveTab("agents")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "agents" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Agents ({agents.length})
              </button>
            </div>

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
          {activeTab === "org" && (
            <div className="space-y-6 max-w-5xl mx-auto text-center">
              <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-400" /> Interactive Drag & Drop Hierarchy
                  </h3>
                  <p className="text-xs text-slate-400">Rearrange reporting trees between executives, leads, and agent swarms</p>
                </div>
                <button
                  onClick={() => setShowOrgLinkModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
                >
                  <Plus className="w-4 h-4" /> Link Manager & Subordinate
                </button>
              </div>

              {/* Tree Mockup */}
              <div className="space-y-8 py-6">
                <div className="inline-block bg-slate-950 border border-purple-500/50 p-4 rounded-2xl shadow-xl w-64">
                  <div className="flex items-center gap-2 mb-1 justify-center">
                    <span className="text-lg">👤</span>
                    <h4 className="font-bold text-white text-sm">Alex Mercer</h4>
                  </div>
                  <span className="text-xs text-purple-300 font-semibold block">Chief Executive Officer</span>
                </div>

                <div className="w-0.5 h-8 bg-purple-500/40 mx-auto" />

                <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-lg">👤</span>
                      <h4 className="font-bold text-slate-100 text-sm">Sarah Chen</h4>
                    </div>
                    <span className="text-xs text-cyan-400 font-semibold block">VP of Product & Eng</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="text-lg">🤖</span>
                      <h4 className="font-bold text-slate-100 text-sm">Hermes Manager</h4>
                    </div>
                    <span className="text-xs text-purple-400 font-semibold block">Swarm Orchestrator</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Company Departments</h3>
                <button
                  onClick={() => setShowDeptModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Department
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {departments.map((dept, idx) => {
                  const deptId = idx === 0 ? "exec" : idx === 1 ? "engineering" : "ai_swarm";
                  return (
                    <div key={idx} className={`border p-5 rounded-2xl space-y-3 ${dept.color}`}>
                      <h4 className="font-bold text-slate-100 text-base flex justify-between items-start">
                        {dept.name}
                        <span className="text-[10px] font-mono font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          Budget: ${dept.budget.toLocaleString()}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">Department Head: <strong className="text-slate-200">{dept.lead}</strong></p>
                      
                      {/* Financial Utilization */}
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Spent: <span className="text-white">${dept.spent.toLocaleString()}</span></span>
                          <span>{((dept.spent / dept.budget) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${(dept.spent / dept.budget) >= 0.85 ? ((dept.spent / dept.budget) >= 1 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((dept.spent / dept.budget) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 mt-3">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-semibold rounded-xl text-slate-300">
                          {dept.count}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => openEntityBoard(deptId)}
                            className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-lg text-[10px] font-semibold transition flex items-center gap-1"
                            title="Open Department Board"
                          >
                            <Kanban className="w-3 h-3" /> Board
                          </button>
                          <button
                            onClick={() => openEntityChat(idx === 1 ? "dept-engineering" : "general")}
                            className="p-1.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 rounded-lg text-[10px] font-semibold transition flex items-center gap-1"
                            title="Open Department Group Chat"
                          >
                            <MessageSquare className="w-3 h-3" /> Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Human Teams</h3>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Team
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {teams.map((t, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div>
                      <h4 className="font-bold text-purple-300 text-base flex justify-between items-start">
                        {t.name}
                        <span className="text-[9px] font-mono font-normal text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full">
                          Bgt: ${(t.budget/1000).toFixed(0)}k
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{t.desc}</p>
                    </div>

                    {/* Financial Utilization */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${(t.spent / t.budget) >= 0.85 ? ((t.spent / t.budget) >= 1 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((t.spent / t.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-purple-400 rounded-lg border border-purple-500/20">
                        {t.members}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEntityBoard("team_squad")}
                          className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Kanban className="w-3 h-3" /> Board
                        </button>
                        <button
                          onClick={() => openEntityChat("team-core-squad")}
                          className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "swarms" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Agent Swarms</h3>
                <button
                  onClick={() => setShowSwarmModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Swarm
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {swarms.map((s, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div>
                      <h4 className="font-bold text-cyan-300 text-base flex justify-between items-start">
                        {s.name}
                        <span className="text-[9px] font-mono font-normal text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full">
                          Bgt: ${(s.budget/1000).toFixed(0)}k
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{s.desc}</p>
                    </div>

                    {/* Financial Utilization */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${(s.spent / s.budget) >= 0.85 ? ((s.spent / s.budget) >= 1 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((s.spent / s.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-cyan-400 rounded-lg border border-cyan-500/20">
                        {s.members}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEntityBoard("ai_swarm")}
                          className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Kanban className="w-3 h-3" /> Board
                        </button>
                        <button
                          onClick={() => openEntityChat("dept-swarms")}
                          className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "troops" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Mixed Troops (Humans & Agents)</h3>
                <button
                  onClick={() => setShowTroopModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Troop
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {troops.map((tr, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div>
                      <h4 className="font-bold text-amber-300 text-base flex justify-between items-start">
                        {tr.name}
                        <span className="text-[9px] font-mono font-normal text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full">
                          Bgt: ${(tr.budget/1000).toFixed(0)}k
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{tr.desc}</p>
                    </div>

                    {/* Financial Utilization */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${(tr.spent / tr.budget) >= 0.85 ? ((tr.spent / tr.budget) >= 1 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((tr.spent / tr.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-amber-400 rounded-lg border border-amber-500/20">
                        {tr.members}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEntityBoard("master")}
                          className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <Kanban className="w-3 h-3" /> Board
                        </button>
                        <button
                          onClick={() => openEntityChat("general")}
                          className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "humans" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Human Employees</h3>
                <button
                  onClick={() => setShowHumanModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Human Staff
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {humans.map((h) => (
                  <div key={h.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{h.name}</h4>
                        <p className="text-xs text-purple-300 font-semibold">{h.title || h.role}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Human</span>
                          {h.annualSalary !== undefined && (
                            <span className="text-[10px] text-emerald-500/80 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                              ${(h.annualSalary/1000).toFixed(0)}k / yr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => openLinkModal(h.id, "human", h.name)}
                      className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" /> Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Autonomous AI Agents</h3>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Agent
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {agents.map((a) => (
                  <div key={a.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                        🤖
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{a.name}</h4>
                        <p className="text-xs text-cyan-300 font-semibold">{a.role}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">AI Agent</span>
                          {a.monthlyCost !== undefined && (
                            <span className="text-[10px] text-emerald-500/80 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                              ${a.monthlyCost} / mo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openLinkModal(a.id, "agent", a.name)}
                      className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" /> Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1. Add Human Modal */}
        {showHumanModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" /> Add Human Staff Member
                </h3>
                <button onClick={() => setShowHumanModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddHuman} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={hFirstName}
                      onChange={(e) => setHFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mercer"
                      value={hLastName}
                      onChange={(e) => setHLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Role / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={hRole}
                    onChange={(e) => setHRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Responsibilities</label>
                  <textarea
                    rows={2}
                    placeholder="Key areas of responsibility..."
                    value={hResp}
                    onChange={(e) => setHResp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={hEmail}
                      onChange={(e) => setHEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2831"
                      value={hPhone}
                      onChange={(e) => setHPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Work Schedule Inputs */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 text-xs block">Work Schedule</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">Days</label>
                      <input
                        type="text"
                        value={hSchedDay}
                        onChange={(e) => setHSchedDay(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">Start Time</label>
                      <input
                        type="time"
                        value={hSchedStart}
                        onChange={(e) => setHSchedStart(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[10px] mb-1">End Time</label>
                      <input
                        type="time"
                        value={hSchedEnd}
                        onChange={(e) => setHSchedEnd(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Reports To (Manager)</label>
                  <select
                    value={hReportsTo}
                    onChange={(e) => setHReportsTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Manager...</option>
                    {workforceList.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.type === "human" ? "👤" : "🤖"} {m.name} ({m.title || m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Pay Type</label>
                    <select
                      value={hPayType}
                      onChange={(e) => setHPayType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Salaried">Salaried ($/yr)</option>
                      <option value="Hourly">Hourly ($/hr)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Annual Salary ($)</label>
                    <input
                      type="number"
                      value={hSalary}
                      onChange={(e) => setHSalary(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowHumanModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-950/50">
                    Add Human Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Add Agent Modal */}
        {showAgentModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" /> Create Autonomous Agent
                </h3>
                <button onClick={() => setShowAgentModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAgent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Agent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenClaw Coder"
                    value={aName}
                    onChange={(e) => setAName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Agent Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Systems Architect"
                    value={aRole}
                    onChange={(e) => setARole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">LLM Model</label>
                  <select
                    value={aModel}
                    onChange={(e) => setAModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="DeepSeek R1">DeepSeek R1</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">System Prompt Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="Provide system instructions for the agent..."
                      value={aPrompt}
                      onChange={(e) => setAPrompt(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Est. API Cost ($/mo)</label>
                    <input
                      type="number"
                      value={aCost}
                      onChange={(e) => setACost(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAgentModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/50">
                    Create Agent
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
