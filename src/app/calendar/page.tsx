"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { Badge, Button, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import type { CalendarEvent } from "@/lib/types";

const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const baseWeek = new Date(2026, 9, 19);

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weekLabel(days: Date[]) {
  const first = days[0];
  const last = days[days.length - 1];
  if (first.getMonth() === last.getMonth()) return `${first.getDate()}–${last.getDate()} ${last.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  return `${first.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}–${last.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

export default function CalendarPage() {
  const demo = useDemo();
  const [mode, setMode] = useState<"week" | "month">("week");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<CalendarEvent>();
  const salesCustomerIds = useMemo(() => new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId)), [demo.tasks]);
  const visibleEvents = useMemo(() => demo.events.filter((event) =>
    (demo.role !== "Sales" || !event.customerId || salesCustomerIds.has(event.customerId)) &&
    (demo.preferences.taskCalendarEntries || event.type !== "task")
  ), [demo.events, demo.role, demo.preferences.taskCalendarEntries, salesCustomerIds]);
  const weekDays = useMemo(() => Array.from({ length: 5 }, (_, index) => addDays(baseWeek, offset * 7 + index)), [offset]);
  const monthDate = useMemo(() => new Date(2026, 9 + offset, 1), [offset]);
  const nordlys = demo.events.find((event) => event.id === "event-nordlys");
  const unresolved = demo.role !== "Sales" && demo.tasks.some((task) => task.id === "disc-15" && task.status === "pending" && !task.staged) && nordlys?.date === "2026-10-22";
  const label = mode === "week" ? weekLabel(weekDays) : monthDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return <>
    <PageHeader eyebrow="Planning" title={demo.role === "Sales" ? "My calendar" : "Calendar"} description="Confirmed meetings, approved tasks, and AI-proposed time—with status always visible." actions={<Badge tone="accent"><Check size={11}/>Connected: Google Calendar / Outlook · mocked</Badge>} />
    {unresolved && <div className="ai-callout calendar-alert"><AlertTriangle size={18}/><div><strong>Nordlys requested a schedule change</strong><p>Move Thursday 22 October at 10:00 to Friday 23 October at 10:00.</p></div><Button onClick={demo.rescheduleNordlys}>Reschedule</Button></div>}
    <section className="calendar-shell surface">
      <div className="calendar-head">
        <div className="page-actions"><Button variant="secondary" aria-label="Previous period" onClick={() => setOffset((value) => value - 1)}><ChevronLeft size={16}/></Button><Button variant="secondary" disabled={offset === 0} onClick={() => setOffset(0)}>Today</Button><Button variant="secondary" aria-label="Next period" onClick={() => setOffset((value) => value + 1)}><ChevronRight size={16}/></Button><strong className="calendar-label">{label}</strong></div>
        <div className="segmented"><button aria-pressed={mode === "week"} className={mode === "week" ? "active" : ""} onClick={() => setMode("week")}>Week</button><button aria-pressed={mode === "month"} className={mode === "month" ? "active" : ""} onClick={() => setMode("month")}>Month</button></div>
      </div>
      <div className="calendar-legend" aria-label="Calendar legend"><span><i className="legend-dot confirmed"/>Confirmed</span><span><i className="legend-dot task"/>Approved task</span><span><i className="legend-dot proposed"/>Proposed</span><span><i className="legend-dot suggested"/>Suggested focus</span><span><i className="legend-dot free"/>Requested free slot</span></div>
      <div className="data-table-wrap">{mode === "week" ? <div className="week-grid"><div className="week-header"/>{weekDays.map((day) => { const key = dateKey(day); return <div className={`week-header ${key === "2026-10-21" ? "today" : ""}`} key={key}><strong>{day.toLocaleDateString("en-GB", { weekday: "short" })} {day.getDate()}</strong>{key === "2026-10-21" && <span>Today</span>}</div>; })}{times.flatMap((time) => [<div className="time-label" key={`time-${time}`}>{time}</div>, ...weekDays.map((day) => { const key = dateKey(day); const eventsAtTime = visibleEvents.filter((event) => event.date === key && event.time === time); const requestedFreeSlot = key === "2026-10-23" && time === "10:00" && !eventsAtTime.some((event) => event.id === "event-nordlys"); return <div className="calendar-cell" key={`${key}-${time}`}>{eventsAtTime.map((event) => <button key={event.id} className={`cal-event ${event.type}`} onClick={() => setSelected(event)}>{event.time} · {event.title}</button>)}{requestedFreeSlot && <div className="cal-free"><Clock3 size={11}/>10:00 · Free for Nordlys move</div>}</div>; })])}</div> : <MonthView month={monthDate} events={visibleEvents} onSelect={setSelected} />}</div>
    </section>
    <Modal open={!!selected} onOpenChange={(open) => !open && setSelected(undefined)} title={selected?.title || "Calendar item"} description={`${selected?.date} at ${selected?.time} · ${selected?.duration} minutes`}>
      <div className="discovery-meta"><Badge tone={selected?.type === "proposed" ? "purple" : selected?.type === "suggested" ? "warning" : "accent"}>{selected?.type}</Badge>{selected?.type === "proposed" && <Badge>Not yet confirmed</Badge>}</div>
      {selected?.type === "suggested" && <div className="ai-callout" style={{ marginTop: 16 }}><Sparkles size={18}/><div><strong>Suggested focus time</strong><p>This 90-minute block is still free until you accept it.</p></div></div>}
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setSelected(undefined)}>Close</Button>{selected?.type === "proposed" && <Button onClick={() => { demo.acceptEvent(selected.id); setSelected(undefined); }}><Check size={15}/>Accept proposal</Button>}{selected?.type === "suggested" && <Button onClick={() => { demo.acceptSuggestedSlot(selected.id); setSelected(undefined); }}><Clock3 size={15}/>Book this time</Button>}</div>
    </Modal>
  </>;
}

function MonthView({ month, events, onSelect }: { month: Date; events: CalendarEvent[]; onSelect(event: CalendarEvent): void }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((leading + dayCount) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => index >= leading && index < leading + dayCount ? index - leading + 1 : null);

  return <div className="month-grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div className="week-header" key={day}>{day}</div>)}{cells.map((num, index) => { const key = num ? dateKey(new Date(year, monthIndex, num)) : ""; const dayEvents = events.filter((event) => event.date === key); const requestedFreeSlot = key === "2026-10-23" && !dayEvents.some((event) => event.id === "event-nordlys"); return <div className={`month-day ${key === "2026-10-21" ? "today" : ""}`} key={index}>{num && <><span>{num}</span>{dayEvents.map((event) => <button className={`month-event ${event.type}`} onClick={() => onSelect(event)} key={event.id}>{event.time} {event.title}</button>)}{requestedFreeSlot && <div className="month-free">10:00 Free · Nordlys</div>}</>}</div>; })}</div>;
}
