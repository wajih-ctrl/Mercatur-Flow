"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, CalendarDays, Check, Link2, ListChecks, MessageSquareText, Plus, Sparkles, UserRound } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate } from "@/lib/utils";
import { localizeContent, localizeLabel, localeFor, tr } from "@/lib/i18n";

export default function MeetingDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=use(params);
  const demo=useDemo();
  const c=(english:string,norwegian:string)=>tr(demo.language,english,norwegian);
  const meeting=demo.meetings.find(item=>item.id===id);
  if(!meeting)notFound();
  const customer=demo.customers.find(item=>item.id===meeting.customerId);
  const calendarEvent=demo.events.find(event=>event.id===meeting.calendarEventId);

  return <article className="document surface">
    <Link href="/meetings" className="text-link"><ArrowLeft size={14}/>{c("Meetings","Møter")}</Link>
    <div className="discovery-meta" style={{marginTop:20}}><Badge><MessageSquareText size={11}/>{formatDate(meeting.date,false,localeFor(demo.language))}</Badge><Badge>{meeting.duration} {c("minutes","minutter")}</Badge><Badge>{localizeLabel(demo.language,meeting.language)}</Badge>{meeting.sentiment&&<Badge tone="success">{localizeLabel(demo.language,meeting.sentiment)}</Badge>}</div>
    <h1>{localizeContent(demo.language,meeting.title)}</h1><p className="document-lead">{localizeContent(demo.language,meeting.summary)}</p>
    <div className="page-actions"><Link className="customer-link" href={`/customers/${customer?.id}`}>{customer?.company}</Link>{calendarEvent&&<Link href="/calendar"><Button variant="secondary"><CalendarDays size={15}/>{c("Linked event","Tilknyttet hendelse")} · {calendarEvent.title} · {calendarEvent.date} {calendarEvent.time}</Button></Link>}</div>
    <section className="doc-section"><h2>{c("Participants","Deltakere")}</h2><div className="discovery-meta">{meeting.participants.map(person=><Badge key={person}><UserRound size={11}/>{person}</Badge>)}</div></section>
    {meeting.decisions&&<section className="doc-section"><h2>{c("Decisions","Beslutninger")}</h2>{meeting.decisions.map(item=><div className="action-item" key={item}><span className="source-icon"><Check size={14}/></span><strong>{localizeContent(demo.language,item)}</strong></div>)}</section>}
    {meeting.concerns&&<section className="doc-section"><h2>{c("Concerns","Bekymringer")}</h2>{meeting.concerns.map(item=><div className="action-item" key={item}><span className="source-icon"><Sparkles size={14}/></span><strong>{localizeContent(demo.language,item)}</strong></div>)}</section>}
    <section className="doc-section"><h2>{c("Action items","Handlingspunkter")}</h2><p className="muted">{c("Convert any action item in one click; the responsible owner remains attached.","Gjør et handlingspunkt om til en oppgave med ett klikk; ansvarlig person følger med.")}</p>{meeting.actionItems.map(item=>{const converted=demo.tasks.find(task=>task.id===item.convertedTaskId);return <div className="action-item" key={item.id}><span className="source-icon"><ListChecks size={15}/></span><div><strong>{localizeContent(demo.language,item.text)}</strong><div className="action-owner">{c("Responsible","Ansvarlig")}: {item.owner}{item.relatedTaskId&&` · ${c("Related task found","Relatert oppgave funnet")}`}</div></div>{converted?<Link href={converted.status==="pending"?`/discover/${converted.id}`:`/tasks/${converted.id}`}><Button variant="secondary"><Check size={14}/>{converted.status==="pending"?c("Review discovery","Gå gjennom funn"):c("View task","Se oppgave")}</Button></Link>:<Button variant="secondary" onClick={()=>demo.convertAction(meeting.id,item.id)}><Plus size={14}/>{c("Convert to task","Gjør om til oppgave")}</Button>}</div>})}</section>
    <section className="doc-section"><div className="ai-callout"><Sparkles size={18}/><div><strong>{c("Illustrative simulated transcript","Illustrativt simulert møtereferat")}</strong><p>{c("The structured action wording above is based on the supplied meeting notes; it is not represented as a client-provided verbatim transcript.","Formuleringene over er basert på de oppgitte møtenotatene og fremstilles ikke som et ordrett referat fra kunden.")}</p></div></div>{meeting.id==="meeting-b"&&<div className="ai-callout" style={{marginTop:10}}><Link2 size={18}/><div><strong>{c("Cross-source match","Samsvar mellom kilder")}</strong><p>{c("The proposal action is already combined with Kari’s email in one discovery.","Tilbudshandlingen er allerede kombinert med Karis e-post i ett funn.")}</p></div></div>}{meeting.id==="meeting-c"&&<div className="ai-callout" style={{marginTop:10}}><Link2 size={18}/><div><strong>{c("Related task—not a duplicate","Relatert oppgave – ikke et duplikat")}</strong><p>{c("Converting the training-plan action preserves both tasks and links it to “Call Telemark about training.”","Når handlingspunktet om opplæringsplan gjøres om, beholdes begge oppgavene og kobles til «Ring Telemark om opplæring».")}</p></div></div>}</section>
  </article>;
}
