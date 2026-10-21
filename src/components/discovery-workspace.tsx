"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CalendarDays, Check, GitMerge, Mail, MessageSquareText, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, isOverdue } from "@/lib/utils";
import { emails } from "@/data/seed";

export function DiscoveryWorkspace({ initialId, initialFilter = "all" }: { initialId?: string; initialFilter?: "all" | "overdue" | "duplicates" }) {
  const demo = useDemo();
  const [selectedId, setSelectedId] = useState(initialId || demo.tasks.find((task) => task.status === "pending" && !task.staged)?.id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "overdue" | "duplicates">(initialFilter);
  const [editOpen, setEditOpen] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDue, setDraftDue] = useState("");
  const pending = useMemo(() => demo.tasks.filter((task) => task.status === "pending" && !task.staged && task.title.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || filter === "overdue" && (isOverdue(task.due) || task.staleDays) || filter === "duplicates" && task.duplicateOf)), [demo.tasks, query, filter]);
  const selected = pending.find((task) => task.id === selectedId) || pending[0];
  const customer = demo.customers.find((item) => item.id === selected?.customerId);
  const duplicate = demo.tasks.find((task) => task.id === selected?.duplicateOf);
  const openEdit = useCallback(() => { if (!selected) return; setDraftTitle(selected.title); setDraftDue(selected.due || ""); setEditOpen(true); }, [selected]);
  const primarySource = selected?.sources[0];
  const language = primarySource?.type === "email" ? emails.find((email) => email.id === primarySource.id)?.language : demo.meetings.find((meeting) => meeting.id === primarySource?.id)?.language;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!selected || editOpen || dismissOpen || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const key = event.key.toLowerCase();
      if (key === "a") { event.preventDefault(); if (selected.id === "disc-15") demo.rescheduleNordlys(); else demo.approveTask(selected.id); }
      if (key === "e") { event.preventDefault(); openEdit(); }
      if (key === "d") { event.preventDefault(); setDismissOpen(true); }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [selected, editOpen, dismissOpen, demo, openEdit]);

  if (!demo.tasks.some((task) => task.status === "pending" && !task.staged)) return <><PageHeader eyebrow="Human review" title="AI discoveries" description="Every suggestion stays reviewable and traceable to its source."/><div className="surface"><EmptyState icon={<Check/>} title="You’re all caught up" description="Reviewed discoveries have moved to Tasks or were dismissed." action={<Link href="/scan"><Button><Sparkles size={16}/> Scan now</Button></Link>}/></div></>;

  return <>
    <PageHeader eyebrow="Human review" title="AI discoveries" description="Review the evidence, refine the suggestion, then decide what becomes real work." actions={<Link href="/scan"><Button><Sparkles size={16}/> Scan now</Button></Link>}/>
    <div className="filter-bar">
      <div className="filter-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search discoveries…" aria-label="Search discoveries"/></div>
      <button className={`filter-chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All · {demo.tasks.filter((t) => t.status === "pending" && !t.staged).length}</button>
      <button className={`filter-chip ${filter === "overdue" ? "active" : ""}`} onClick={() => setFilter("overdue")}>Needs attention</button>
      <button className={`filter-chip ${filter === "duplicates" ? "active" : ""}`} onClick={() => setFilter("duplicates")}>Duplicates</button>
    </div>
    <div className="review-layout">
          <div className="discovery-list surface">{pending.length ? pending.map((task) => { const itemCustomer = demo.customers.find((item) => item.id === task.customerId); const sourceType = task.sources[0]?.type; return <button key={task.id} className={`discovery-row ${selected?.id === task.id ? "selected" : ""}`} onClick={() => setSelectedId(task.id)}><span className="source-icon">{sourceType === "meeting" ? <MessageSquareText size={15}/> : <Mail size={15}/>}</span><div><h3>{task.title}</h3><p>{task.sources[0]?.excerpt}</p><div className="discovery-meta"><span>{itemCustomer?.company}</span><Badge>{sourceType === "meeting" ? "Meeting" : task.sources.length > 1 ? "Email + meeting" : "Email"}</Badge>{task.confidence && <Badge tone="accent">{task.confidence}% illustrative</Badge>}{task.duplicateOf && <Badge tone="warning"><GitMerge size={11}/> Duplicate</Badge>}{task.staleDays && <Badge tone="danger">{task.staleDays} days outstanding</Badge>}</div></div><span className="row-date">{formatDate(task.due, true)}</span></button>; }) : <EmptyState icon={<Search/>} title="No matches found" description="Try another search or clear the active filter." action={<Button variant="secondary" onClick={() => {setQuery("");setFilter("all");}}>Clear filters</Button>}/>}</div>
      {selected && <aside className="evidence-panel surface">
        <div className="eyebrow">Why this task?</div><h2>{selected.title}</h2>
        {customer && <Link className="customer-link" href={`/customers/${customer.id}`}>{customer.company} <ArrowUpRight size={13}/></Link>}
        <div className="discovery-meta" style={{marginTop:10}}><Badge tone={isOverdue(selected.due) || selected.staleDays ? "danger" : "neutral"}><CalendarDays size={12}/>{selected.staleDays ? `${selected.staleDays} days outstanding · no sourced date` : formatDate(selected.due)}</Badge><Badge>{selected.category}</Badge>{language && <Badge>{language === "Norwegian" ? "NO · Norwegian" : "EN · English"}</Badge>}</div>
        <div className="evidence-box"><blockquote>“{selected.sources[0]?.excerpt}”</blockquote><small>Exact source text · preserved from the original</small></div>
        <div className="section-title"><div><h2 style={{fontSize:14}}>Source evidence</h2><p>{selected.sources.length} linked {selected.sources.length === 1 ? "source" : "sources"}</p></div></div>
        <div className="source-stack">{selected.sources.map((source) => <Link className="source-card" href={`/${source.type === "email" ? "emails" : "meetings"}/${source.id}`} key={`${source.type}-${source.id}`}><span className="source-icon">{source.type === "email" ? <Mail size={14}/> : <CalendarDays size={14}/>}</span><div><strong>{source.label}</strong><span>Open original source <ArrowUpRight size={10}/></span></div></Link>)}</div>
        {selected.confidence && <div className="confidence"><div className="confidence-head"><span>Illustrative confidence</span><strong>{selected.confidence}%</strong></div><div className="confidence-track"><div className="confidence-fill" style={{width:`${selected.confidence}%`}}/></div><small className="muted">Based on request clarity, named owner, and timing language.</small></div>}
        {selected.sources.length > 1 && <div className="ai-callout"><GitMerge size={18}/><div><strong>Evidence merged automatically</strong><p>The same commitment appeared in email and meeting notes. Both sources stay attached to one task.</p></div></div>}
        {selected.duplicateOf && <div className="ai-callout"><GitMerge size={18}/><div><strong>Possible duplicate found</strong><p>“{duplicate?.title}” already exists. Compare and merge without losing this source.</p></div></div>}
        {selected.id === "disc-15" && <div className="ai-callout"><AlertTriangle size={18}/><div><strong>Calendar change unresolved</strong><p>Existing meeting: Thursday 22 Oct at 10:00. Requested: Friday 23 Oct at 10:00.</p></div></div>}
        <div className="panel-actions">{selected.id === "disc-15" ? <Button onClick={demo.rescheduleNordlys}><CalendarDays size={16}/> Reschedule meeting</Button> : <Button onClick={() => demo.approveTask(selected.id)}><Check size={16}/> Approve</Button>}<Button variant="secondary" onClick={openEdit}>Edit</Button>{selected.duplicateOf && <Button variant="secondary" onClick={() => demo.mergeTask(selected.id)}><GitMerge size={16}/> One-click merge</Button>}<Button variant="ghost" aria-label="Dismiss discovery" onClick={() => setDismissOpen(true)}><Trash2 size={16}/></Button></div>
        <div className="shortcut-hints" aria-label="Keyboard shortcuts"><span><kbd>A</kbd> Approve</span><span><kbd>E</kbd> Edit</span><span><kbd>D</kbd> Dismiss</span></div>
      </aside>}
    </div>
    <Modal open={editOpen} onOpenChange={setEditOpen} title="Edit task suggestion" description="Refine the working task. The original source evidence remains unchanged.">
      <div className="form-grid"><div className="field"><label htmlFor="edit-title">Task title</label><input id="edit-title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)}/></div><div className="field"><label htmlFor="edit-due">Due date</label><input id="edit-due" type="date" value={draftDue} onChange={(e) => setDraftDue(e.target.value)}/></div></div>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button><Button disabled={!draftTitle.trim()} onClick={() => { demo.updateTask(selected!.id, { title: draftTitle.trim(), due: draftDue || undefined }); setEditOpen(false); }}>Save changes</Button></div>
    </Modal>
    <Modal open={dismissOpen} onOpenChange={setDismissOpen} title="Dismiss this discovery?" description="It will leave the active review queue. The original source remains available in Emails or Meetings.">
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setDismissOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { demo.dismissTask(selected!.id); setDismissOpen(false); }}>Dismiss discovery</Button></div>
    </Modal>
  </>;
}
