import React, { useState, useEffect } from "react";
import { X, Wallet, DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight, Plus, Receipt, Landmark, ShieldCheck, Activity, Target } from "lucide-react";

export interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  format: "currency" | "months" | "percentage" | "raw";
  trend?: number; // percentage e.g., 5 for +5%, -2 for -2%
  trendLabel?: string;
  icon?: React.ReactNode;
}

export interface TagBudget {
  id: string;
  tag: string; // e.g., "#engineering", "#marketing"
  allocated: number;
  spent: number;
  provider?: string;
  externalId?: string;
}

interface WalletImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletImmersiveScreen: React.FC<WalletImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "ledger" | "cards" | "crypto" | "ach">("dashboard");

  // Modals State
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showACHModal, setShowACHModal] = useState(false);

  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  // Crypto Wallet Form State
  const [walletName, setWalletName] = useState("");
  const [walletNet, setWalletNet] = useState("Ethereum Mainnet");
  const [walletAddr, setWalletAddr] = useState("");

  // ACH Form State
  const [achHolder, setAchHolder] = useState("");
  const [achBank, setAchBank] = useState("");
  const [achRouting, setAchRouting] = useState("");
  const [achAccount, setAchAccount] = useState("");

  // Items Collections State
  const [cards, setCards] = useState([
    { id: "c1", name: "Corporate Debit Card", brand: "Visa", last4: "4242", exp: "12/28", status: "Primary" },
  ]);

  const [cryptoWallets, setCryptoWallets] = useState([
    { id: "w1", name: "Treasury Multisig Vault", net: "Ethereum Mainnet", addr: "0x71C...3a91", balance: "4.5 ETH" },
  ]);

  const [achAccounts, setAchAccounts] = useState([
    { id: "a1", name: "Silicon Valley Bank Checking", bank: "SVB", last4: "8821", routing: "121000358", status: "Verified" },
  ]);

  // Financial Dashboard Mock Data
  const [metrics] = useState<FinancialMetric[]>([
    { id: "m1", label: "Monthly Recurring Revenue", value: 125000, format: "currency", trend: 12.5, trendLabel: "vs last month", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { id: "m2", label: "Total Expenses (MTD)", value: 85400, format: "currency", trend: -2.4, trendLabel: "vs last month", icon: <TrendingDown className="w-5 h-5 text-rose-400" /> },
    { id: "m3", label: "Net Profit", value: 39600, format: "currency", trend: 8.1, trendLabel: "vs last month", icon: <DollarSign className="w-5 h-5 text-indigo-400" /> },
    { id: "m4", label: "Current Runway", value: 18, format: "months", trend: 0, trendLabel: "stable", icon: <Activity className="w-5 h-5 text-cyan-400" /> },
    { id: "m5", label: "Monthly Burn Rate", value: 45000, format: "currency", trend: 5.2, trendLabel: "vs last month", icon: <Landmark className="w-5 h-5 text-amber-400" /> },
    { id: "m6", label: "Customer Acquisition Cost", value: 450, format: "currency", trend: -15.0, trendLabel: "vs last month", icon: <Target className="w-5 h-5 text-purple-400" /> },
  ]);

  const [tagBudgets] = useState<TagBudget[]>([
    { id: "b1", tag: "#engineering", allocated: 50000, spent: 42000, provider: "ramp", externalId: "bgt_1928" },
    { id: "b2", tag: "#marketing", allocated: 20000, spent: 18500, provider: "stripe", externalId: "bgt_4210" },
    { id: "b3", tag: "#project-clawclip", allocated: 15000, spent: 16500, provider: "ramp", externalId: "bgt_1092" },
    { id: "b4", tag: "#ai-swarms", allocated: 5000, spent: 1200, provider: "internal", externalId: "bgt_local" },
    { id: "b5", tag: "#sales", allocated: 25000, spent: 8000, provider: "brex", externalId: "bgt_8821" },
  ]);

  const [ledger] = useState([
    { id: "t1", desc: "Anthropic Claude 3.5 Sonnet API Spend", amount: "-$42.50", date: "Today, 11:20 AM", category: "LLM Tokens", type: "expense", tag: "#ai-swarms" },
    { id: "t2", desc: "OpenAI GPT-4o Token Consumption", amount: "-$28.10", date: "Yesterday, 04:15 PM", category: "LLM Tokens", type: "expense", tag: "#ai-swarms" },
    { id: "t3", desc: "Vercel Enterprise Hosting", amount: "-$1,200.00", date: "Jul 21, 2026", category: "Infrastructure", type: "expense", tag: "#engineering" },
    { id: "t4", desc: "Company Treasury Deposit", amount: "+$50,000.00", date: "Jul 20, 2026", category: "Deposit", type: "income", tag: "#funding" },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showCardModal) setShowCardModal(false);
        else if (showCryptoModal) setShowCryptoModal(false);
        else if (showACHModal) setShowACHModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showCardModal, showCryptoModal, showACHModal, onClose]);

  if (!isOpen) return null;

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    setCards([
      {
        id: `card_${Date.now()}`,
        name: cardName.trim(),
        brand: "Mastercard",
        last4: cardNumber.slice(-4) || "9912",
        exp: cardExp || "08/29",
        status: "Active",
      },
      ...cards,
    ]);

    setCardName("");
    setCardNumber("");
    setShowCardModal(false);
  };

  const handleLinkCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName.trim()) return;

    setCryptoWallets([
      {
        id: `cw_${Date.now()}`,
        name: walletName.trim(),
        net: walletNet,
        addr: walletAddr ? `${walletAddr.slice(0, 5)}...${walletAddr.slice(-4)}` : "0x91F...2b01",
        balance: "0.00 ETH",
      },
      ...cryptoWallets,
    ]);

    setWalletName("");
    setWalletAddr("");
    setShowCryptoModal(false);
  };

  const handleAddACH = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achHolder.trim()) return;

    setAchAccounts([
      {
        id: `ach_${Date.now()}`,
        name: achHolder.trim(),
        bank: achBank || "Chase Bank",
        last4: achAccount.slice(-4) || "1029",
        routing: achRouting || "021000021",
        status: "Verified",
      },
      ...achAccounts,
    ]);

    setAchHolder("");
    setAchAccount("");
    setShowACHModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ATM Treasury & Financial Ledger</h2>
              <p className="text-xs text-slate-400">Company budget allocations, payment cards, crypto wallets, and ACH banking</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "dashboard" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "ledger" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Ledger
              </button>
              <button
                onClick={() => setActiveTab("cards")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "cards" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Cards ({cards.length})
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "crypto" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Crypto Wallets ({cryptoWallets.length})
              </button>
              <button
                onClick={() => setActiveTab("ach")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === "ach" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                ACH Banking ({achAccounts.length})
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
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-5xl mx-auto">
              
              {/* Key Metrics Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.map(m => (
                    <div key={m.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-400 font-medium">{m.label}</span>
                        {m.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white font-mono">
                          {m.format === "currency" ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(m.value) : m.format === "percentage" ? `${m.value}%` : m.format === "months" ? `${m.value} mos` : m.value}
                        </div>
                        {m.trend !== undefined && m.trendLabel && (
                          <div className={`text-[10px] flex items-center gap-1 mt-1 font-medium ${m.trend > 0 ? "text-emerald-400" : m.trend < 0 ? "text-rose-400" : "text-slate-500"}`}>
                            {m.trend > 0 ? <TrendingUp className="w-3 h-3" /> : m.trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                            {m.trend > 0 ? "+" : ""}{m.trend}% {m.trendLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag-based Budgets */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-slate-200">Budget Allocations</h3>
                  <button className="text-xs text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Allocate Funds
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tagBudgets.map(b => {
                    const pct = (b.spent / b.allocated) * 100;
                    const isOver = pct >= 100;
                    const isWarning = pct >= 85 && !isOver;
                    
                    const barColor = isOver ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
                    const textColor = isOver ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400";
                    const borderColor = isOver ? "border-rose-500/30" : isWarning ? "border-amber-500/30" : "border-emerald-500/30";

                    return (
                      <div key={b.id} className={`bg-slate-950 border ${borderColor} p-5 rounded-2xl space-y-4 hover:bg-slate-900/50 transition`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-slate-900 rounded-lg text-xs font-mono font-bold text-slate-300 border border-slate-800">
                              {b.tag}
                            </span>
                            {b.provider && (
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{b.provider}</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold ${textColor}`}>
                            {pct.toFixed(1)}% Utilized
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">Spent: <span className="text-white">${b.spent.toLocaleString()}</span></span>
                            <span className="text-slate-500">of ${b.allocated.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {activeTab === "ledger" && (
            <div className="space-y-3 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" /> Recent Expenditures & Deposits
                </h3>
              </div>

              {ledger.map((tx) => (
                <div key={tx.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl border ${tx.type === "income" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                      {tx.type === "income" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        {tx.desc}
                        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[9px] font-mono text-slate-400">{tx.tag}</span>
                      </h4>
                      <p className="text-xs text-slate-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-bold ${tx.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "cards" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Payment Cards</h3>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
                >
                  <Plus className="w-4 h-4" /> + Add New Card
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition">
                    <div className="flex justify-between items-center">
                      <CreditCard className="w-6 h-6 text-amber-400" />
                      <span className="text-xs font-bold text-emerald-400">{card.status}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{card.name}</h4>
                      <p className="text-xs font-mono text-slate-400">•••• •••• •••• {card.last4}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">Expires {card.exp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "crypto" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Linked Crypto Wallets</h3>
                <button
                  onClick={() => setShowCryptoModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
                >
                  <Plus className="w-4 h-4" /> + Link Wallet
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {cryptoWallets.map((w) => (
                  <div key={w.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition">
                    <h4 className="font-bold text-white text-base">{w.name}</h4>
                    <p className="text-xs text-amber-400 font-mono">{w.net} • {w.addr}</p>
                    <span className="text-xs font-bold text-emerald-400 block font-mono">{w.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ach" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm">Linked ACH Bank Accounts</h3>
                <button
                  onClick={() => setShowACHModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
                >
                  <Plus className="w-4 h-4" /> + Add ACH Account
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {achAccounts.map((a) => (
                  <div key={a.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition">
                    <div className="flex justify-between items-center">
                      <Landmark className="w-5 h-5 text-amber-400" />
                      <span className="text-xs text-emerald-400 font-semibold">{a.status}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{a.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{a.bank} • Account ending in {a.last4}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1. Add Card Modal */}
        {showCardModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" /> Add Corporate Card
                </h3>
                <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• 8821"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="08/29"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">CVC</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowCardModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Link Crypto Wallet Modal */}
        {showCryptoModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-400" /> Link Crypto Wallet
                </h3>
                <button onClick={() => setShowCryptoModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLinkCrypto} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Wallet Label / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Treasury Multisig Vault"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Network</label>
                  <select
                    value={walletNet}
                    onChange={(e) => setWalletNet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                    <option value="Solana">Solana Mainnet</option>
                    <option value="Polygon">Polygon POS</option>
                    <option value="Base">Base Mainnet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Wallet Public Address</label>
                  <input
                    type="text"
                    required
                    placeholder="0x71C... or Solana Address"
                    value={walletAddr}
                    onChange={(e) => setWalletAddr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowCryptoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Link Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Add ACH Modal */}
        {showACHModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-400" /> Link ACH Bank Account
                </h3>
                <button onClick={() => setShowACHModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddACH} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paperclip Corp"
                    value={achHolder}
                    onChange={(e) => setAchHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Bank Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chase Bank / SVB"
                    value={achBank}
                    onChange={(e) => setAchBank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Routing Number (9 Digits)</label>
                    <input
                      type="text"
                      maxLength={9}
                      placeholder="121000358"
                      value={achRouting}
                      onChange={(e) => setAchRouting(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Account Number</label>
                    <input
                      type="text"
                      placeholder="•••• 8821"
                      value={achAccount}
                      onChange={(e) => setAchAccount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowACHModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-950/50">
                    Add ACH Account
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
