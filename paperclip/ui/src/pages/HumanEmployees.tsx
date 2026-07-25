import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users, UserPlus, Mail, Briefcase, DollarSign, Clock, Shield, Sparkles, CheckCircle2 } from "lucide-react";

interface HumanEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string | null;
  department: string;
  status: string;
  reportsTo: string | null;
  hourlyCostCents: number;
  workingHours: { start: string; end: string; timezone: string };
  skills: string[];
  avatarConfig: {
    hairStyle?: string;
    hairColor?: string;
    outfitColor?: string;
    skinTone?: string;
  };
}

export const HumanEmployeesPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [employees, setEmployees] = useState<HumanEmployee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Employee Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newRole, setNewRole] = useState("member");
  const [newHourlyRate, setNewHourlyRate] = useState("50");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      if (!companyId) {
        setEmployees(getMockEmployees());
        return;
      }
      const res = await fetch(`/api/companies/${companyId}/human-employees`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.length > 0 ? data : getMockEmployees());
      } else {
        setEmployees(getMockEmployees());
      }
    } catch {
      setEmployees(getMockEmployees());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [companyId]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const payload = {
      name: newName,
      email: newEmail,
      title: newTitle || "Software Engineer",
      department: newDepartment,
      role: newRole,
      hourlyCostCents: Math.round(parseFloat(newHourlyRate || "50") * 100),
      workingHours: { start: "09:00", end: "17:00", timezone: "EST" },
      reportsTo: null,
      avatarConfig: {
        hairStyle: "short",
        hairColor: "#3b82f6",
        outfitColor: "#1e293b",
        skinTone: "#fca5a5",
      },
    };

    try {
      if (companyId) {
        const res = await fetch(`/api/companies/${companyId}/human-employees`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchEmployees();
        } else {
          setEmployees((prev) => [...prev, { id: `human-${Date.now()}`, status: "active", skills: ["General"], ...payload }]);
        }
      } else {
        setEmployees((prev) => [...prev, { id: `human-${Date.now()}`, status: "active", skills: ["General"], ...payload }]);
      }
    } catch {
      setEmployees((prev) => [...prev, { id: `human-${Date.now()}`, status: "active", skills: ["General"], ...payload }]);
    }

    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    setNewTitle("");
  };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-400" />
            Human Employees & Staff Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure, manage, and assign human team members alongside autonomous AI agents.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Human Employee</span>
        </button>
      </div>

      {/* Roster Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 space-x-2">
          <Sparkles className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Loading Human Workforce Roster...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-100">{emp.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {emp.email}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                    {emp.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Title:
                    </span>
                    <span className="font-medium text-slate-200">{emp.title || emp.role}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-slate-500" /> Department:
                    </span>
                    <span className="font-medium text-slate-200">{emp.department}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Hourly Rate:
                    </span>
                    <span className="font-medium text-amber-400">
                      ${((emp.hourlyCostCents || 5000) / 100).toFixed(2)}/hr
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Shift:
                    </span>
                    <span className="font-medium text-slate-300">
                      {emp.workingHours?.start || "09:00"} - {emp.workingHours?.end || "17:00"} ({emp.workingHours?.timezone || "UTC"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3D Office Desk Seated
                </span>
                <span className="text-slate-500">ID: {emp.id.slice(0, 8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              Configure New Human Employee
            </h2>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rachel@company.ai"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title / Position</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Frontend Architect"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hourly Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="65"
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg"
                >
                  Save Human Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function getMockEmployees(): HumanEmployee[] {
  return [
    {
      id: "human-1",
      name: "Alex Mercer",
      email: "alex.mercer@company.ai",
      role: "lead",
      title: "VP of Product & Engineering",
      department: "Engineering",
      status: "active",
      reportsTo: null,
      hourlyCostCents: 9500,
      workingHours: { start: "09:00", end: "17:00", timezone: "EST" },
      skills: ["React", "System Architecture", "AI Orchestration"],
      avatarConfig: { hairStyle: "short", hairColor: "#d97706", outfitColor: "#1e293b", skinTone: "#fca5a5" },
    },
    {
      id: "human-2",
      name: "Sarah Chen",
      email: "sarah.chen@company.ai",
      role: "senior_engineer",
      title: "Senior Full-Stack Architect",
      department: "Engineering",
      status: "active",
      reportsTo: "human-1",
      hourlyCostCents: 8000,
      workingHours: { start: "09:00", end: "17:00", timezone: "PST" },
      skills: ["TypeScript", "Node.js", "Drizzle ORM"],
      avatarConfig: { hairStyle: "long", hairColor: "#0284c7", outfitColor: "#047857", skinTone: "#fde047" },
    },
    {
      id: "human-3",
      name: "David Kim",
      email: "david.kim@company.ai",
      role: "designer",
      title: "Staff Product Designer",
      department: "Design",
      status: "active",
      reportsTo: "human-1",
      hourlyCostCents: 7500,
      workingHours: { start: "09:30", end: "17:30", timezone: "EST" },
      skills: ["Figma", "UI/UX", "3D Modeling"],
      avatarConfig: { hairStyle: "short", hairColor: "#9333ea", outfitColor: "#3b82f6", skinTone: "#fed7aa" },
    },
  ];
}
