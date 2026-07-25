import React from "react";
import { GitPullRequest, GitMerge, CheckCircle, X, Code, Terminal } from "lucide-react";

interface GithubImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubImmersiveScreen: React.FC<GithubImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const pullRequests = [
    {
      id: "PR-89",
      title: "Refactor Claw3D & Paperclip into single unified 3D office platform",
      author: "OpenClaw Coder (Bot)",
      status: "approved",
      branch: "feat/unified-claw3d-paperclip",
      changes: "+1,420 / -210",
    },
    {
      id: "PR-90",
      title: "Add human employee configuration & 3D desk seating model",
      author: "Alex Mercer (Human Staff)",
      status: "in_review",
      branch: "feat/human-staff-config",
      changes: "+650 / -40",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-4xl h-[650px] shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#070a12] border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <GitPullRequest className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                GitHub PR Review Room
              </h2>
              <p className="text-xs text-slate-400">
                Automated & Human Code Review Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Active Pull Requests List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" /> Open Pull Requests ({pullRequests.length})
            </h3>

            <div className="space-y-3">
              {pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="bg-[#111827] border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 space-y-3 transition shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-purple-400">{pr.id}</span>
                        <h4 className="font-bold text-sm text-slate-100">{pr.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Opened by <span className="text-slate-200 font-medium">{pr.author}</span> • Branch: <span className="font-mono text-slate-300">{pr.branch}</span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
                      pr.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}>
                      {pr.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <span className="font-mono text-slate-400">{pr.changes}</span>
                    <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold shadow transition flex items-center gap-1.5">
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Review Diff & Merge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
