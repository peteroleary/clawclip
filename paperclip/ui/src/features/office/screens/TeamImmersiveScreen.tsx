import React, { useState, useEffect } from "react";
import { X, Users, User, Bot, Network, Layers, ShieldCheck, Plus, Move, DollarSign, Mail, Phone, Clock, Shield, Kanban, MessageSquare, Link2, Edit2, Target, Folder, CheckSquare, Zap, FileText } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { useOfficeStore } from "../../../store/officeStore.js";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

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

  const [activeTab, setActiveTab] = useState<"org" | "departments" | "humans" | "agents" | "teams" | "swarms" | "troops">("org");
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);

  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "budget" | "cost" | "headcount">("name");

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
  const [hStatus, setHStatus] = useState("Active");

  // Agent Form State
  const [aName, setAName] = useState("");
  const [aRole, setARole] = useState("");
  const [aModel, setAModel] = useState("Claude 3.5 Sonnet");
  const [aPrompt, setAPrompt] = useState("");
  const [aCost, setACost] = useState("500");
  const [aStatus, setAStatus] = useState("Active");

  // Dept Form State
  const [deptName, setDeptName] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [deptBudget, setDeptBudget] = useState("500000");
  const [deptStatus, setDeptStatus] = useState("Active");

  // Team Form State
  const [teamName, setTeamName] = useState("");
  const [teamLead, setTeamLead] = useState("");
  const [teamBudget, setTeamBudget] = useState("500000");
  const [teamStatus, setTeamStatus] = useState("Active");

  // Swarm Form State
  const [swarmName, setSwarmName] = useState("");
  const [swarmLead, setSwarmLead] = useState("");
  const [swarmBudget, setSwarmBudget] = useState("100000");
  const [swarmStatus, setSwarmStatus] = useState("Active");

  // Troop Form State
  const [troopName, setTroopName] = useState("");
  const [troopLead, setTroopLead] = useState("");
  const [troopBudget, setTroopBudget] = useState("750000");
  const [troopStatus, setTroopStatus] = useState("Active");

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
            tasks: ["Approve Q3 Budget", "Review Platform Architecture"],
            routines: ["Weekly All Hands", "Daily Exec Standup"],
            artifacts: ["Q3_Strategy.pdf", "Company_Vision.md"],
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
            tasks: ["Review PR #45", "Draft Technical Spec for Sync"],
            routines: ["Daily Standup @ 10am EST"],
            artifacts: ["Engineering_Roadmap.md", "System_Architecture.pdf"],
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
            tasks: ["Refactor User Auth", "Optimize Database Queries"],
            routines: ["Continuous Integration Checks", "Nightly Code Quality Scan"],
            artifacts: ["Auth_Module.ts", "DB_Optimization_Report.md"],
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
            tasks: ["Allocate Bug Fixes to Swarms", "Monitor Swarm Health"],
            routines: ["Hourly Health Checks"],
            artifacts: ["Swarm_Metrics_Dashboard.json"],
            monthlyCost: 600,
            deskPosition: { x: -4, y: 0 },
            avatarConfig: {},
          },
        ]
  );

  const [departments, setDepartments] = useState([
    { id: "dept_1", name: "Executive & HQ", lead: "Alex Mercer", count: "3 Members", color: "border-purple-500/30 bg-purple-950/20", budget: 1500000, spent: 450000, status: "Active", targets: ["Increase Q3 Revenue by 15%", "Secure Series B Funding"], projects: ["Global Expansion", "Platform Re-architecture"], routines: ["Monthly Board Meeting"], artifacts: ["Q3_Financials.pdf"] },
    { id: "dept_2", name: "Engineering & Architecture", lead: "Sarah Chen", count: "8 Members", color: "border-cyan-500/30 bg-cyan-950/20", budget: 3500000, spent: 1200000, status: "Active", targets: ["Ship v1.0 Alpha", "Reduce Latency by 20%"], projects: ["Paperclip UI Rewrite", "Office 3D Environment"], routines: ["Weekly Sprint Planning", "Bi-weekly Retrospective"], artifacts: ["API_Docs.md"] },
    { id: "dept_3", name: "Autonomous Swarms & Ops", lead: "Hermes Manager", count: "12 Agents", color: "border-emerald-500/30 bg-emerald-950/20", budget: 800000, spent: 750000, status: "Active", targets: ["Automate 80% of QA", "0 Sev-1 Incidents"], projects: ["AI Office Automation", "Self-Healing Infrastructure"], routines: ["Continuous Deployment"], artifacts: ["Ops_Runbook.md"] },
  ]);

  const [teams, setTeams] = useState([
    { id: "team_1", name: "Core Product Squad", desc: "Builds web UI and 3D office platform features.", lead: "Alex Mercer", members: "4 Staff", budget: 1200000, spent: 500000, status: "Active", targets: ["Launch New Dashboard", "Improve User Onboarding"], projects: ["Dashboard V2"], routines: ["Daily Sync"], artifacts: ["Figma_Mockups.url"] },
  ]);

  const [swarms, setSwarms] = useState([
    { id: "swarm_1", name: "AI Swarm Alpha", desc: "Autonomous background agents handling code reviews and deployments.", lead: "Hermes Manager", members: "6 Agents", budget: 20000, spent: 18000, status: "Active", targets: ["Process 100 PRs/day", "Zero Deployment Rollbacks"], projects: ["CI/CD Pipeline Automation"], routines: ["Real-time PR Monitoring"], skills: ["Python", "Docker", "Kubernetes"], artifacts: ["Deployment_Logs.txt"] },
  ]);

  const [troops, setTroops] = useState([
    { id: "troop_1", name: "Full-Stack Deployment Troop", desc: "Combined human engineers and agent automation swarms.", lead: "Sarah Chen", members: "4 Staff + 5 Agents", budget: 500000, spent: 210000, status: "Active", targets: ["Migrate to Cloud-Native", "Establish DevOps Culture"], projects: ["Infrastructure as Code", "Monitoring Revamp"], routines: ["Weekly DevOps Sync"], artifacts: ["Terraform_State.json"] },
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
        else if (selectedEntity) setSelectedEntity(null);
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
    selectedEntity,
  ]);

  if (!isOpen) return null;

  const getFilteredAndSorted = (items: any[]) => {
    let result = items;
    if (filterStatus !== "All") {
      result = result.filter((i) => (i.status || "Active").toLowerCase() === filterStatus.toLowerCase());
    }
    
    result = [...result].sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "budget") {
        const aVal = a.budget ?? a.annualSalary ?? a.monthlyCost ?? 0;
        const bVal = b.budget ?? b.annualSalary ?? b.monthlyCost ?? 0;
        return bVal - aVal;
      }
      if (sortBy === "headcount") {
        const getCount = (str: string) => parseInt(str) || 0;
        const aCount = a.count ? getCount(a.count) : (a.members ? getCount(a.members) : 1);
        const bCount = b.count ? getCount(b.count) : (b.members ? getCount(b.members) : 1);
        return bCount - aCount;
      }
      return 0;
    });
    return result;
  };

  const humans = getFilteredAndSorted(workforceList.filter((m) => m.type === "human"));
  const agents = getFilteredAndSorted(workforceList.filter((m) => m.type === "agent"));

  // Handlers
  const handleAddHuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hFirstName.trim() || !hLastName.trim()) return;
    const newH: Workforce3DMember = {
      id: editingEntityId || `h_${Date.now()}`,
      name: `${hFirstName} ${hLastName}`,
      role: hRole,
      type: "human",
      title: hRole,
      department: "Unassigned",
      status: hStatus,
      skills: [],
      annualSalary: parseInt(hSalary, 10) || 0,
      deskPosition: { x: 0, y: 0 },
      avatarConfig: {},
    };
    if (editingEntityId) {
      setWorkforceList(workforceList.map(w => w.id === editingEntityId ? newH : w));
    } else {
      setWorkforceList([...workforceList, newH]);
    }
    setHFirstName("");
    setHLastName("");
    setHRole("");
    setHStatus("Active");
    setEditingEntityId(null);
    setShowHumanModal(false);
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName.trim()) return;
    const newA: Workforce3DMember = {
      id: editingEntityId || `a_${Date.now()}`,
      name: aName,
      role: aRole,
      type: "agent",
      title: aModel,
      department: "Unassigned",
      status: aStatus,
      skills: [],
      monthlyCost: parseInt(aCost, 10) || 0,
      deskPosition: { x: 0, y: 0 },
      avatarConfig: {},
    };
    if (editingEntityId) {
      setWorkforceList(workforceList.map(w => w.id === editingEntityId ? newA : w));
    } else {
      setWorkforceList([...workforceList, newA]);
    }
    setAName("");
    setARole("");
    setAStatus("Active");
    setEditingEntityId(null);
    setShowAgentModal(false);
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;
    if (editingEntityId) {
      setDepartments(departments.map(d => d.id === editingEntityId ? { ...d, name: deptName, lead: deptHead, budget: parseInt(deptBudget, 10) || 0, status: deptStatus } : d));
    } else {
      setDepartments([...departments, { id: `dept_${Date.now()}`, name: deptName, lead: deptHead || "Unassigned", count: "0 Members", color: "border-slate-500/30 bg-slate-950/20", budget: parseInt(deptBudget, 10) || 0, spent: 0, status: deptStatus, targets: [], projects: [], routines: [], artifacts: [] }]);
    }
    setDeptName("");
    setDeptHead("");
    setDeptStatus("Active");
    setEditingEntityId(null);
    setShowDeptModal(false);
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    if (editingEntityId) {
      setTeams(teams.map(t => t.id === editingEntityId ? { ...t, name: teamName, lead: teamLead, budget: parseInt(teamBudget, 10) || 0, status: teamStatus } : t));
    } else {
      setTeams([...teams, { id: `team_${Date.now()}`, name: teamName, desc: "New Team", lead: teamLead, members: "0 Staff", budget: parseInt(teamBudget, 10) || 0, spent: 0, status: teamStatus, targets: [], projects: [], routines: [], artifacts: [] }]);
    }
    setTeamName("");
    setTeamLead("");
    setTeamStatus("Active");
    setEditingEntityId(null);
    setShowTeamModal(false);
  };

  const handleAddSwarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swarmName.trim()) return;
    if (editingEntityId) {
      setSwarms(swarms.map(s => s.id === editingEntityId ? { ...s, name: swarmName, lead: swarmLead, budget: parseInt(swarmBudget, 10) || 0, status: swarmStatus } : s));
    } else {
      setSwarms([...swarms, { id: `swarm_${Date.now()}`, name: swarmName, desc: "New Swarm", lead: swarmLead, members: "0 Agents", budget: parseInt(swarmBudget, 10) || 0, spent: 0, status: swarmStatus, targets: [], projects: [], routines: [], skills: [], artifacts: [] }]);
    }
    setSwarmName("");
    setSwarmLead("");
    setSwarmStatus("Active");
    setEditingEntityId(null);
    setShowSwarmModal(false);
  };

  const handleAddTroop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!troopName.trim()) return;
    if (editingEntityId) {
      setTroops(troops.map(t => t.id === editingEntityId ? { ...t, name: troopName, lead: troopLead, budget: parseInt(troopBudget, 10) || 0, status: troopStatus } : t));
    } else {
      setTroops([...troops, { id: `troop_${Date.now()}`, name: troopName, desc: "New Troop", lead: troopLead, members: "0 Staff + 0 Agents", budget: parseInt(troopBudget, 10) || 0, spent: 0, status: troopStatus, targets: [], projects: [], routines: [], artifacts: [] }]);
    }
    setTroopName("");
    setTroopLead("");
    setTroopStatus("Active");
    setEditingEntityId(null);
    setShowTroopModal(false);
  };

  const getTabHeader = () => {
    switch(activeTab) {
      case "org":
        return { title: "Interactive Drag & Drop Hierarchy", btnText: "Link Manager & Subordinate", action: () => setShowOrgLinkModal(true), icon: <Network className="w-5 h-5 text-purple-400" />, desc: "Rearrange reporting trees between executives, leads, and agent swarms" };
      case "departments":
        return { title: "Company Departments", btnText: "Department", action: () => { setEditingEntityId(null); setDeptName(""); setDeptHead(""); setDeptStatus("Active"); setShowDeptModal(true); } };
      case "teams":
        return { title: "Human Teams", btnText: "Team", action: () => { setEditingEntityId(null); setTeamName(""); setTeamLead(""); setTeamStatus("Active"); setShowTeamModal(true); } };
      case "swarms":
        return { title: "Agent Swarms", btnText: "Swarm", action: () => { setEditingEntityId(null); setSwarmName(""); setSwarmLead(""); setSwarmStatus("Active"); setShowSwarmModal(true); } };
      case "troops":
        return { title: "Mixed Troops (Humans & Agents)", btnText: "Troop", action: () => { setEditingEntityId(null); setTroopName(""); setTroopLead(""); setTroopStatus("Active"); setShowTroopModal(true); } };
      case "humans":
        return { title: "Human Employees", btnText: "Human Staff", action: () => { setEditingEntityId(null); setHFirstName(""); setHLastName(""); setHRole(""); setHStatus("Active"); setShowHumanModal(true); } };
      case "agents":
        return { title: "Autonomous AI Agents", btnText: "Agent", action: () => { setEditingEntityId(null); setAName(""); setARole(""); setAStatus("Active"); setShowAgentModal(true); } };
      default:
        return null;
    }
  };

  const tabHeader = getTabHeader();
  const hasOpenModal = showHumanModal || showAgentModal || showDeptModal || showTeamModal || showSwarmModal || showTroopModal || showOrgLinkModal || selectedEntity !== null;

  const headerActions = (
    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
      <button
        onClick={() => setActiveTab("org")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "org" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Org
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
        onClick={() => setActiveTab("humans")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "humans" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Humans
      </button>
      <button
        onClick={() => setActiveTab("agents")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "agents" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Agents
      </button>
      <button
        onClick={() => setActiveTab("teams")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "teams" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Teams
      </button>
      <button
        onClick={() => setActiveTab("swarms")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "swarms" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Swarms
      </button>
      <button
        onClick={() => setActiveTab("troops")}
        className={`px-3 py-1.5 rounded-lg transition ${
          activeTab === "troops" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"
        }`}
      >
        Troops
      </button>
    </div>
  );

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Team & Personnel Headquarters"
      subtitle="Manage company organization, departments, swarms, troops, human staff, and AI agents"
      icon={Users}
      iconColorClass="text-purple-400"
      iconBgClass="bg-purple-500/10 border-purple-500/30"
      closeOnEsc={!hasOpenModal}
      showHeader={false}
    >
      {/* Content Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center pb-3 border-b border-slate-800/80">
          {/* Left side: Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
            <button onClick={() => setActiveTab("org")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "org" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Org</button>
            <button onClick={() => setActiveTab("departments")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "departments" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Departments</button>
            <button onClick={() => setActiveTab("humans")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "humans" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Humans</button>
            <button onClick={() => setActiveTab("agents")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "agents" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Agents</button>
            <button onClick={() => setActiveTab("teams")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "teams" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Teams</button>
            <button onClick={() => setActiveTab("swarms")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "swarms" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Swarms</button>
            <button onClick={() => setActiveTab("troops")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "troops" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Troops</button>
          </div>

          {/* Right side: Filters & Actions */}
          <div className="flex items-center gap-3">
            {activeTab !== "org" && (
              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-0.5 text-xs text-slate-205 focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-0.5 text-xs text-slate-205 focus:outline-none focus:border-purple-500"
                  >
                    <option value="name">Name</option>
                    <option value="budget">Budget / Cost</option>
                    <option value="headcount">Headcount</option>
                  </select>
                </div>
              </div>
            )}

            {/* Dynamic Icon-Only Add Button with Tooltip */}
            {tabHeader && tabHeader.action && (
              <div className="relative group">
                <button
                  onClick={tabHeader.action}
                  className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                  Add {tabHeader.btnText}
                </span>
              </div>
            )}
          </div>
        </div>

          {activeTab === "org" && (
            <div className="space-y-6 max-w-5xl mx-auto text-center">
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
              <div className="grid grid-cols-3 gap-4">
                {getFilteredAndSorted(departments).map((d: any, idx: number) => {
                  const deptId = idx === 0 ? "exec" : idx === 1 ? "engineering" : "ai_swarm";
                  return (
                    <div key={d.id} onClick={() => setSelectedEntity({ ...d, _type: 'department' })} className={`border ${d.color} p-4 rounded-2xl flex flex-col cursor-pointer hover:ring-2 hover:ring-white/20 transition-all`}>
                      <h4 className="font-bold text-slate-100 text-base flex justify-between items-start">
                        {d.name}
                        <span className="text-[10px] font-mono font-normal text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                          Budget: ${d.budget.toLocaleString()}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">Department Head: <strong className="text-slate-200">{d.lead}</strong></p>
                      
                      {/* Financial Utilization */}
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Spent: <span className="text-white">${d.spent.toLocaleString()}</span></span>
                          <span>{((d.spent / d.budget) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${(d.spent / d.budget) >= 0.85 ? ((d.spent / d.budget) >= 1 ? 'bg-rose-500' : 'bg-amber-500') : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((d.spent / d.budget) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 mt-3" onClick={(e) => e.stopPropagation()}>
                        <span className="inline-block px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-semibold rounded-xl text-slate-300">
                          {d.count}
                        </span>

                        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <div className="relative group/tooltip">
                            <button
                              onClick={() => {
                                setEditingEntityId(d.id);
                                setDeptName(d.name);
                                setDeptHead(d.lead);
                                setDeptBudget((d.budget || 0).toString());
                                setDeptStatus(d.status || "Active");
                                setShowDeptModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                              Edit
                            </span>
                          </div>

                          <div className="relative group/tooltip">
                            <button
                              onClick={() => openLinkModal(d.id, "department", d.name)}
                              className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                              Link
                            </span>
                          </div>

                          <div className="relative group/tooltip">
                            <button
                              onClick={() => openEntityBoard(deptId)}
                              className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                            >
                              <Kanban className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                              Board
                            </span>
                          </div>

                          <div className="relative group/tooltip">
                            <button
                              onClick={() => openEntityChat(idx === 1 ? "dept-engineering" : "general")}
                              className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                              Chat
                            </span>
                          </div>
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
              <div className="grid grid-cols-2 gap-4">
                {getFilteredAndSorted(teams).map((t: any) => (
                  <div key={t.id} onClick={() => setSelectedEntity({ ...t, _type: 'team' })} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-purple-500/50 transition-colors space-y-3">
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

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-purple-400 rounded-lg border border-purple-500/20">
                        {t.members}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              setEditingEntityId(t.id);
                              setTeamName(t.name);
                              setTeamLead(t.lead || "");
                              setTeamBudget((t.budget || 0).toString());
                              setTeamStatus(t.status || "Active");
                              setShowTeamModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Edit
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openLinkModal(t.id, "team", t.name)}
                            className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Link
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityBoard("team_squad")}
                            className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Board
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityChat("team-core-squad")}
                            className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Chat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "swarms" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                {getFilteredAndSorted(swarms).map((s: any) => (
                  <div key={s.id} onClick={() => setSelectedEntity({ ...s, _type: 'swarm' })} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-cyan-500/50 transition-colors space-y-3">
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

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-cyan-400 rounded-lg border border-cyan-500/20">
                        {s.members}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              setEditingEntityId(s.id);
                              setSwarmName(s.name);
                              setSwarmLead(s.lead || "");
                              setSwarmBudget((s.budget || 0).toString());
                              setSwarmStatus(s.status || "Active");
                              setShowSwarmModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Edit
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openLinkModal(s.id, "swarm", s.name)}
                            className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Link
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityBoard("ai_swarm")}
                            className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Board
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityChat("dept-swarms")}
                            className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Chat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "troops" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                {getFilteredAndSorted(troops).map((tr: any) => (
                  <div key={tr.id} onClick={() => setSelectedEntity({ ...tr, _type: 'troop' })} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-colors space-y-3">
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

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2" onClick={(e) => e.stopPropagation()}>
                      <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-xs font-mono text-amber-400 rounded-lg border border-amber-500/20">
                        {tr.members}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              setEditingEntityId(tr.id);
                              setTroopName(tr.name);
                              setTroopLead(tr.lead || "");
                              setTroopBudget((tr.budget || 0).toString());
                              setTroopStatus(tr.status || "Active");
                              setShowTroopModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Edit
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openLinkModal(tr.id, "troop", tr.name)}
                            className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Link
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityBoard("master")}
                            className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                          >
                            <Kanban className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Board
                          </span>
                        </div>

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => openEntityChat("general")}
                            className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            Chat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "humans" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                {humans.map((h) => (
                  <div key={h.id} onClick={() => setSelectedEntity({ ...h, _type: 'human' })} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors">
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
                    
                    <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="relative group/tooltip">
                        <button
                          onClick={() => {
                            setEditingEntityId(h.id);
                            const names = h.name.split(" ");
                            setHFirstName(names[0]);
                            setHLastName(names.slice(1).join(" "));
                            setHRole(h.role || "");
                            setHSalary((h.annualSalary || 0).toString());
                            setHStatus(h.status || "Active");
                            setShowHumanModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Edit
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openLinkModal(h.id, "human", h.name)}
                          className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Link
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openEntityBoard("master")}
                          className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                        >
                          <Kanban className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Board
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openEntityChat("general")}
                          className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Chat
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                {agents.map((a) => (
                  <div key={a.id} onClick={() => setSelectedEntity({ ...a, _type: 'agent' })} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-colors">
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

                    <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <div className="relative group/tooltip">
                        <button
                          onClick={() => {
                            setEditingEntityId(a.id);
                            setAName(a.name);
                            setARole(a.role || "");
                            setACost((a.monthlyCost || 0).toString());
                            setAStatus(a.status || "Active");
                            setShowAgentModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Edit
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openLinkModal(a.id, "agent", a.name)}
                          className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/60 rounded-lg transition"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Link
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openEntityBoard("ai_swarm")}
                          className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/40 border border-cyan-900/60 rounded-lg transition"
                        >
                          <Kanban className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Board
                        </span>
                      </div>

                      <div className="relative group/tooltip">
                        <button
                          onClick={() => openEntityChat("dept-swarms")}
                          className="p-1.5 text-purple-400 hover:text-white bg-purple-950/40 border border-purple-900/60 rounded-lg transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                          Chat
                        </span>
                      </div>
                    </div>
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


                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={hStatus}
                    onChange={(e) => setHStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
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

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={aStatus}
                    onChange={(e) => setAStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
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
        {/* 3. Add Dept Modal */}
        {showDeptModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" /> Create Department
                </h3>
                <button onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddDept} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Department Name</label>
                  <input type="text" required value={deptName} onChange={(e) => setDeptName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Department Head</label>
                  <input type="text" value={deptHead} onChange={(e) => setDeptHead(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Annual Budget</label>
                  <input type="number" required value={deptBudget} onChange={(e) => setDeptBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={deptStatus}
                    onChange={(e) => setDeptStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowDeptModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg">Create Department</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Add Team Modal */}
        {showTeamModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" /> Create Team
                </h3>
                <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddTeam} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Team Name</label>
                  <input type="text" required value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Team Lead</label>
                  <input type="text" value={teamLead} onChange={(e) => setTeamLead(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Annual Budget</label>
                  <input type="number" required value={teamBudget} onChange={(e) => setTeamBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={teamStatus}
                    onChange={(e) => setTeamStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg">Create Team</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. Add Swarm Modal */}
        {showSwarmModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" /> Create Agent Swarm
                </h3>
                <button onClick={() => setShowSwarmModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddSwarm} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Swarm Name</label>
                  <input type="text" required value={swarmName} onChange={(e) => setSwarmName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Swarm Lead / Orchestrator</label>
                  <input type="text" value={swarmLead} onChange={(e) => setSwarmLead(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Monthly API Budget</label>
                  <input type="number" required value={swarmBudget} onChange={(e) => setSwarmBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={swarmStatus}
                    onChange={(e) => setSwarmStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowSwarmModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-lg">Create Swarm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 6. Add Troop Modal */}
        {showTroopModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" /> Create Mixed Troop
                </h3>
                <button onClick={() => setShowTroopModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddTroop} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Troop Name</label>
                  <input type="text" required value={troopName} onChange={(e) => setTroopName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Troop Commander (Lead)</label>
                  <input type="text" value={troopLead} onChange={(e) => setTroopLead(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Annual Budget</label>
                  <input type="number" required value={troopBudget} onChange={(e) => setTroopBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={troopStatus}
                    onChange={(e) => setTroopStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowTroopModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg">Create Troop</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Entity Detail Modal */}
        {selectedEntity && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
                <h3 className="font-bold text-lg text-white capitalize">{selectedEntity.name}</h3>
                <button onClick={() => setSelectedEntity(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5 text-sm text-slate-300 overflow-y-auto pr-2 pb-2">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-400 uppercase text-xs">Entity Type</span>
                  <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded border border-purple-500/30 text-xs uppercase font-bold">
                    {selectedEntity._type}
                  </span>
                </div>

                {selectedEntity.desc && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Description</span>
                    <p className="bg-slate-900 p-3 rounded-lg border border-slate-800">{selectedEntity.desc}</p>
                  </div>
                )}
                
                {/* Single line properties block */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedEntity.role && (
                    <div>
                      <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Role</span>
                      <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 truncate">{selectedEntity.role}</p>
                    </div>
                  )}

                  {selectedEntity.lead && (
                    <div>
                      <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Lead / Manager</span>
                      <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 truncate">{selectedEntity.lead}</p>
                    </div>
                  )}

                  {(selectedEntity.count || selectedEntity.members) && (
                    <div>
                      <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Headcount</span>
                      <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 truncate">{selectedEntity.count || selectedEntity.members}</p>
                    </div>
                  )}

                  {(selectedEntity.annualSalary !== undefined || selectedEntity.monthlyCost !== undefined) && (
                    <div>
                      <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Cost</span>
                      <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-emerald-400 truncate">
                        ${(selectedEntity.annualSalary || selectedEntity.monthlyCost).toLocaleString()} / {selectedEntity.annualSalary ? 'yr' : 'mo'}
                      </p>
                    </div>
                  )}
                </div>

                {selectedEntity.budget !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Budget</span>
                      <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-emerald-400">${selectedEntity.budget.toLocaleString()}</p>
                    </div>
                    {selectedEntity.spent !== undefined && (
                      <div>
                        <span className="block font-semibold text-slate-400 mb-1 text-xs uppercase">Spent</span>
                        <p className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-amber-400">${selectedEntity.spent.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Arrays */}
                {selectedEntity.targets && selectedEntity.targets.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Targets</span>
                    <ul className="space-y-1.5">
                      {selectedEntity.targets.map((t: string, idx: number) => (
                        <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-2">
                          <Target className="w-4 h-4 text-rose-500 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntity.projects && selectedEntity.projects.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Projects</span>
                    <ul className="space-y-1.5">
                      {selectedEntity.projects.map((p: string, idx: number) => (
                        <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-2">
                          <Folder className="w-4 h-4 text-cyan-500 shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntity.tasks && selectedEntity.tasks.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Current Tasks</span>
                    <ul className="space-y-1.5">
                      {selectedEntity.tasks.map((t: string, idx: number) => (
                        <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntity.routines && selectedEntity.routines.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Routines</span>
                    <ul className="space-y-1.5">
                      {selectedEntity.routines.map((r: string, idx: number) => (
                        <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500 shrink-0" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedEntity.skills && selectedEntity.skills.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntity.skills.map((s: string, idx: number) => (
                        <span key={idx} className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-purple-500" /> {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntity.artifacts && selectedEntity.artifacts.length > 0 && (
                  <div>
                    <span className="block font-semibold text-slate-400 mb-2 text-xs uppercase">Artifacts</span>
                    <ul className="space-y-1.5">
                      {selectedEntity.artifacts.map((a: string, idx: number) => (
                        <li key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-sky-500 shrink-0" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ImmersiveScreenWrapper>
  );
};
