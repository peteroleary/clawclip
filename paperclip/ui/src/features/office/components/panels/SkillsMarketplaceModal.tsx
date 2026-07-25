import React from "react";
import { SkillsMarketplacePanel } from "./SkillsMarketplacePanel.js";
import { X } from "lucide-react";

interface SkillsMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId?: string;
}

export const SkillsMarketplaceModal: React.FC<SkillsMarketplaceModalProps> = ({
  isOpen,
  onClose,
  companyId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full max-w-4xl h-[650px] shadow-2xl flex flex-col overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-hidden">
          <SkillsMarketplacePanel companyId={companyId} />
        </div>
      </div>
    </div>
  );
};
