"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Clock3, CopyCheck, Flame, Plus, Radar, Settings2, Sparkles, UsersRound } from "lucide-react";
import { Badge, Button, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, isOverdue } from "@/lib/utils";

export default function TodayPage() {
  const demo = useDemo();
  const isSales = demo.role === "Sales";
  const isAdmin = demo.role === "Admin";
  const salesCustomerIds = new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId));
  const scopedTasks = isSales ? demo.tasks.filter((task) => task.owner === "Maja Nilsen") : demo.tasks;
  const pending = scopedTasks.filter((task) => task.status === "pending" && !task.staged);
  const overdue = pending.filter((task) => isOverdue(task.due) || task.staleDays);
  const approved = scopedTasks.filter((task) => task.status === "approved");
  const duplicates = pending.filter((task) => task.duplicateOf);
  const unresolvedConflict = demo.tasks.some((task) => task.id === "disc-15" && task.status === "pending" && !task.staged) && demo.events.some((event) => event.id === "event-nordlys" && event.date === "2026-10-22");
  const quiet = demo.customers.filter((customer) => customer.quiet && !customer.staged && (!isSales || salesCustomerIds.has(customer.id)));
  const upcoming = demo.events.filter((event) => event.date >= "2026-10-21" && event.date <= "2026-10-26" && (!isSales || event.owner === "Maja Nilsen" || Boolean(event.customerId && salesCustomerIds.has(event.customerId))));
  const queueItems = isSales ? approved : pending;
  const visibleCustomers = demo.customers.filter((customer) => !customer.staged && (!isSales || salesCustomerIds.has(customer.id)));
  const dueThisWeek = approved.filter((task) => task.due && task.due >= "2026-10-21" && task.due <= "2026-10-26");
  const connectedSources = Object.values(demo.connections).filter(Boolean).length;
  const days = [
    { date: "2026-10-21", label: "Wed 21", today: true }, { date: "2026-10-22", label: "Thu 22" }, { date: "2026-10-23", label: "Fri 23" }, { date: "2026-10-24", label: "Sat 24" }, { date: "2026-10-26", label: "Mon 26" },
  ];
  return <>
    <PageHeader eyebrow="Wednesday, 21 October 2026 · Mercatur" title={`Good morning, ${isSales ? "Maja" : demo.role}`} description={isSales ? "A focused view of the customers and follow-ups assigned to you." : isAdmin ? "Workspace activity and team operations at a glance." : "The system found the work. You decide what moves forward."} actions={isSales ? <><Link href="/tasks?new=1"><Button variant="secondary"><Plus size={16}/>Add task</Button></Link><Link href="/calendar"><Button variant="secondary"><CalendarClock size={16}/>Open calendar</Button></Link><Link href="/customers"><Button><UsersRound size={16}/>My customers</Button></Link></> : isAdmin ? <><Link href="/connections"><Button variant="secondary"><CopyCheck size={16}/>Connections</Button></Link><Link href="/settings"><Button variant="secondary"><Settings2 size={16}/>Settings</Button></Link><Link href="/admin"><Button><UsersRound size={16}/>Administration</Button></Link></> : <><Link href="/scan"><Button variant="secondary"><Radar size={16}/>Scan now</Button></Link><Link href="/tasks?new=1"><Button variant="secondary"><Plus size={16}/>Add task</Button></Link><Link href="/calendar"><Button variant="secondary"><CalendarClock size={16}/>Open calendar</Button></Link><Link href="/customers"><Button><UsersRound size={16}/>View customers</Button></Link></>} />
    <section className="daily-brief" aria-label="Daily briefing"><div className="brief-signal"><span className="brief-orb"><Sparkles size={18}/></span><div><span className="eyebrow">{isSales ? "Personal workload · simulated" : isAdmin ? "Workspace status · mocked" : "AI daily brief · simulated"}</span><strong>{isSales ? `${approved.length} assigned tasks are ready to move` : isAdmin ? `${connectedSources} mock sources connected across the workspace` : `${pending.length} decisions can move customer work forward`}</strong><p>{isSales ? `${dueThisWeek.length} tasks are due this week across ${visibleCustomers.length} assigned customers.` : isAdmin ? `3 active team members · demo ${demo.scanComplete ? "scanned" : "ready"}.` : demo.preferences.attentionSummaries ? `${overdue.length} commitments need attention, while ${quiet.length} relationships are losing momentum.` : "Attention summaries are paused in your workspace preferences."}</p></div></div><Link href={isSales ? "/tasks" : isAdmin ? "/admin" : demo.preferences.attentionSummaries ? "/discover" : "/settings"} className="brief-action">{isSales ? "Open my tasks" : isAdmin ? "Manage workspace" : demo.preferences.attentionSummaries ? "Start review" : "Open settings"} <ArrowRight size={16}/></Link></section>
    {isSales ? <section className="metrics dashboard-metrics" aria-label="Sales workspace metrics">
      <Link href="/tasks" className="metric metric-link surface"><div className="metric-top"><span>Active tasks</span><span className="metric-icon"><CopyCheck size={16}/></span></div><strong>{approved.length}</strong><small>Assigned to Maja Nilsen</small><span className="metric-cta">Open tasks <ArrowRight size={12}/></span></Link>
      <Link href="/tasks" className="metric metric-link surface"><div className="metric-top"><span>Due this week</span><span className="metric-icon"><Flame size={16}/></span></div><strong>{dueThisWeek.length}</strong><small>Follow-ups due by Monday</small><span className="metric-cta">Review workload <ArrowRight size={12}/></span></Link>
      <Link href="/customers" className="metric metric-link surface"><div className="metric-top"><span>My customers</span><span className="metric-icon"><UsersRound size={16}/></span></div><strong>{visibleCustomers.length}</strong><small>Assigned relationships</small><span className="metric-cta">View customers <ArrowRight size={12}/></span></Link>
      <Link href="/calendar" className="metric metric-link surface"><div className="metric-top"><span>Calendar items</span><span className="metric-icon"><CalendarClock size={16}/></span></div><strong>{upcoming.length}</strong><small>Relevant events this week</small><span className="metric-cta">Open calendar <ArrowRight size={12}/></span></Link>
      <Link href="/tasks?view=done" className="metric metric-link surface"><div className="metric-top"><span>Completed</span><span className="metric-icon"><Sparkles size={16}/></span></div><strong>{scopedTasks.filter((task) => task.status === "done").length}</strong><small>Finished assigned work</small><span className="metric-cta">View completed <ArrowRight size={12}/></span></Link>
    </section> : isAdmin ? <section className="metrics dashboard-metrics" aria-label="Administration metrics">
      <Link href="/admin" className="metric metric-link surface"><div className="metric-top"><span>Team members</span><span className="metric-icon"><UsersRound size={16}/></span></div><strong>{demo.users.length}</strong><small>Active mock users</small><span className="metric-cta">Manage team <ArrowRight size={12}/></span></Link>
      <Link href="/connections" className="metric metric-link surface"><div className="metric-top"><span>Connected sources</span><span className="metric-icon"><CopyCheck size={16}/></span></div><strong>{connectedSources}</strong><small>Mock integrations enabled</small><span className="metric-cta">View connections <ArrowRight size={12}/></span></Link>
      <Link href="/settings" className="metric metric-link surface"><div className="metric-top"><span>Review policy</span><span className="metric-icon"><Sparkles size={16}/></span></div><strong>Human</strong><small>Approval always required</small><span className="metric-cta">Review settings <ArrowRight size={12}/></span></Link>
      <Link href="/admin" className="metric metric-link surface"><div className="metric-top"><span>Demo status</span><span className="metric-icon"><CalendarClock size={16}/></span></div><strong>{demo.scanComplete ? "Scanned" : "Ready"}</strong><small>Deterministic workspace</small><span className="metric-cta">Open admin <ArrowRight size={12}/></span></Link>
      <Link href="/connections" className="metric metric-link surface"><div className="metric-top"><span>Data boundary</span><span className="metric-icon"><Settings2 size={16}/></span></div><strong>Local</strong><small>Browser-only persistence</small><span className="metric-cta">Privacy details <ArrowRight size={12}/></span></Link>
    </section> : <section className="metrics dashboard-metrics" aria-label="Workspace metrics">
      <Link href="/discover" className="metric metric-link surface"><div className="metric-top"><span>Pending review</span><span className="metric-icon"><Sparkles size={16}/></span></div><strong>{pending.length}</strong><small>AI findings awaiting a decision</small><span className="metric-cta">Review queue <ArrowRight size={12}/></span></Link>
      <Link href="/discover?filter=duplicates" className="metric metric-link surface"><div className="metric-top"><span>Duplicates</span><span className="metric-icon"><CopyCheck size={16}/></span></div><strong>{duplicates.length}</strong><small>Suggestions ready to compare</small><span className="metric-cta">Compare tasks <ArrowRight size={12}/></span></Link>
      <Link href="/calendar" className="metric metric-link surface"><div className="metric-top"><span>Calendar conflicts</span><span className="metric-icon"><CalendarClock size={16}/></span></div><strong>{unresolvedConflict ? 1 : 0}</strong><small>Unresolved schedule changes</small><span className="metric-cta">Open calendar <ArrowRight size={12}/></span></Link>
      <Link href="/customers?filter=quiet" className="metric metric-link surface"><div className="metric-top"><span>Going quiet</span><span className="metric-icon"><UsersRound size={16}/></span></div><strong>{quiet.length}</strong><small>Relationships losing momentum</small><span className="metric-cta">View relationships <ArrowRight size={12}/></span></Link>
      <Link href="/discover?filter=overdue" className="metric metric-link surface"><div className="metric-top"><span>Overdue</span><span className="metric-icon"><Flame size={16}/></span></div><strong>{overdue.length}</strong><small>Commitments needing attention</small><span className="metric-cta">Resolve now <ArrowRight size={12}/></span></Link>
    </section>}
    {!isAdmin && <section className="dashboard-grid">
      <div className="queue surface">
        <div className="section-title"><div><h2>{demo.role === "Sales" ? "Assigned work" : "Decision queue"}</h2><p>{demo.role === "Sales" ? "Your current customer follow-ups" : "Highest-signal discoveries first"}</p></div><Link className="text-link" href={demo.role === "Sales" ? "/tasks" : "/discover"}>View all <ArrowRight size={14}/></Link></div>
        <div className="queue-list">{queueItems.slice(0, 5).map((task, index) => { const customer = demo.customers.find((item) => item.id === task.customerId); return <Link href={demo.role === "Sales" ? `/tasks/${task.id}` : `/discover/${task.id}`} className="queue-row" key={task.id}><span className="queue-number">{index + 1}</span><div><h3>{task.title}</h3><div className="queue-meta"><span>{customer?.company || "Internal"}</span><Badge tone={isOverdue(task.due) || task.staleDays ? "danger" : "accent"}>{task.staleDays ? `${task.staleDays} days outstanding` : formatDate(task.due, true)}</Badge>{task.duplicateOf && <Badge tone="warning">Possible duplicate</Badge>}</div></div><ArrowRight size={16} className="muted"/></Link>; })}</div>
      </div>
      <aside className={`attention surface ${!demo.preferences.attentionSummaries ? "attention-paused" : ""}`}>
        <div className="section-title"><div><h2>Attention, not administration</h2><p>{demo.role === "Sales" ? "Your assigned relationship signals" : "Signals worth acting on today"}</p></div></div>
        {!demo.preferences.attentionSummaries ? <div className="attention-empty"><Settings2 size={22}/><strong>Summaries are paused</strong><span>Turn them back on whenever you want the highest-signal work surfaced here.</span><Link href="/settings">Manage preferences <ArrowRight size={13}/></Link></div> : demo.role === "Sales" ? <div className="attention-list"><Link href="/customers/oslo" className="attention-item"><strong>Oslo Design Collective</strong><span>Invoice review assigned to you</span></Link><Link href="/customers/telemark" className="attention-item"><strong>Telemark Energi</strong><span>Training follow-up assigned to you</span></Link></div> : <div className="attention-list">
          <Link href="/discover/disc-2" className="attention-item"><strong>Promise to Kari is overdue</strong><span>Outgoing email · due yesterday</span></Link>
          {unresolvedConflict && <Link href="/discover/disc-15" className="attention-item"><strong>Nordlys asked to move a meeting</strong><span>Thursday → Friday at 10:00</span></Link>}
          <Link href="/customers/vestland" className="attention-item"><strong>Vestland Kraft is going quiet</strong><span>No contact for 21 days</span></Link>
        </div>}
      </aside>
      <div className="agenda surface">
        <div className="section-title"><div><h2>Today & this week</h2><p>Today’s calendar, confirmed work, proposals, and open focus time</p></div><Link className="text-link" href="/calendar">Full calendar <ArrowRight size={14}/></Link></div>
        <div className="agenda-strip">{days.map((day) => <div className={`agenda-day ${day.today ? "today" : ""}`} key={day.date}><strong>{day.label}</strong>{upcoming.filter((event) => event.date === day.date).map((event) => <div className="agenda-event" key={event.id}><Clock3 size={11}/> {event.time} · {event.title}</div>)}</div>)}</div>
      </div>
    </section>}
  </>;
}
