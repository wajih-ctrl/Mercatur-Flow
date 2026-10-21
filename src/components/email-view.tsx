"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Filter, Newspaper, Radar, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { emails } from "@/data/seed";
import { Badge, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, initials } from "@/lib/utils";
import { localizeContent, localizeLabel, localeFor, t, tr } from "@/lib/i18n";

export function EmailView({initialId}:{initialId?:string}) {
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const [filter, setFilter] = useState<"all"|"actionable"|"sent">("all");
  const salesCustomerIds = useMemo(() => new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId)), [demo.tasks]);
  const visible = useMemo(() => emails.filter((email) =>
    (demo.role !== "Sales" || Boolean(email.customerId && salesCustomerIds.has(email.customerId))) &&
    (filter === "all" || filter === "actionable" && email.actionable || filter === "sent" && email.direction === "Sent")
  ), [demo.role, filter, salesCustomerIds]);
  const selected = visible.find((email) => email.id === initialId) || visible[0];
  const customer = demo.customers.find((item) => item.id === selected.customerId && !item.staged);
  const linkedTask = demo.tasks.find((task) => task.sources.some((source) => source.type === "email" && source.id === selected.id));
  const task = linkedTask && !linkedTask.staged ? linkedTask : undefined;
  const parts = selected.body.split(selected.quote);

  return <>
    <PageHeader eyebrow={t(demo.language,"communicationEvidence")} title={t(demo.language,"emails")} description={demo.role === "Sales" ? t(demo.language,"assignedEmails") : t(demo.language,"emailPageDescription")} actions={<Badge><Filter size={12}/>{visible.length} {t(demo.language,"seededMessages")}</Badge>}/>
    <div className="filter-bar">{(["all","actionable","sent"] as const).map((item) => <button key={item} className={`filter-chip ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{t(demo.language,item)}</button>)}</div>
    <section className="split-view surface"><div className="inbox-list">{visible.map((email) => <Link href={`/emails/${email.id}`} key={email.id} className={`inbox-item ${selected.id === email.id ? "active" : ""}`}><div className="inbox-item-head"><strong>{email.sender}</strong><small>{formatDate(email.date,true,localeFor(demo.language))}</small></div><h3>{email.subject}</h3><p>{email.quote}</p><div className="discovery-meta" style={{marginTop:7}}>{email.actionable ? <Badge tone="accent"><Sparkles size={10}/>{c("Signal found","Signal funnet")}</Badge> : <Badge><Newspaper size={10}/>{c("Noise filtered","Støy filtrert")}</Badge>}<Badge>{localizeLabel(demo.language,email.direction)}</Badge></div></Link>)}</div>
      <article className="message-pane"><Link href="/emails" className="text-link"><ArrowLeft size={13}/>{c("Inbox","Innboks")}</Link><div className="discovery-meta" style={{marginTop:18}}><Badge>{selected.language === "Norwegian" ? `NO · ${c("Norwegian","Norsk")}` : `EN · ${c("English","Engelsk")}`}</Badge><Badge>{localizeLabel(demo.language,selected.direction)}</Badge></div><h2>{selected.subject}</h2><div className="message-meta"><span className="avatar">{initials(selected.sender)}</span><div><strong>{selected.sender}</strong><div className="muted">{customer?.company || (selected.actionable ? c("Unmatched sender","Ukjent avsender") : c("External newsletter","Eksternt nyhetsbrev"))} · {formatDate(selected.date,false,localeFor(demo.language))}</div></div></div><div className="message-body">{parts[0]}<mark className="quote-highlight">{selected.quote}</mark>{parts[1]}</div>
        {task?.status === "pending" ? <div className="ai-callout"><Sparkles size={18}/><div><strong>{localizeContent(demo.language,task.title)}</strong><p>{c("AI discovery linked to this exact sentence.","AI-funnet er koblet til akkurat denne setningen.")} <Link className="text-link" href={`/discover/${task.id}`}>{c("Review discovery","Gå gjennom funn")} <ArrowUpRight size={11}/></Link></p></div></div> : task?.status === "approved" || task?.status === "done" ? <div className="ai-callout"><Sparkles size={18}/><div><strong>{localizeContent(demo.language,task.title)}</strong><p>{c(`This source is attached to ${task.status === "done" ? "completed" : "approved"} work.`, `Denne kilden er knyttet til ${task.status === "done" ? "fullført" : "godkjent"} arbeid.`)} <Link className="text-link" href={`/tasks/${task.id}`}>{c("View task","Se oppgave")} <ArrowUpRight size={11}/></Link></p></div></div> : task?.status === "dismissed" ? <div className="ai-callout"><Newspaper size={18}/><div><strong>{c("Discovery dismissed","Funn avvist")}</strong><p>{c("The evidence remains here, while the suggestion has left the active review queue.","Kildegrunnlaget blir liggende her, mens forslaget er fjernet fra den aktive gjennomgangskøen.")}</p></div></div> : linkedTask?.staged ? <div className="ai-callout"><Radar size={18}/><div><strong>{c("Actionable signal ready to scan","Handlingssignal klart for skanning")}</strong><p>{c("This seeded email has not been processed yet.","Denne seedede e-posten er ikke behandlet ennå.")} <Link className="text-link" href="/scan">{c("Run Scan Now","Kjør Skann nå")} <ArrowUpRight size={11}/></Link></p></div></div> : <div className="ai-callout"><Newspaper size={18}/><div><strong>{c("Newsletter filtered — no action needed","Nyhetsbrev filtrert – ingen handling nødvendig")}</strong><p>{c("This message contains no actionable customer commitment, request, or promise.","Denne meldingen inneholder ingen handlingsbar kundeforpliktelse, forespørsel eller noe løfte.")}</p></div></div>}
      </article>
    </section>
  </>;
}
