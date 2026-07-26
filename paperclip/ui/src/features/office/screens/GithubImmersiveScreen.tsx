import React from "react";
import { GitPullRequest, GitMerge, Code } from "lucide-react";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

interface GithubImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubImmersiveScreen: React.FC<GithubImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
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
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="GitHub PR Review Room"
      subtitle="Automated & Human Code Review Pipeline"
      icon={GitPullRequest}
      iconColorClass="text-purple-400"
      fullScreen={false}
    >
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
    </ImmersiveScreenWrapper>
  );
};
