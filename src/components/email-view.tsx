"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Filter, Newspaper, Radar, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { emails } from "@/data/seed";
import { Badge, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, initials } from "@/lib/utils";

export function EmailView({initialId}:{initialId?:string}) {
  const demo = useDemo();
  const [filter, setFilter] = useState<"all"|"actionable"|"sent">("all");
  const visible = useMemo(() => emails.filter((email) => filter === "all" || filter === "actionable" && email.actionable || filter === "sent" && email.direction === "Sent"), [filter]);
  const selected = visible.find((email) => email.id === initialId) || visible[0];
  const customer = demo.customers.find((item) => item.id === selected.customerId && !item.staged);
  const linkedTask = demo.tasks.find((task) => task.sources.some((source) => source.type === "email" && source.id === selected.id));
  const task = linkedTask && !linkedTask.staged ? linkedTask : undefined;
  const parts = selected.body.split(selected.quote);

  return <>
    <PageHeader eyebrow="Communication evidence" title="Emails" description="A calm inbox for the conversations that create customer commitments." actions={<Badge><Filter size={12}/>15 seeded messages</Badge>}/>
    <div className="filter-bar">{(["all","actionable","sent"] as const).map((item) => <button key={item} className={`filter-chip ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item[0].toUpperCase()+item.slice(1)}</button>)}</div>
    <section className="split-view surface"><div className="inbox-list">{visible.map((email) => <Link href={`/emails/${email.id}`} key={email.id} className={`inbox-item ${selected.id === email.id ? "active" : ""}`}><div className="inbox-item-head"><strong>{email.sender}</strong><small>{formatDate(email.date,true)}</small></div><h3>{email.subject}</h3><p>{email.quote}</p><div className="discovery-meta" style={{marginTop:7}}>{email.actionable ? <Badge tone="accent"><Sparkles size={10}/>Signal found</Badge> : <Badge><Newspaper size={10}/>Noise filtered</Badge>}<Badge>{email.direction}</Badge></div></Link>)}</div>
      <article className="message-pane"><Link href="/emails" className="text-link"><ArrowLeft size={13}/>Inbox</Link><div className="discovery-meta" style={{marginTop:18}}><Badge>{selected.language === "Norwegian" ? "NO · Norwegian" : "EN · English"}</Badge><Badge>{selected.direction}</Badge></div><h2>{selected.subject}</h2><div className="message-meta"><span className="avatar">{initials(selected.sender)}</span><div><strong>{selected.sender}</strong><div className="muted">{customer?.company || (selected.actionable ? "Unmatched sender" : "External newsletter")} · {formatDate(selected.date)}</div></div></div><div className="message-body">{parts[0]}<mark className="quote-highlight">{selected.quote}</mark>{parts[1]}</div>
        {task?.status === "pending" ? <div className="ai-callout"><Sparkles size={18}/><div><strong>{task.title}</strong><p>AI discovery linked to this exact sentence. <Link className="text-link" href={`/discover/${task.id}`}>Review discovery <ArrowUpRight size={11}/></Link></p></div></div> : task?.status === "approved" || task?.status === "done" ? <div className="ai-callout"><Sparkles size={18}/><div><strong>{task.title}</strong><p>This source is attached to {task.status === "done" ? "completed" : "approved"} work. <Link className="text-link" href={`/tasks/${task.id}`}>View task <ArrowUpRight size={11}/></Link></p></div></div> : task?.status === "dismissed" ? <div className="ai-callout"><Newspaper size={18}/><div><strong>Discovery dismissed</strong><p>The evidence remains here, while the suggestion has left the active review queue.</p></div></div> : linkedTask?.staged ? <div className="ai-callout"><Radar size={18}/><div><strong>Actionable signal ready to scan</strong><p>This seeded email has not been processed yet. <Link className="text-link" href="/scan">Run Scan Now <ArrowUpRight size={11}/></Link></p></div></div> : <div className="ai-callout"><Newspaper size={18}/><div><strong>Newsletter filtered — no action needed</strong><p>This message contains no actionable customer commitment, request, or promise.</p></div></div>}
      </article>
    </section>
  </>;
}
