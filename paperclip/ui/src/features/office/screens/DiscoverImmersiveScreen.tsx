import React, { useState, useEffect } from "react";
import { X, Compass, Cpu, Wrench, Workflow, Sparkles, CheckCircle2, Search, Link2, Plus, Edit2, Trash2 } from "lucide-react";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

interface DiscoverImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoverImmersiveScreen: React.FC<DiscoverImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"skills" | "mcps" | "tools" | "workflows" | "connectors" | "templates">("skills");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showMCPModal, setShowMCPModal] = useState(false);
  const [showConnectorModal, setShowConnectorModal] = useState(false);

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingMcpId, setEditingMcpId] = useState<string | null>(null);
  const [editingConnectorId, setEditingConnectorId] = useState<string | null>(null);

  // Skill Form State
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState("DevOps");
  const [skillDesc, setSkillDesc] = useState("");

  // MCP Form State
  const [mcpName, setMcpName] = useState("");
  const [mcpTransport, setMcpTransport] = useState("stdio");
  const [mcpCmd, setMcpCmd] = useState("");

  // Connector Form State
  const [connName, setConnName] = useState("");
  const [connPlatform, setConnPlatform] = useState("GitHub");
  const [connKey, setConnKey] = useState("");

  // Lists State
  const [skills, setSkills] = useState([
    { id: "s1", name: "GitHub Integration & PR Review", category: "DevOps", desc: "Automates code review, testing, and PR merging.", status: "Installed" },
    { id: "s2", name: "Modern Web Guidance & CSS Architecture", category: "Frontend", desc: "Enforces UI standards, accessible layouts, and Glassmorphism.", status: "Installed" },
    { id: "s3", name: "BigQuery AI & Analytics Engine", category: "Data Science", desc: "Executes SQL transformations and LLM ML queries.", status: "Available" },
  ]);

  const [mcps, setMcps] = useState([
    { id: "m1", name: "Chrome DevTools MCP", desc: "Browser automation, performance profiling, and DOM analysis.", version: "v1.2.0" },
    { id: "m2", name: "Google Cloud Firestore MCP", desc: "Database querying, security rules inspection, and mutations.", version: "v2.0.1" },
    { id: "m3", name: "Visualization & Charts MCP", desc: "Dynamic rendering of charts, graphs, and metric dashboards.", version: "v0.9.5" },
  ]);

  const [connectors, setConnectors] = useState([
    { id: "c1", name: "GitHub Enterprise Repo Connector", platform: "GitHub", status: "Connected", syncTime: "5 mins ago" },
    { id: "c2", name: "Slack Workspace Webhook Feed", platform: "Slack", status: "Connected", syncTime: "Just now" },
    { id: "c3", name: "Jira Engineering Ticket Sync", platform: "Jira", status: "Active", syncTime: "1 hour ago" },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showSkillModal) setShowSkillModal(false);
        else if (showMCPModal) setShowMCPModal(false);
        else if (showConnectorModal) setShowConnectorModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showSkillModal, showMCPModal, showConnectorModal]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    if (editingSkillId) {
      setSkills(skills.map(s => s.id === editingSkillId ? { ...s, name: skillName.trim(), category: skillCat, desc: skillDesc || "Custom agent skill." } : s));
      setEditingSkillId(null);
    } else {
      setSkills([
        { id: `s_${Date.now()}`, name: skillName.trim(), category: skillCat, desc: skillDesc || "Custom agent skill.", status: "Installed" },
        ...skills,
      ]);
    }
    setSkillName("");
    setSkillDesc("");
    setShowSkillModal(false);
  };

  const handleAddMCP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcpName.trim()) return;

    if (editingMcpId) {
      setMcps(mcps.map(m => m.id === editingMcpId ? { ...m, name: mcpName.trim(), desc: `Transport: ${mcpTransport} • ${mcpCmd}` } : m));
      setEditingMcpId(null);
    } else {
      setMcps([
        { id: `m_${Date.now()}`, name: mcpName.trim(), desc: `Transport: ${mcpTransport} • ${mcpCmd}`, version: "v1.0.0" },
        ...mcps,
      ]);
    }
    setMcpName("");
    setMcpCmd("");
    setShowMCPModal(false);
  };

  const handleAddConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connName.trim()) return;

    if (editingConnectorId) {
      setConnectors(connectors.map(c => c.id === editingConnectorId ? { ...c, name: connName.trim(), platform: connPlatform } : c));
      setEditingConnectorId(null);
    } else {
      setConnectors([
        { id: `c_${Date.now()}`, name: connName.trim(), platform: connPlatform, status: "Connected", syncTime: "Just now" },
        ...connectors,
      ]);
    }
    setConnName("");
    setConnKey("");
    setShowConnectorModal(false);
  };

  const getTabAction = () => {
    switch (activeTab) {
      case "skills":
        return { label: "Add Skill", action: () => { setEditingSkillId(null); setSkillName(""); setSkillDesc(""); setShowSkillModal(true); } };
      case "mcps":
        return { label: "Add MCP", action: () => { setEditingMcpId(null); setMcpName(""); setMcpCmd(""); setShowMCPModal(true); } };
      case "connectors":
        return { label: "Add Connector", action: () => { setEditingConnectorId(null); setConnName(""); setConnKey(""); setShowConnectorModal(true); } };
      default:
        return null;
    }
  };

  const tabAction = getTabAction();

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Discover & Capabilities Marketplace"
      subtitle="Explore AI agent skills, MCP tools, connectors, and multi-agent workflows"
      icon={Compass}
      iconColorClass="text-amber-400"
      iconBgClass="bg-amber-500/10 border-amber-500/30"
      closeOnEsc={!showSkillModal && !showMCPModal && !showConnectorModal}
      showHeader={false}
    >
      {/* Control bar */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          <button onClick={() => setActiveTab("skills")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "skills" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Skills</button>
          <button onClick={() => setActiveTab("mcps")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "mcps" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>MCP Servers</button>
          <button onClick={() => setActiveTab("connectors")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "connectors" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Connectors ({connectors.length})</button>
          <button onClick={() => setActiveTab("tools")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "tools" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>System Tools</button>
          <button onClick={() => setActiveTab("workflows")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "workflows" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Workflows</button>
          <button onClick={() => setActiveTab("templates")} className={`px-3 py-1.5 rounded-lg transition ${activeTab === "templates" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"}`}>Templates</button>
        </div>

        {/* Action Button */}
        {tabAction && (
          <div className="relative group shrink-0">
            <button
              onClick={tabAction.action}
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              {tabAction.label}
            </span>
          </div>
        )}
      </div>

      {/* Content body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {activeTab === "skills" && (
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {skill.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {skill.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                  <p className="text-xs text-slate-400 leading-snug">{skill.desc}</p>
                </div>
                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-900 mt-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingSkillId(skill.id);
                        setSkillName(skill.name);
                        setSkillCat(skill.category);
                        setSkillDesc(skill.desc);
                        setShowSkillModal(true);
                      }}
                      className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}
                      className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "mcps" && (
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            {mcps.map((mcp) => (
              <div key={mcp.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Cpu className="w-5 h-5" />
                    <span className="font-mono text-xs font-bold text-slate-400">{mcp.version}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{mcp.name}</h4>
                  <p className="text-xs text-slate-400 leading-snug">{mcp.desc}</p>
                </div>
                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-900 mt-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingMcpId(mcp.id);
                        setMcpName(mcp.name);
                        setShowMCPModal(true);
                      }}
                      className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => setMcps(mcps.filter(m => m.id !== mcp.id))}
                      className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "connectors" && (
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            {connectors.map((c) => (
              <div key={c.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                      {c.platform}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{c.status}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500">Synced {c.syncTime}</p>
                </div>
                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-900 mt-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingConnectorId(c.id);
                        setConnName(c.name);
                        setConnPlatform(c.platform);
                        setShowConnectorModal(true);
                      }}
                      className="p-1 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => setConnectors(connectors.filter(item => item.id !== c.id))}
                      className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-955 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tools" && (
          <div className="max-w-4xl mx-auto space-y-3">
            {["Run Command (zsh)", "View / Replace File Content", "Web Application Browser Subagent", "Schedule Background Cron"].map((tool, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between hover:border-amber-500/40 transition">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" /> {tool}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Native Tool</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "workflows" && (
          <div className="max-w-4xl mx-auto space-y-3">
            {[
              { name: "Full-Stack Web App CI/CD Pipeline", steps: "6 Automated Steps" },
              { name: "Agent Code Review & Security Audit", steps: "3 Verification Steps" },
            ].map((wf, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-amber-500/40 transition">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-amber-400" /> {wf.name}
                  </h4>
                  <span className="text-xs text-slate-400">{wf.steps}</span>
                </div>
                <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition">
                  Run Workflow
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Documentation Standard", desc: "API, ARCHITECTURE, README, MISSION" },
              { name: "Social Media Campaign", desc: "Campaign roadmap, assets, and scheduling" },
              { name: "New Hire Onboarding", desc: "Training plan, accounts, and policies" },
            ].map((tmpl, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition">
                <h4 className="font-bold text-white text-sm">{tmpl.name}</h4>
                <p className="text-xs text-slate-400 leading-snug">{tmpl.desc}</p>
                <button className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition w-full">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1. Add Connector Modal */}
      {showConnectorModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-amber-400" /> {editingConnectorId ? "Edit Connector Details" : "Add Connector / Integration"}
              </h3>
              <button onClick={() => setShowConnectorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConnector} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Connector Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub Enterprise Repo Connector"
                  value={connName}
                  onChange={(e) => setConnName(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Platform</label>
                <select
                  value={connPlatform}
                  onChange={(e) => setConnPlatform(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="GitHub">GitHub</option>
                  <option value="Slack">Slack</option>
                  <option value="Jira">Jira</option>
                  <option value="Google Drive">Google Drive</option>
                  <option value="Notion">Notion</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">API Key / Token</label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={connKey}
                  onChange={(e) => setConnKey(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowConnectorModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                  {editingConnectorId ? "Save Changes" : "Add Connector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Skill Modal */}
      {showSkillModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> {editingSkillId ? "Edit Custom Skill" : "Create Custom Skill"}
              </h3>
              <button onClick={() => setShowSkillModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Docker Security Audit"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Category</label>
                <input
                  type="text"
                  placeholder="DevOps / Security / Frontend"
                  value={skillCat}
                  onChange={(e) => setSkillCat(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe skill capabilities..."
                  value={skillDesc}
                  onChange={(e) => setSkillDesc(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowSkillModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                  {editingSkillId ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
