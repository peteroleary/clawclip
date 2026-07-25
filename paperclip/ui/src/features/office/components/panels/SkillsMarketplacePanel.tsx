import React, { useState, useEffect } from "react";
import { Search, Sparkles, Check, Download, Zap, BookOpen, Cpu } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  installed: boolean;
}

interface SkillsMarketplacePanelProps {
  companyId?: string;
  onInstallSkill?: (skillId: string) => void;
}

export const SkillsMarketplacePanel: React.FC<SkillsMarketplacePanelProps> = ({
  companyId,
  onInstallSkill,
}) => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    // Default catalog of agentic skills & human capabilities
    setSkills([
      {
        id: "skill-code-review",
        name: "Automated PR Code Reviewer",
        description: "Scans pull requests for syntax, security flaws, performance bugs, and style violations.",
        category: "Development",
        author: "Claw3D Core",
        installed: true,
      },
      {
        id: "skill-db-migrations",
        name: "PostgreSQL Drizzle Migration Helper",
        description: "Safely generates, checks, and executes database schema migrations with safety assertions.",
        category: "Database",
        author: "Paperclip",
        installed: true,
      },
      {
        id: "skill-github-standup",
        name: "Daily GitHub Standup Bot",
        description: "Aggregates daily commits, PRs, and closed tickets into a daily standup summary.",
        category: "Operations",
        author: "OpenClaw",
        installed: false,
      },
      {
        id: "skill-janitor-cleanup",
        name: "Janitor Session Context Reset",
        description: "Cleans up stalled workspace files, logs, and temp artifacts to maintain agent health.",
        category: "System",
        author: "Claw3D Janitor",
        installed: false,
      },
      {
        id: "skill-a11y-audit",
        name: "Accessibility & Core Web Vitals Auditor",
        description: "Runs Lighthouse & DevTools accessibility checks on frontend web applications.",
        category: "QA & Testing",
        author: "Frontend Guild",
        installed: false,
      },
    ]);
  }, [companyId]);

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === "all" || skill.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["all", "Development", "Database", "Operations", "System", "QA & Testing"];

  const toggleInstall = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, installed: !s.installed } : s))
    );
    onInstallSkill?.(id);
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-100 p-5 space-y-4 font-sans">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Skills & Capability Marketplace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover and equip skills for AI Agents & Human Staff in your workspace.
          </p>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills, playbooks, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-[11px] rounded-md capitalize transition font-medium whitespace-nowrap ${
                filterCategory === cat
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-1">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#0f172a]/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{skill.name}</h3>
                    <span className="text-[10px] text-slate-400">by {skill.author}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {skill.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {skill.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" /> Compatible with Agents & Humans
              </span>

              <button
                onClick={() => toggleInstall(skill.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  skill.installed
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
                }`}
              >
                {skill.installed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Equipped</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Equip Skill</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
