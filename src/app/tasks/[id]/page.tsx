"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, CalendarDays, Check, Link2, Mail, MessageSquareText, Sparkles } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate } from "@/lib/utils";
import { localizeContent, localizeLabel, localeFor, tr } from "@/lib/i18n";

export default function TaskDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=use(params);
  const demo=useDemo();
  const c=(english:string,norwegian:string)=>tr(demo.language,english,norwegian);
  const task=demo.tasks.find(item=>item.id===id);
  if(!task)notFound();
  const customer=demo.customers.find(item=>item.id===task.customerId);
  const related=demo.tasks.find(item=>item.id===task.relatedTo);
  const relatedHref=related?.origin==="AI"&&related.status==="pending"?`/discover/${related.id}`:related?`/tasks/${related.id}`:"/tasks";

  return <div className="document surface">
    <Link href="/tasks" className="text-link"><ArrowLeft size={14}/>{c("Back to tasks","Tilbake til oppgaver")}</Link>
    <div style={{marginTop:22}} className="discovery-meta"><Badge tone={task.origin==="AI"?"accent":"neutral"}>{task.origin==="AI"&&<Sparkles size={11}/>} {localizeLabel(demo.language,task.origin)}</Badge><Badge>{localizeLabel(demo.language,task.status)}</Badge></div>
    <h1>{localizeContent(demo.language,task.title)}</h1><p className="document-lead">{customer?customer.company:c("Internal work","Internt arbeid")} · {c("owned by","ansvarlig")}: {task.owner}</p>
    <div className="doc-section"><div className="metrics" style={{margin:0}}><div className="metric surface"><span className="muted">{c("Due date & time","Forfallsdato og tidspunkt")}</span><strong style={{fontSize:19}}>{formatDate(task.due,false,localeFor(demo.language))}{task.due&&` · ${task.time||"09:00"}`}</strong></div><div className="metric surface"><span className="muted">{c("Evidence","Kildegrunnlag")}</span><strong style={{fontSize:19}}>{task.sources.length} {task.sources.length===1?c("source","kilde"):c("sources","kilder")}</strong></div></div></div>
    {related&&<div className="doc-section"><h2>{c("Related work","Relatert arbeid")}</h2><Link className="source-card" href={relatedHref}><span className="source-icon"><Link2 size={15}/></span><div><strong>{localizeContent(demo.language,related.title)}</strong><span>{related.status==="pending"?c("Awaiting review · explicitly linked","Venter på gjennomgang · uttrykkelig koblet"):c("Kept separate, explicitly linked","Beholdes separat · uttrykkelig koblet")}</span></div></Link></div>}
    <div className="doc-section"><h2>{c("Source evidence","Kildegrunnlag")}</h2>{task.sources.length?<div className="source-stack">{task.sources.map(source=><Link key={source.id} className="source-card" href={`/${source.type==="email"?"emails":"meetings"}/${source.id}`}><span className="source-icon">{source.type==="email"?<Mail size={14}/>:<MessageSquareText size={14}/>}</span><div><strong>{localizeContent(demo.language,source.label)}</strong><span>“{source.excerpt}”</span></div></Link>)}</div>:<p className="muted">{c("This task was created manually and has no source evidence.","Denne oppgaven ble opprettet manuelt og har ikke noe kildegrunnlag.")}</p>}</div>
    <div className="panel-actions">{task.status==="approved"&&<Button onClick={()=>demo.completeTask(task.id)}><Check size={16}/>{c("Mark complete","Merk som fullført")}</Button>}<Link href="/calendar"><Button variant="secondary"><CalendarDays size={16}/>{c("Open calendar","Åpne kalender")}</Button></Link></div>
  </div>;
}
