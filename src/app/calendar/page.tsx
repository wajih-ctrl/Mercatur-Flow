"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, ExternalLink, Sparkles, Trash2 } from "lucide-react";
import { Badge, Button, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import type { CalendarEvent } from "@/lib/types";
import { localizeContent, localizeLabel, localeFor, t } from "@/lib/i18n";

const baseTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const baseWeek = new Date(2026, 9, 19);

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function weekLabel(days: Date[], locale: string) {
  const first = days[0];
  const last = days[days.length - 1];
  if (first.getMonth() === last.getMonth()) return `${first.getDate()}–${last.getDate()} ${last.toLocaleDateString(locale, { month: "long", year: "numeric" })}`;
  return `${first.toLocaleDateString(locale, { day: "numeric", month: "short" })}–${last.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}`;
}

export default function CalendarPage() {
  const demo = useDemo();
  const [mode, setMode] = useState<"week" | "month">("week");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<CalendarEvent>();
  const [cancelOpen, setCancelOpen] = useState(false);
  const salesCustomerIds = useMemo(() => new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId)), [demo.tasks]);
  const visibleEvents = useMemo(() => demo.events.filter((event) =>
    (demo.role !== "Sales" || event.owner === "Maja Nilsen" || Boolean(event.customerId && salesCustomerIds.has(event.customerId))) &&
    (demo.preferences.taskCalendarEntries || event.type !== "task")
  ), [demo.events, demo.role, demo.preferences.taskCalendarEntries, salesCustomerIds]);
  const weekDays = useMemo(() => Array.from({ length: 5 }, (_, index) => addDays(baseWeek, offset * 7 + index)), [offset]);
  const monthDate = useMemo(() => new Date(2026, 9 + offset, 1), [offset]);
  const nordlys = demo.events.find((event) => event.id === "event-nordlys");
  const unresolved = demo.role !== "Sales" && demo.tasks.some((task) => task.id === "disc-15" && task.status === "pending" && !task.staged) && nordlys?.date === "2026-10-22";
  const locale = localeFor(demo.language);
  const label = mode === "week" ? weekLabel(weekDays, locale) : monthDate.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const displayTimes = useMemo(() => Array.from(new Set([...baseTimes, ...visibleEvents.filter((event) => weekDays.some((day) => dateKey(day) === event.date)).map((event) => event.time)])).sort(), [visibleEvents, weekDays]);
  const selectedCustomer = demo.customers.find((customer) => customer.id === selected?.customerId);
  const selectedTask = demo.tasks.find((task) => task.id === selected?.taskId);

  return <>
    <PageHeader eyebrow={t(demo.language,"planning")} title={demo.role === "Sales" ? t(demo.language,"myCalendar") : t(demo.language,"calendar")} description={t(demo.language,"calendarDescription")} actions={<Badge tone="accent"><Check size={11}/>{t(demo.language,"connectedMocked")}</Badge>} />
    {unresolved && <div className="ai-callout calendar-alert"><AlertTriangle size={18}/><div><strong>{t(demo.language,"scheduleChange")}</strong><p>{t(demo.language,"scheduleChangeDescription")}</p></div><Button onClick={demo.rescheduleNordlys}>{t(demo.language,"reschedule")}</Button></div>}
    <section className="calendar-shell surface">
      <div className="calendar-head">
        <div className="page-actions"><Button variant="secondary" aria-label={t(demo.language,"previousPeriod")} onClick={() => setOffset((value) => value - 1)}><ChevronLeft size={16}/></Button><Button variant="secondary" disabled={offset === 0} onClick={() => setOffset(0)}>{t(demo.language,"today")}</Button><Button variant="secondary" aria-label={t(demo.language,"nextPeriod")} onClick={() => setOffset((value) => value + 1)}><ChevronRight size={16}/></Button><strong className="calendar-label">{label}</strong></div>
        <div className="segmented"><button aria-pressed={mode === "week"} className={mode === "week" ? "active" : ""} onClick={() => setMode("week")}>{t(demo.language,"week")}</button><button aria-pressed={mode === "month"} className={mode === "month" ? "active" : ""} onClick={() => setMode("month")}>{t(demo.language,"month")}</button></div>
      </div>
      <div className="calendar-legend" aria-label={demo.language === "no" ? "Kalenderforklaring" : "Calendar legend"}><span><i className="legend-dot confirmed"/>{t(demo.language,"confirmed")}</span><span><i className="legend-dot task"/>{t(demo.language,"approvedTask")}</span><span><i className="legend-dot proposed"/>{t(demo.language,"proposed")}</span><span><i className="legend-dot suggested"/>{t(demo.language,"suggestedFocus")}</span><span><i className="legend-dot free"/>{t(demo.language,"requestedFree")}</span></div>
      <div className="data-table-wrap">{mode === "week" ? <div className="week-grid"><div className="week-header"/>{weekDays.map((day) => { const key = dateKey(day); return <div className={`week-header ${key === "2026-10-21" ? "today" : ""}`} key={key}><strong>{day.toLocaleDateString(locale, { weekday: "short" })} {day.getDate()}</strong>{key === "2026-10-21" && <span>{t(demo.language,"today")}</span>}</div>; })}{displayTimes.flatMap((time) => [<div className="time-label" key={`time-${time}`}>{time}</div>, ...weekDays.map((day) => { const key = dateKey(day); const eventsAtTime = visibleEvents.filter((event) => event.date === key && event.time === time); const requestedFreeSlot = key === "2026-10-23" && time === "10:00" && !eventsAtTime.some((event) => event.id === "event-nordlys"); return <div className="calendar-cell" key={`${key}-${time}`}>{eventsAtTime.map((event) => <button key={event.id} className={`cal-event ${event.type}`} onClick={() => setSelected(event)}>{event.time} · {localizeContent(demo.language,event.title)}</button>)}{requestedFreeSlot && demo.role !== "Sales" && <div className="cal-free"><Clock3 size={11}/>10:00 · {t(demo.language,"freeNordlys")}</div>}</div>; })])}</div> : <MonthView month={monthDate} events={visibleEvents} onSelect={setSelected} locale={locale} todayLabel={t(demo.language,"today")} freeLabel={t(demo.language,"freeNordlys")} showNordlysSlot={demo.role !== "Sales"} language={demo.language} />}</div>
    </section>
    <Modal open={!!selected && !cancelOpen} onOpenChange={(open) => !open && setSelected(undefined)} title={selected ? localizeContent(demo.language,selected.title) : t(demo.language,"calendarItem")} description={`${selected?.date} · ${selected?.time} · ${selected?.duration} ${t(demo.language,"minutes")}`}>
      <div className="discovery-meta"><Badge tone={selected?.type === "proposed" ? "purple" : selected?.type === "suggested" ? "warning" : "accent"}>{localizeLabel(demo.language,selected?.type)}</Badge>{selected?.type === "proposed" && <Badge>{t(demo.language,"notConfirmed")}</Badge>}</div>
      <div className="event-detail-grid"><div><span>{t(demo.language,"eventType")}</span><strong>{localizeLabel(demo.language,selected?.type)}</strong></div><div><span>{t(demo.language,"duration")}</span><strong>{selected?.duration} {t(demo.language,"minutes")}</strong></div>{selectedCustomer&&<div><span>{t(demo.language,"linkedCustomer")}</span><strong>{selectedCustomer.company}</strong></div>}{selectedTask&&<div><span>{t(demo.language,"linkedTask")}</span><strong>{localizeLabel(demo.language,selectedTask.status)} · {selectedTask.owner}</strong></div>}</div>
      {selected?.type === "suggested" && <div className="ai-callout" style={{ marginTop: 16 }}><Sparkles size={18}/><div><strong>{t(demo.language,"suggestedTimeTitle")}</strong><p>{t(demo.language,"suggestedTimeDescription")}</p></div></div>}
      <div className="dialog-actions split-actions"><Button variant="danger" onClick={() => setCancelOpen(true)}><Trash2 size={15}/>{t(demo.language,"cancelEvent")}</Button><span/>{selectedTask&&<Link href={selectedTask.status === "pending" ? `/discover/${selectedTask.id}` : `/tasks/${selectedTask.id}`}><Button variant="secondary"><ExternalLink size={15}/>{t(demo.language,"openTask")}</Button></Link>}<Button variant="secondary" onClick={() => setSelected(undefined)}>{t(demo.language,"close")}</Button>{selected?.type === "proposed" && <Button onClick={() => { demo.acceptEvent(selected.id); setSelected(undefined); }}><Check size={15}/>{t(demo.language,"acceptProposal")}</Button>}{selected?.type === "suggested" && <Button onClick={() => { demo.acceptSuggestedSlot(selected.id); setSelected(undefined); }}><Clock3 size={15}/>{t(demo.language,"bookTime")}</Button>}</div>
    </Modal>
    <Modal open={cancelOpen} onOpenChange={setCancelOpen} title={t(demo.language,"cancelEventTitle")} description={t(demo.language,"cancelEventDescription")}><div className="ai-callout"><CalendarDays size={18}/><div><strong>{localizeContent(demo.language,selected?.title)}</strong><p>{selected?.date} · {selected?.time}</p></div></div><div className="dialog-actions"><Button variant="secondary" onClick={()=>setCancelOpen(false)}>{t(demo.language,"keepEvent")}</Button><Button variant="danger" onClick={()=>{if(selected)demo.cancelEvent(selected.id);setCancelOpen(false);setSelected(undefined)}}><Trash2 size={15}/>{t(demo.language,"confirmCancel")}</Button></div></Modal>
  </>;
}

function MonthView({ month, events, onSelect, locale, todayLabel, freeLabel, showNordlysSlot, language }: { month: Date; events: CalendarEvent[]; onSelect(event: CalendarEvent): void; locale:string; todayLabel:string; freeLabel:string; showNordlysSlot:boolean; language:"en"|"no" }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((leading + dayCount) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => index >= leading && index < leading + dayCount ? index - leading + 1 : null);

  const weekdays=Array.from({length:7},(_,index)=>new Date(2026,9,19+index).toLocaleDateString(locale,{weekday:"short"}));
  return <div className="month-grid">{weekdays.map((day) => <div className="week-header" key={day}>{day}</div>)}{cells.map((num, index) => { const key = num ? dateKey(new Date(year, monthIndex, num)) : ""; const dayEvents = events.filter((event) => event.date === key); const requestedFreeSlot = showNordlysSlot && key === "2026-10-23" && !dayEvents.some((event) => event.id === "event-nordlys"); return <div className={`month-day ${key === "2026-10-21" ? "today" : ""}`} key={index}>{num && <><span title={key === "2026-10-21" ? todayLabel : undefined}>{num}</span>{dayEvents.map((event) => <button className={`month-event ${event.type}`} onClick={() => onSelect(event)} key={event.id}>{event.time} {localizeContent(language,event.title)}</button>)}{requestedFreeSlot && <div className="month-free">10:00 · {freeLabel}</div>}</>}</div>; })}</div>;
}
