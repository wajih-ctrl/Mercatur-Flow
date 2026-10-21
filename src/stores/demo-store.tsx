"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createInitialState } from "@/data/seed";
import type { DemoState, Language, Role, Task, WorkspaceUser } from "@/lib/types";

type NewTask = Pick<Task, "title" | "due" | "time" | "customerId">;
type NewUser = Pick<WorkspaceUser, "name" | "email" | "role" | "scope">;
interface DemoContextValue extends DemoState {
  hydrated: boolean;
  approveTask(id: string): void;
  dismissTask(id: string): void;
  updateTask(id: string, patch: Partial<Task>): void;
  completeTask(id: string): void;
  addTask(task: NewTask): void;
  mergeTask(id: string): void;
  linkRelated(discoveryId: string, existingId: string): void;
  runScan(): void;
  rescheduleNordlys(): void;
  acceptEvent(id: string): void;
  acceptSuggestedSlot(id: string): void;
  cancelEvent(id: string): void;
  convertAction(meetingId: string, actionId: string): void;
  setRole(role: Role): void;
  setLanguage(language: Language): void;
  addUser(user: NewUser): void;
  setConnection(name: string, enabled: boolean): void;
  setPreference(name: keyof DemoState["preferences"], enabled: boolean): void;
  resetDemo(): void;
}

const STORAGE_KEY = "mercatur-flow-demo-v1";
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(createInitialState);
  const [hydrated, setHydrated] = useState(false);

  // The persisted demo state is intentionally restored only in the browser.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = JSON.parse(saved) as DemoState;
        setState({ ...createInitialState(), ...restored, preferences: { ...createInitialState().preferences, ...restored.preferences } });
      }
    } catch { /* use deterministic seed state */ }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => setState((s) => {
    const current = s.tasks.find((task) => task.id === id);
    if (!current) return s;
    const nextTask = { ...current, ...patch };
    const events = s.events.map((event) => event.taskId === id ? { ...event, title: nextTask.title, date: nextTask.due || event.date, time: nextTask.time || event.time } : event);
    return { ...s, tasks: s.tasks.map((task) => task.id === id ? nextTask : task), events };
  }), []);
  const approveTask = useCallback((id: string) => setState((s) => {
    const task = s.tasks.find((item) => item.id === id);
    if (!task) return s;
    const scheduledTime = task.time || "09:00";
    const events = task.due && !s.events.some((event) => event.taskId === id) ? [...s.events, { id: `task-event-${id}`, title: task.title, date: task.due, time: scheduledTime, duration: 30, type: "task" as const, customerId: task.customerId, taskId: id, owner: task.owner }] : s.events;
    return { ...s, tasks: s.tasks.map((item) => item.id === id ? { ...item, time: item.due ? scheduledTime : item.time, status: "approved" as const } : item), events };
  }), []);
  const dismissTask = useCallback((id: string) => updateTask(id, { status: "dismissed" }), [updateTask]);
  const completeTask = useCallback((id: string) => updateTask(id, { status: "done" }), [updateTask]);
  const addTask = useCallback((task: NewTask) => setState((s) => {
    const id = `manual-${Date.now()}`;
    const owner = s.role === "Sales" ? "Maja Nilsen" : "Olav";
    const scheduledTime = task.due ? task.time || "09:00" : undefined;
    const created: Task = { ...task, id, time: scheduledTime, status: "approved", origin: "Manual", category: "Manual", owner, sources: [], createdAt: "2026-10-21" };
    const events = task.due ? [...s.events, { id: `task-event-${id}`, title: task.title, date: task.due, time: scheduledTime!, duration: 30, type: "task" as const, customerId: task.customerId, taskId: id, owner }] : s.events;
    return { ...s, tasks: [...s.tasks, created], events };
  }), []);
  const mergeTask = useCallback((id: string) => setState((s) => {
    const discovery = s.tasks.find((task) => task.id === id);
    if (!discovery?.duplicateOf) return s;
    return { ...s, tasks: s.tasks.map((task) => task.id === discovery.duplicateOf ? { ...task, sources: [...task.sources, ...discovery.sources], category: "Manual + AI evidence" } : task.id === id ? { ...task, status: "dismissed" as const } : task) };
  }), []);
  const linkRelated = useCallback((discoveryId: string, existingId: string) => setState((s) => ({ ...s, tasks: s.tasks.map((task) => task.id === discoveryId ? { ...task, relatedTo: existingId } : task.id === existingId ? { ...task, relatedTo: discoveryId } : task) })), []);
  const runScan = useCallback(() => setState((s) => {
    const meetingTaskId = "meeting-task-meeting-a-a1";
    const meetingTaskExists = s.tasks.some((task) => task.id === meetingTaskId);
    const tasks = s.tasks.map((task) => task.id === meetingTaskId ? { ...task, due: "2026-10-22", category: "Meeting action + deadline" } : task.staged ? { ...task, staged: false } : task);
    if (!meetingTaskExists) tasks.push({ id: meetingTaskId, title: "Send revised pricing by Thursday, October 22", customerId: "fjordtech", due: "2026-10-22", status: "pending", origin: "AI", category: "Meeting action + deadline", owner: "Olav", sources: [{ type: "meeting", id: "meeting-a", label: "Fjordtech: pricing call", excerpt: "Send revised pricing by Thursday, October 22" }], createdAt: "2026-10-20" });
    return {
      ...s,
      scanComplete: true,
      customers: s.customers.map((customer) => customer.id === "svalbard" ? { ...customer, staged: false } : customer),
      tasks,
      meetings: s.meetings.map((meeting) => meeting.id === "meeting-a" ? { ...meeting, actionItems: meeting.actionItems.map((action) => action.id === "a1" ? { ...action, convertedTaskId: meetingTaskId } : action) } : meeting),
    };
  }), []);
  const rescheduleNordlys = useCallback(() => setState((s) => ({ ...s, events: s.events.map((event) => event.id === "event-nordlys" ? { ...event, date: "2026-10-23", time: "10:00" } : event), tasks: s.tasks.map((task) => task.id === "disc-15" ? { ...task, time: "10:00", status: "approved" as const } : task) })), []);
  const acceptEvent = useCallback((id: string) => setState((s) => ({ ...s, events: s.events.map((event) => event.id === id ? { ...event, type: "confirmed" as const } : event) })), []);
  const acceptSuggestedSlot = useCallback((id: string) => setState((s) => ({ ...s, events: s.events.map((event) => event.id === id ? { ...event, type: "task" as const } : event) })), []);
  const cancelEvent = useCallback((id: string) => setState((s) => ({ ...s, events: s.events.filter((event) => event.id !== id) })), []);
  const convertAction = useCallback((meetingId: string, actionId: string) => setState((s) => {
    const meeting = s.meetings.find((item) => item.id === meetingId);
    const action = meeting?.actionItems.find((item) => item.id === actionId);
    if (!meeting || !action || action.convertedTaskId) return s;
    const taskId = `meeting-task-${meetingId}-${actionId}`;
    const tasks = s.tasks.map((task) => action.relatedTaskId && task.id === action.relatedTaskId ? { ...task, relatedTo: taskId } : task);
    return { ...s,
      tasks: [...tasks, { id: taskId, title: action.text, customerId: meeting.customerId, status: "pending", origin: "AI", category: "Meeting action", owner: action.owner, sources: [{ type: "meeting", id: meeting.id, label: meeting.title, excerpt: action.text }], createdAt: meeting.date, relatedTo: action.relatedTaskId }],
      meetings: s.meetings.map((item) => item.id === meetingId ? { ...item, actionItems: item.actionItems.map((entry) => entry.id === actionId ? { ...entry, convertedTaskId: taskId } : entry) } : item),
    };
  }), []);
  const setRole = useCallback((role: Role) => setState((s) => ({ ...s, role })), []);
  const setLanguage = useCallback((language: Language) => setState((s) => ({ ...s, language })), []);
  const addUser = useCallback((user: NewUser) => setState((s) => ({ ...s, users: [...s.users, { ...user, id: `user-${Date.now()}`, status: "Active" }] })), []);
  const setConnection = useCallback((name: string, enabled: boolean) => setState((s) => ({ ...s, connections: { ...s.connections, [name]: enabled } })), []);
  const setPreference = useCallback((name: keyof DemoState["preferences"], enabled: boolean) => setState((s) => ({ ...s, preferences: { ...s.preferences, [name]: enabled } })), []);
  const resetDemo = useCallback(() => { localStorage.removeItem(STORAGE_KEY); setState(createInitialState()); }, []);

  const value = useMemo(() => ({ ...state, hydrated, approveTask, dismissTask, updateTask, completeTask, addTask, mergeTask, linkRelated, runScan, rescheduleNordlys, acceptEvent, acceptSuggestedSlot, cancelEvent, convertAction, setRole, setLanguage, addUser, setConnection, setPreference, resetDemo }), [state, hydrated, approveTask, dismissTask, updateTask, completeTask, addTask, mergeTask, linkRelated, runScan, rescheduleNordlys, acceptEvent, acceptSuggestedSlot, cancelEvent, convertAction, setRole, setLanguage, addUser, setConnection, setPreference, resetDemo]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider");
  return context;
}
