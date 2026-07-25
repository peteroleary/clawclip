import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Repeat, Plus, Clock, Play, CheckCircle2 } from "lucide-react";
import type { Workforce3DMember } from "../types.js";

interface SchedulingImmersiveScreenProps {
  isOpen: boolean;
  onClose: () => void;
  workforce?: Workforce3DMember[];
}

export const SchedulingImmersiveScreen: React.FC<SchedulingImmersiveScreenProps> = ({
  isOpen,
  onClose,
  workforce = [],
}) => {
  const [activeTab, setActiveTab] = useState<"routines" | "calendar">("routines");

  // Modals state
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Routine Form State
  const [routineName, setRoutineName] = useState("");
  const [routineSchedule, setRoutineSchedule] = useState("Every Day at 09:00 AM");
  const [routineAssignee, setRoutineAssignee] = useState("");
  const [routineAction, setRoutineAction] = useState("");

  // Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Meeting");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("09:00");
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventRecurring, setEventRecurring] = useState(false);

  // Items State
  const [routines, setRoutines] = useState([
    { id: "r1", name: "Daily Standup Briefing", schedule: "Every Day at 09:00 AM", status: "Active", lastRun: "Today at 09:00 AM", agent: "Hermes Manager" },
    { id: "r2", name: "Automated Code Review Sweep", schedule: "Every 4 Hours", status: "Active", lastRun: "2 hours ago", agent: "OpenClaw Coder" },
    { id: "r3", name: "Weekly Budget & Expenditure Reconciliation", schedule: "Every Monday at 08:00 AM", status: "Scheduled", lastRun: "Jul 21, 2026", agent: "Sarah Chen" },
  ]);

  const [events, setEvents] = useState([
    { id: "e1", title: "Q3 Sprint Planning Sync", date: "2026-07-25", time: "02:00 PM - 02:45 PM", category: "Meeting", recurring: true },
    { id: "e2", title: "Autonomous Agent Swarm Deployment", date: "2026-07-26", time: "10:00 AM - 11:00 AM", category: "Deployment", recurring: false },
    { id: "e3", title: "All-Hands Quarterly Review", date: "2026-07-28", time: "03:00 PM - 04:30 PM", category: "Company", recurring: true },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (showRoutineModal) setShowRoutineModal(false);
        else if (showEventModal) setShowEventModal(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showRoutineModal, showEventModal, onClose]);

  if (!isOpen) return null;

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName.trim()) return;

    const newR = {
      id: `r_${Date.now()}`,
      name: routineName.trim(),
      schedule: routineSchedule,
      status: "Active",
      lastRun: "Just now",
      agent: routineAssignee || (workforce.length > 0 ? workforce[0].name : "Hermes Manager"),
    };

    setRoutines([newR, ...routines]);
    setRoutineName("");
    setRoutineAction("");
    setShowRoutineModal(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newE = {
      id: `e_${Date.now()}`,
      title: eventTitle.trim(),
      date: eventDate || "2026-07-25",
      time: `${eventStartTime} - ${eventEndTime}`,
      category: eventType,
      recurring: eventRecurring,
    };

    setEvents([newE, ...events]);
    setEventTitle("");
    setShowEventModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl w-full h-full shadow-2xl text-slate-100 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06090d] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Scheduling & Automation</h2>
              <p className="text-xs text-slate-400">Manage recurring agent routines and company calendar timeline</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("routines")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === "routines" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Routines & Cron
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-1.5 rounded-lg transition ${
                  activeTab === "calendar" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"
                }`}
              >
                Calendar Schedule
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
          {activeTab === "routines" ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-emerald-400" /> Active Automated Routines
                </h3>
                <button
                  onClick={() => setShowRoutineModal(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ New Routine</span>
                </button>
              </div>

              <div className="grid gap-3">
                {routines.map((routine) => (
                  <div key={routine.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/40 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{routine.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {routine.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {routine.schedule}</span>
                        <span>Assignee: <strong className="text-slate-300">{routine.agent}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-500">Last ran {routine.lastRun}</span>
                      <button className="p-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold transition">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-400" /> Scheduled Company Events
                </h3>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Schedule Event</span>
                </button>
              </div>

              <div className="grid gap-3">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/40 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-sm">{evt.title}</h4>
                        {evt.recurring && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Recurring
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-3">
                        <span className="text-emerald-300 font-semibold">{evt.date}</span>
                        <span>({evt.time})</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                      {evt.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1. Create Routine Modal */}
        {showRoutineModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-emerald-400" /> Create New Routine
                </h3>
                <button onClick={() => setShowRoutineModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRoutine} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Routine Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Standup Briefing"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Schedule / Frequency</label>
                  <select
                    value={routineSchedule}
                    onChange={(e) => setRoutineSchedule(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Every Day at 09:00 AM">Every Day at 09:00 AM</option>
                    <option value="Every 4 Hours">Every 4 Hours</option>
                    <option value="Every Monday at 08:00 AM">Every Monday at 08:00 AM</option>
                    <option value="Hourly Sweep">Hourly Sweep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Assignee (Human / Agent)</label>
                  <select
                    value={routineAssignee}
                    onChange={(e) => setRoutineAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Assignee...</option>
                    {workforce.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.type === "human" ? "👤" : "🤖"} {m.name} ({m.title || m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Action Command / Prompt</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Run daily code review sweep and report issue status to Slack."
                    value={routineAction}
                    onChange={(e) => setRoutineAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowRoutineModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/50">
                    Create Routine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Schedule Event Modal */}
        {showEventModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" /> Schedule Event
                </h3>
                <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q3 Sprint Planning Sync"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Event Category / Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Company">Company All-Hands</option>
                    <option value="Sync">Standup Sync</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Start Time</label>
                    <input
                      type="time"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">End Time</label>
                    <input
                      type="time"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={eventRecurring}
                    onChange={(e) => setEventRecurring(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="recurring" className="text-slate-300 text-xs font-medium cursor-pointer">
                    Recurring Event
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowEventModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/50">
                    Schedule Event
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
