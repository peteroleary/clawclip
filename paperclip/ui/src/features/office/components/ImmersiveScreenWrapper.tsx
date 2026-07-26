import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ImmersiveScreenWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string; // e.g. "text-rose-400"
  iconBgClass?: string; // e.g. "bg-rose-500/10 border-rose-500/30"
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  fullScreen?: boolean; // If false, renders as a centered modal (like GitHub screen)
  closeOnEsc?: boolean;
  showHeader?: boolean;
}

export const ImmersiveScreenWrapper: React.FC<ImmersiveScreenWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-cyan-400",
  iconBgClass = "bg-cyan-500/10 border-cyan-500/30",
  headerActions,
  children,
  fullScreen = true,
  closeOnEsc = true,
  showHeader = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && closeOnEsc) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  if (!fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-4xl h-[650px] shadow-2xl text-slate-100 font-sans flex flex-col relative overflow-hidden">
          {/* Header */}
          {showHeader && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#070a12] border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <Icon className={`w-6 h-6 ${iconColorClass}`} />
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {title}
                  </h2>
                  {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {headerActions}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-4">
              <div className={`p-2.5 rounded-xl border ${iconBgClass} ${iconColorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {headerActions}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col pb-20">
          {children}
        </div>
      </div>
    </div>
  );
};
