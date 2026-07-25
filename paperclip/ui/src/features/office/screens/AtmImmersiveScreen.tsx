import React, { useState } from "react";
import { Lock, Unlock, DollarSign, ArrowUpRight, ArrowDownLeft, ShieldCheck, X } from "lucide-react";

interface AtmImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyBudgetCents?: number;
  spentMonthlyCents?: number;
}

export const AtmImmersiveScreen: React.FC<AtmImmersiveScreenProps> = ({
  isOpen,
  onClose,
  monthlyBudgetCents = 150000,
  spentMonthlyCents = 42500,
}) => {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setIsAuthenticated(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[radial-gradient(circle_at_center,#113a3d_0%,#071719_65%,#020607_100%)] border border-cyan-500/40 rounded-2xl w-full max-w-3xl h-[600px] shadow-[0_0_50px_rgba(125,255,240,0.2)] text-[#d6fff7] font-mono flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[#0d3034] hover:bg-[#14474d] text-cyan-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* PIN Auth Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#7dfff0]/30 bg-[#0d3034] shadow-[0_0_30px_rgba(125,255,240,0.2)]">
              <Lock className="h-8 w-8 text-[#7dfff0]" />
            </div>

            <h2 className="text-xl font-bold tracking-widest text-[#dbfff6]">
              COMPANY ATM TREASURY LEDGER
            </h2>
            <p className="mt-2 text-xs uppercase tracking-widest text-[#83fff0]/60">
              Authentication required to view budget ledger
            </p>

            {/* PIN Dots */}
            <div className="my-6 flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 w-4 rounded-full border border-[#7dfff0]/50 transition-all ${
                    i < pin.length
                      ? "bg-[#7dfff0] shadow-[0_0_15px_rgba(125,255,240,0.8)]"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 w-64">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "C") setPin("");
                    else if (btn === "OK") {
                      if (pin.length === 4) setIsAuthenticated(true);
                    } else handlePinSubmit(btn);
                  }}
                  className="py-3 bg-[#0d3034]/80 hover:bg-[#15464c] border border-[#7dfff0]/20 rounded-lg text-sm font-bold text-[#7dfff0] transition"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Authenticated Ledger Screen */
          <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-[#7dfff0]/20 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#7dfff0]" />
                <div>
                  <h2 className="text-lg font-bold tracking-widest text-[#dbfff6]">
                    TREASURY & BUDGET LEDGER
                  </h2>
                  <p className="text-xs text-[#83fff0]/60">Authorized Account Access</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPin("");
                }}
                className="text-xs px-3 py-1.5 bg-[#0d3034] hover:bg-[#15464c] border border-[#7dfff0]/30 text-[#7dfff0] rounded-lg"
              >
                Lock Terminal
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 bg-[#0d3034]/60 border border-[#7dfff0]/20 rounded-xl space-y-2">
                <span className="text-xs text-[#83fff0]/60 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Monthly Allocated Budget
                </span>
                <span className="text-2xl font-bold text-emerald-300">
                  ${(monthlyBudgetCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-5 bg-[#0d3034]/60 border border-[#7dfff0]/20 rounded-xl space-y-2">
                <span className="text-xs text-[#83fff0]/60 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-cyan-400" /> Monthly Spent
                </span>
                <span className="text-2xl font-bold text-cyan-300">
                  ${(spentMonthlyCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Recent Ledger Transactions */}
            <div className="flex-1 bg-[#061719] border border-[#7dfff0]/20 rounded-xl p-4 space-y-3 overflow-y-auto text-xs">
              <h3 className="text-xs font-bold text-[#7dfff0] uppercase tracking-wider">
                Recent Ledger Events
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#0d3034]/40 rounded border border-[#7dfff0]/10">
                  <span className="text-emerald-300">AI Agent Token Consumption (Claude 3.5 Sonnet)</span>
                  <span className="font-bold text-amber-300">-$42.50</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#0d3034]/40 rounded border border-[#7dfff0]/10">
                  <span className="text-emerald-300">Human Staff Payroll Allocation (Engineering)</span>
                  <span className="font-bold text-amber-300">-$380.00</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
