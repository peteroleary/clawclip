import React, { useState, useEffect } from "react";
import { X, Contact, Plus, Search, Mail, Phone, Edit2, Trash2 } from "lucide-react";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

interface DirectoryImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ContactType = "People" | "Customers" | "Clients" | "Contractors" | "Employees" | "Companies" | "Vendors" | "Suppliers";

export const DirectoryImmersiveScreen: React.FC<DirectoryImmersiveScreenProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"All" | ContactType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Contact Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [cName, setCName] = useState("");
  const [cType, setCType] = useState<ContactType>("Customers");
  const [cCompany, setCCompany] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cRole, setCRole] = useState("");

  const [contacts, setContacts] = useState([
    { id: "c1", name: "Apex Global Cloud Solutions", type: "Vendors", company: "Apex Corp", email: "support@apexcloud.com", phone: "+1 (800) 555-0199", role: "Cloud Infrastructure" },
    { id: "c2", name: "Michael Vance", type: "Clients", company: "Vance Media Enterprises", email: "mvance@vancemedia.io", phone: "+1 (415) 890-1234", role: "Enterprise Client Lead" },
    { id: "c3", name: "Quantum Hardware Supply", type: "Suppliers", company: "Quantum Inc", email: "sales@quantumsupply.com", phone: "+1 (212) 432-8800", role: "Server Rack Supplier" },
    { id: "c4", name: "David Kim", type: "Contractors", company: "Independent", email: "dkim@contractor.dev", phone: "+1 (650) 321-9988", role: "Senior Rust Engineer" },
    { id: "c5", name: "Sarah Chen", type: "Employees", company: "Paperclip AI", email: "sarah@paperclip.ai", phone: "+1 (415) 555-0142", role: "VP of Product & Eng" },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showModal) setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showModal]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) return;

    if (editingContactId) {
      setContacts(contacts.map(c => c.id === editingContactId ? {
        ...c,
        name: cName.trim(),
        type: cType,
        company: cCompany || "N/A",
        email: cEmail || "contact@external.org",
        phone: cPhone || "N/A",
        role: cRole || cType,
      } : c));
      setEditingContactId(null);
    } else {
      setContacts([
        {
          id: `c_${Date.now()}`,
          name: cName.trim(),
          type: cType,
          company: cCompany || "N/A",
          email: cEmail || "contact@external.org",
          phone: cPhone || "N/A",
          role: cRole || cType,
        },
        ...contacts,
      ]);
    }

    setCName("");
    setCCompany("");
    setCEmail("");
    setCPhone("");
    setCRole("");
    setShowModal(false);
  };

  const filteredContacts = contacts.filter((item) => {
    const matchesTab = activeTab === "All" || item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Universal Contact Directory"
      subtitle="Directory of people, customers, clients, contractors, employees, companies, vendors & suppliers"
      icon={Contact}
      iconColorClass="text-teal-400"
      iconBgClass="bg-teal-500/10 border-teal-500/30"
      closeOnEsc={!showModal}
      showHeader={false}
    >
      {/* Toolbar & Filters */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          {(["All", "People", "Customers", "Clients", "Contractors", "Employees", "Companies", "Vendors", "Suppliers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === t ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search Bar & Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="relative group">
            <button
              onClick={() => {
                setEditingContactId(null);
                setCName("");
                setCCompany("");
                setCEmail("");
                setCPhone("");
                setCRole("");
                setShowModal(true);
              }}
              className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              Add Contact
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filteredContacts.map((c) => (
            <div key={c.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-teal-500/40 transition shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-white text-base">{c.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{c.role} • {c.company}</p>
                </div>
                <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[9px] font-bold">
                    {c.type}
                  </span>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingContactId(c.id);
                        setCName(c.name);
                        setCType(c.type as ContactType);
                        setCCompany(c.company);
                        setCEmail(c.email);
                        setCPhone(c.phone);
                        setCRole(c.role);
                        setShowModal(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setContacts(contacts.filter(item => item.id !== c.id));
                      }}
                      className="p-1 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>{c.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Contact className="w-5 h-5 text-teal-400" /> {editingContactId ? "Edit Contact Details" : "Add Contact Entry"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Contact Name / Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Logistics"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Contact Type</label>
                <select
                  value={cType}
                  onChange={(e) => setCType(e.target.value as ContactType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="People">People</option>
                  <option value="Customers">Customers</option>
                  <option value="Clients">Clients</option>
                  <option value="Contractors">Contractors</option>
                  <option value="Employees">Employees</option>
                  <option value="Companies">Companies</option>
                  <option value="Vendors">Vendors</option>
                  <option value="Suppliers">Suppliers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={cCompany}
                    onChange={(e) => setCCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Role / Specialty</label>
                  <input
                    type="text"
                    placeholder="Logistics Provider"
                    value={cRole}
                    onChange={(e) => setCRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="contact@acmelogistics.com"
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-950/50">
                  {editingContactId ? "Save Changes" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
