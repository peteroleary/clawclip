import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Repeat, Plus, Clock, Play, Edit2, Trash2 } from "lucide-react";
import type { Workforce3DMember } from "../types.js";
import { ImmersiveScreenWrapper } from "../components/ImmersiveScreenWrapper.js";

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
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showRoutineModal, showEventModal]);

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName.trim()) return;

    if (editingRoutineId) {
      setRoutines(routines.map(r => r.id === editingRoutineId ? {
        ...r,
        name: routineName.trim(),
        schedule: routineSchedule,
        agent: routineAssignee || r.agent,
      } : r));
      setEditingRoutineId(null);
    } else {
      const newR = {
        id: `r_${Date.now()}`,
        name: routineName.trim(),
        schedule: routineSchedule,
        status: "Active",
        lastRun: "Just now",
        agent: routineAssignee || (workforce.length > 0 ? workforce[0].name : "Hermes Manager"),
      };
      setRoutines([newR, ...routines]);
    }

    setRoutineName("");
    setRoutineAction("");
    setShowRoutineModal(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (editingEventId) {
      setEvents(events.map(evt => evt.id === editingEventId ? {
        ...evt,
        title: eventTitle.trim(),
        date: eventDate || evt.date,
        time: `${eventStartTime} - ${eventEndTime}`,
        category: eventType,
        recurring: eventRecurring,
      } : evt));
      setEditingEventId(null);
    } else {
      const newE = {
        id: `e_${Date.now()}`,
        title: eventTitle.trim(),
        date: eventDate || "2026-07-25",
        time: `${eventStartTime} - ${eventEndTime}`,
        category: eventType,
        recurring: eventRecurring,
      };
      setEvents([newE, ...events]);
    }

    setEventTitle("");
    setShowEventModal(false);
  };

  const getTabAction = () => {
    switch (activeTab) {
      case "routines":
        return { label: "New Routine", action: () => { setEditingRoutineId(null); setRoutineName(""); setRoutineSchedule("Every Day at 09:00 AM"); setRoutineAction(""); setShowRoutineModal(true); } };
      case "calendar":
        return { label: "Schedule Event", action: () => { setEditingEventId(null); setEventTitle(""); setEventType("Meeting"); setEventDate(""); setShowEventModal(true); } };
      default:
        return null;
    }
  };

  const tabAction = getTabAction();

  return (
    <ImmersiveScreenWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Scheduling & Automation"
      subtitle="Manage recurring agent routines and company calendar timeline"
      icon={CalendarIcon}
      iconColorClass="text-emerald-400"
      iconBgClass="bg-emerald-500/10 border-emerald-500/30"
      closeOnEsc={!showRoutineModal && !showEventModal}
      showHeader={false}
    >
      {/* Control bar */}
      <div className="px-6 py-3 bg-[#06090d]/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 overflow-x-auto">
        {/* Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold space-x-1 shrink-0">
          <button onClick={() => setActiveTab("routines")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "routines" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}>Routines & Cron</button>
          <button onClick={() => setActiveTab("calendar")} className={`px-4 py-1.5 rounded-lg transition ${activeTab === "calendar" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-white"}`}>Calendar Schedule</button>
        </div>

        {/* Action Button */}
        {tabAction && (
          <div className="relative group shrink-0">
            <button
              onClick={tabAction.action}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              {tabAction.label}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "routines" ? (
          <div className="space-y-3 max-w-4xl mx-auto">
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
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-450" /> {routine.schedule}</span>
                    <span>Assignee: <strong className="text-slate-300">{routine.agent}</strong></span>
                  </p>
                </div>

                <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[11px] text-slate-500 mr-2">Last ran {routine.lastRun}</span>
                  
                  <div className="relative group/tooltip">
                    <button className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition">
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Run Now
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingRoutineId(routine.id);
                        setRoutineName(routine.name);
                        setRoutineSchedule(routine.schedule);
                        setRoutineAssignee(routine.agent);
                        setShowRoutineModal(true);
                      }}
                      className="p-1.5 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setRoutines(routines.filter(item => item.id !== routine.id));
                      }}
                      className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
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
                    <span className="text-emerald-305 font-semibold">{evt.date}</span>
                    <span>({evt.time})</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mr-1">
                    {evt.category}
                  </span>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEditingEventId(evt.id);
                        setEventTitle(evt.title);
                        setEventType(evt.category);
                        setEventDate(evt.date);
                        setEventRecurring(evt.recurring);
                        setShowEventModal(true);
                      }}
                      className="p-1.5 text-slate-450 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Edit
                    </span>
                  </div>

                  <div className="relative group/tooltip">
                    <button
                      onClick={() => {
                        setEvents(events.filter(item => item.id !== evt.id));
                      }}
                      className="p-1.5 text-rose-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 text-slate-200 text-[8px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1. Create Routine Modal */}
      {showRoutineModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-400" /> {editingRoutineId ? "Edit Routine Details" : "Create New Routine"}
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Schedule / Frequency</label>
                <select
                  value={routineSchedule}
                  onChange={(e) => setRoutineSchedule(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowRoutineModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/50">
                  {editingRoutineId ? "Save Changes" : "Create Routine"}
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
                <CalendarIcon className="w-5 h-5 text-emerald-400" /> {editingEventId ? "Edit Event Details" : "Schedule Event"}
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Event Category / Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Start Time</label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">End Time</label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
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
                  {editingEventId ? "Save Changes" : "Schedule Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImmersiveScreenWrapper>
  );
};
