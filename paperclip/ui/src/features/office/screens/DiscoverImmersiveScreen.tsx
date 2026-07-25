import React, { useState, useEffect } from "react";
import { X, Compass, Cpu, Wrench, Workflow, Sparkles, CheckCircle2, Search, Link2, Plus } from "lucide-react";

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
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showSkillModal, showMCPModal, showConnectorModal, onClose]);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSkills([
      { id: `s_${Date.now()}`, name: skillName.trim(), category: skillCat, desc: skillDesc || "Custom agent skill.", status: "Installed" },
      ...skills,
    ]);
    setSkillName("");
    setShowSkillModal(false);
  };

  const handleAddMCP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcpName.trim()) return;

    setMcps([
      { id: `m_${Date.now()}`, name: mcpName.trim(), desc: `Transport: ${mcpTransport} • ${mcpCmd}`, version: "v1.0.0" },
      ...mcps,
    ]);
    setMcpName("");
    setShowMCPModal(false);
  };

  const handleAddConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connName.trim()) return;

    setConnectors([
      { id: `c_${Date.now()}`, name: connName.trim(), platform: connPlatform, status: "Connected", syncTime: "Just now" },
      ...connectors,
    ]);
    setConnName("");
    setShowConnectorModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Discover & Capabilities Marketplace</h2>
              <p className="text-xs text-slate-400">Explore AI agent skills, MCP tools, connectors, and multi-agent workflows</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "skills" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveTab("mcps")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "mcps" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                MCP Servers
              </button>
              <button
                onClick={() => setActiveTab("connectors")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "connectors" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Connectors ({connectors.length})
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "tools" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                System Tools
              </button>
              <button
                onClick={() => setActiveTab("workflows")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "workflows" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Workflows
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "templates" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Templates
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

        {/* Search & Content */}
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
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Agent Skills</h3>
                <button
                  onClick={() => setShowSkillModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Skill
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition">
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
                ))}
              </div>
            </div>
          )}

          {activeTab === "mcps" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">MCP Servers</h3>
                <button
                  onClick={() => setShowMCPModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add MCP Server
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {mcps.map((mcp) => (
                  <div key={mcp.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Cpu className="w-5 h-5" />
                      <span className="font-mono text-xs font-bold text-slate-400">{mcp.version}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{mcp.name}</h4>
                    <p className="text-xs text-slate-400 leading-snug">{mcp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "connectors" && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Third-Party Connectors & Integrations</h3>
                <button
                  onClick={() => setShowConnectorModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> + Add Connector
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {connectors.map((c) => (
                  <div key={c.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-amber-500/40 transition">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        {c.platform}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{c.status}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500">Synced {c.syncTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="max-w-4xl mx-auto space-y-3">
              {["Run Command (zsh)", "View / Replace File Content", "Web Application Browser Subagent", "Schedule Background Cron"].map((tool, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
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
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
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
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Documentation & Project Templates</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
            </div>
          )}
        </div>

        {/* 1. Add Connector Modal */}
        {showConnectorModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-amber-400" /> Add Connector / Integration
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Platform</label>
                  <select
                    value={connPlatform}
                    onChange={(e) => setConnPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowConnectorModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Add Connector
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
                  <Sparkles className="w-5 h-5 text-amber-400" /> Create Custom Skill
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    placeholder="DevOps / Security / Frontend"
                    value={skillCat}
                    onChange={(e) => setSkillCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe skill capabilities..."
                    value={skillDesc}
                    onChange={(e) => setSkillDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowSkillModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Create Skill
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
