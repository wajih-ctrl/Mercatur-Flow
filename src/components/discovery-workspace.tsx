"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CalendarDays, Check, GitMerge, Mail, MessageSquareText, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, isOverdue } from "@/lib/utils";
import { emails } from "@/data/seed";
import { localizeContent, localizeLabel, localeFor, tr } from "@/lib/i18n";

export function DiscoveryWorkspace({ initialId, initialFilter = "all" }: { initialId?: string; initialFilter?: "all" | "overdue" | "duplicates" }) {
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const [selectedId, setSelectedId] = useState(initialId || demo.tasks.find((task) => task.status === "pending" && !task.staged)?.id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "overdue" | "duplicates">(initialFilter);
  const [editOpen, setEditOpen] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDue, setDraftDue] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");
  const pending = useMemo(() => demo.tasks.filter((task) => task.status === "pending" && !task.staged && task.title.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || filter === "overdue" && (isOverdue(task.due) || task.staleDays) || filter === "duplicates" && task.duplicateOf)), [demo.tasks, query, filter]);
  const selected = pending.find((task) => task.id === selectedId) || pending[0];
  const customer = demo.customers.find((item) => item.id === selected?.customerId);
  const duplicate = demo.tasks.find((task) => task.id === selected?.duplicateOf);
  const openEdit = useCallback(() => { if (!selected) return; setDraftTitle(selected.title); setDraftDue(selected.due || ""); setDraftTime(selected.time || "09:00"); setEditOpen(true); }, [selected]);
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

  if (!demo.tasks.some((task) => task.status === "pending" && !task.staged)) return <><PageHeader eyebrow={c("Human review","Menneskelig gjennomgang")} title={c("AI discoveries","AI-funn")} description={c("Every suggestion stays reviewable and traceable to its source.","Alle forslag kan gjennomgås og spores tilbake til kilden.")}/><div className="surface"><EmptyState icon={<Check/>} title={c("You’re all caught up","Du er ajour")} description={c("Reviewed discoveries have moved to Tasks or were dismissed.","Gjennomgåtte funn er flyttet til Oppgaver eller avvist.")} action={<Link href="/scan"><Button><Sparkles size={16}/> {c("Scan now","Skann nå")}</Button></Link>}/></div></>;

  return <>
    <PageHeader eyebrow={c("Human review","Menneskelig gjennomgang")} title={c("AI discoveries","AI-funn")} description={c("Review the evidence, refine the suggestion, then decide what becomes real work.","Gå gjennom kildegrunnlaget, forbedre forslaget og avgjør hva som blir reelt arbeid.")} actions={<Link href="/scan"><Button><Sparkles size={16}/> {c("Scan now","Skann nå")}</Button></Link>}/>
    <div className="filter-bar">
      <div className="filter-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c("Search discoveries…","Søk i funn…")} aria-label={c("Search discoveries","Søk i funn")}/></div>
      <button className={`filter-chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>{c("All","Alle")} · {demo.tasks.filter((t) => t.status === "pending" && !t.staged).length}</button>
      <button className={`filter-chip ${filter === "overdue" ? "active" : ""}`} onClick={() => setFilter("overdue")}>{c("Needs attention","Trenger oppmerksomhet")}</button>
      <button className={`filter-chip ${filter === "duplicates" ? "active" : ""}`} onClick={() => setFilter("duplicates")}>{c("Duplicates","Duplikater")}</button>
    </div>
    <div className="review-layout">
          <div className="discovery-list surface">{pending.length ? pending.map((task) => { const itemCustomer = demo.customers.find((item) => item.id === task.customerId); const sourceType = task.sources[0]?.type; return <button key={task.id} className={`discovery-row ${selected?.id === task.id ? "selected" : ""}`} onClick={() => setSelectedId(task.id)}><span className="source-icon">{sourceType === "meeting" ? <MessageSquareText size={15}/> : <Mail size={15}/>}</span><div><h3>{localizeContent(demo.language,task.title)}</h3><p>{task.sources[0]?.excerpt}</p><div className="discovery-meta"><span>{itemCustomer?.company}</span><Badge>{sourceType === "meeting" ? c("Meeting","Møte") : task.sources.length > 1 ? c("Email + meeting","E-post + møte") : c("Email","E-post")}</Badge>{task.confidence && <Badge tone="accent">{task.confidence}% {c("illustrative","illustrativ")}</Badge>}{task.duplicateOf && <Badge tone="warning"><GitMerge size={11}/> {c("Duplicate","Duplikat")}</Badge>}{task.staleDays && <Badge tone="danger">{c(`${task.staleDays} days outstanding`,`${task.staleDays} dager utestående`)}</Badge>}</div></div><span className="row-date">{formatDate(task.due, true, localeFor(demo.language))}</span></button>; }) : <EmptyState icon={<Search/>} title={c("No matches found","Ingen treff")} description={c("Try another search or clear the active filter.","Prøv et annet søk eller nullstill det aktive filteret.")} action={<Button variant="secondary" onClick={() => {setQuery("");setFilter("all");}}>{c("Clear filters","Nullstill filtre")}</Button>}/>}</div>
      {selected && <aside className="evidence-panel surface">
        <div className="eyebrow">{c("Why this task?","Hvorfor denne oppgaven?")}</div><h2>{localizeContent(demo.language,selected.title)}</h2>
        {customer && <Link className="customer-link" href={`/customers/${customer.id}`}>{customer.company} <ArrowUpRight size={13}/></Link>}
        <div className="discovery-meta" style={{marginTop:10}}><Badge tone={isOverdue(selected.due) || selected.staleDays ? "danger" : "neutral"}><CalendarDays size={12}/>{selected.staleDays ? c(`${selected.staleDays} days outstanding · no sourced date`,`${selected.staleDays} dager utestående · ingen dato i kilden`) : `${formatDate(selected.due,false,localeFor(demo.language))}${selected.due ? ` · ${selected.time || "09:00"}` : ""}`}</Badge><Badge>{localizeLabel(demo.language,selected.category)}</Badge>{language && <Badge>{language === "Norwegian" ? `NO · ${c("Norwegian","Norsk")}` : `EN · ${c("English","Engelsk")}`}</Badge>}</div>
        <div className="evidence-box"><blockquote>“{selected.sources[0]?.excerpt}”</blockquote><small>{c("Exact source text · preserved from the original","Nøyaktig kildetekst · bevart fra originalen")}</small></div>
        <div className="section-title"><div><h2 style={{fontSize:14}}>{c("Source evidence","Kildegrunnlag")}</h2><p>{selected.sources.length} {c("linked","tilknyttede")} {selected.sources.length === 1 ? c("source","kilde") : c("sources","kilder")}</p></div></div>
        <div className="source-stack">{selected.sources.map((source) => <Link className="source-card" href={`/${source.type === "email" ? "emails" : "meetings"}/${source.id}`} key={`${source.type}-${source.id}`}><span className="source-icon">{source.type === "email" ? <Mail size={14}/> : <CalendarDays size={14}/>}</span><div><strong>{localizeContent(demo.language,source.label)}</strong><span>{c("Open original source","Åpne originalkilden")} <ArrowUpRight size={10}/></span></div></Link>)}</div>
        {selected.confidence && <div className="confidence"><div className="confidence-head"><span>{c("Illustrative confidence","Illustrativ konfidens")}</span><strong>{selected.confidence}%</strong></div><div className="confidence-track"><div className="confidence-fill" style={{width:`${selected.confidence}%`}}/></div><small className="muted">{c("Based on request clarity, named owner, and timing language.","Basert på tydeligheten i forespørselen, navngitt ansvarlig og tidsuttrykk.")}</small></div>}
        {selected.sources.length > 1 && <div className="ai-callout"><GitMerge size={18}/><div><strong>{c("Evidence merged automatically","Kildegrunnlag slått sammen automatisk")}</strong><p>{c("The same commitment appeared in email and meeting notes. Both sources stay attached to one task.","Den samme forpliktelsen ble funnet i både e-post og møtenotater. Begge kildene forblir knyttet til én oppgave.")}</p></div></div>}
        {selected.duplicateOf && <div className="ai-callout"><GitMerge size={18}/><div><strong>{c("Possible duplicate found","Mulig duplikat funnet")}</strong><p>“{localizeContent(demo.language,duplicate?.title)}” {c("already exists. Compare and merge without losing this source.","finnes allerede. Sammenlign og slå sammen uten å miste denne kilden.")}</p></div></div>}
        {selected.id === "disc-15" && <div className="ai-callout"><AlertTriangle size={18}/><div><strong>{c("Calendar change unresolved","Kalenderendring ikke avklart")}</strong><p>{c("Existing meeting: Thursday 22 Oct at 10:00. Requested: Friday 23 Oct at 10:00.","Eksisterende møte: torsdag 22. okt. kl. 10:00. Forespurt: fredag 23. okt. kl. 10:00.")}</p></div></div>}
        <div className="panel-actions">{selected.id === "disc-15" ? <Button onClick={demo.rescheduleNordlys}><CalendarDays size={16}/> {c("Reschedule meeting","Flytt møte")}</Button> : <Button onClick={() => demo.approveTask(selected.id)}><Check size={16}/> {c("Approve","Godkjenn")}</Button>}<Button variant="secondary" onClick={openEdit}>{c("Edit","Rediger")}</Button>{selected.duplicateOf && <Button variant="secondary" onClick={() => demo.mergeTask(selected.id)}><GitMerge size={16}/> {c("One-click merge","Slå sammen med ett klikk")}</Button>}<Button variant="ghost" aria-label={c("Dismiss discovery","Avvis funn")} onClick={() => setDismissOpen(true)}><Trash2 size={16}/></Button></div>
        <div className="shortcut-hints" aria-label={c("Keyboard shortcuts","Tastatursnarveier")}><span><kbd>A</kbd> {c("Approve","Godkjenn")}</span><span><kbd>E</kbd> {c("Edit","Rediger")}</span><span><kbd>D</kbd> {c("Dismiss","Avvis")}</span></div>
      </aside>}
    </div>
    <Modal open={editOpen} onOpenChange={setEditOpen} title={c("Edit task suggestion","Rediger oppgaveforslag")} description={c("Refine the working task. The original source evidence remains unchanged.","Forbedre arbeidsoppgaven. Det opprinnelige kildegrunnlaget forblir uendret.")}>
      <div className="form-grid"><div className="field"><label htmlFor="edit-title">{c("Task title","Oppgavetittel")}</label><input id="edit-title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)}/></div><div className="form-row"><div className="field"><label htmlFor="edit-due">{c("Due date","Forfallsdato")}</label><input id="edit-due" type="date" value={draftDue} onChange={(e) => setDraftDue(e.target.value)}/></div><div className="field"><label htmlFor="edit-time">{c("Scheduled time","Planlagt tidspunkt")}</label><input id="edit-time" type="time" value={draftTime} onChange={(e) => setDraftTime(e.target.value)} disabled={!draftDue}/></div></div></div>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setEditOpen(false)}>{c("Cancel","Avbryt")}</Button><Button disabled={!draftTitle.trim()} onClick={() => { demo.updateTask(selected!.id, { title: draftTitle.trim(), due: draftDue || undefined, time: draftDue ? draftTime : undefined }); setEditOpen(false); }}>{c("Save changes","Lagre endringer")}</Button></div>
    </Modal>
    <Modal open={dismissOpen} onOpenChange={setDismissOpen} title={c("Dismiss this discovery?","Avvise dette funnet?")} description={c("It will leave the active review queue. The original source remains available in Emails or Meetings.","Det fjernes fra den aktive gjennomgangskøen. Originalkilden er fortsatt tilgjengelig under E-poster eller Møter.")}>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setDismissOpen(false)}>{c("Cancel","Avbryt")}</Button><Button variant="danger" onClick={() => { demo.dismissTask(selected!.id); setDismissOpen(false); }}>{c("Dismiss discovery","Avvis funn")}</Button></div>
    </Modal>
  </>;
}
