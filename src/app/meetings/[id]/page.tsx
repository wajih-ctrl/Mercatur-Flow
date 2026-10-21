"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { ArrowLeft, CalendarDays, Check, Link2, ListChecks, MessageSquareText, Plus, Sparkles, UserRound } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate } from "@/lib/utils";

export default function MeetingDetail({params}:{params:Promise<{id:string}>}) {
  const {id} = use(params);
  const demo = useDemo();
  const meeting = demo.meetings.find((item) => item.id === id);
  if (!meeting) notFound();
  const customer = demo.customers.find((item) => item.id === meeting.customerId);
  const calendarEvent = demo.events.find((event) => event.id === meeting.calendarEventId);

  return <article className="document surface">
    <Link href="/meetings" className="text-link"><ArrowLeft size={14}/>Meetings</Link>
    <div className="discovery-meta" style={{marginTop:20}}><Badge><MessageSquareText size={11}/>{formatDate(meeting.date)}</Badge><Badge>{meeting.duration} minutes</Badge><Badge>{meeting.language}</Badge>{meeting.sentiment && <Badge tone="success">{meeting.sentiment}</Badge>}</div>
    <h1>{meeting.title}</h1><p className="document-lead">{meeting.summary}</p>
    <div className="page-actions"><Link className="customer-link" href={`/customers/${customer?.id}`}>{customer?.company}</Link>{calendarEvent && <Link href="/calendar"><Button variant="secondary"><CalendarDays size={15}/>Linked event · {calendarEvent.title} · {calendarEvent.date} {calendarEvent.time}</Button></Link>}</div>
    <section className="doc-section"><h2>Participants</h2><div className="discovery-meta">{meeting.participants.map((person) => <Badge key={person}><UserRound size={11}/>{person}</Badge>)}</div></section>
    {meeting.decisions && <section className="doc-section"><h2>Decisions</h2>{meeting.decisions.map((item) => <div className="action-item" key={item}><span className="source-icon"><Check size={14}/></span><strong>{item}</strong></div>)}</section>}
    {meeting.concerns && <section className="doc-section"><h2>Concerns</h2>{meeting.concerns.map((item) => <div className="action-item" key={item}><span className="source-icon"><Sparkles size={14}/></span><strong>{item}</strong></div>)}</section>}
    <section className="doc-section"><h2>Action items</h2><p className="muted">Convert any action item in one click; the responsible owner remains attached.</p>{meeting.actionItems.map((item) => {const converted = demo.tasks.find((task) => task.id === item.convertedTaskId);return <div className="action-item" key={item.id}><span className="source-icon"><ListChecks size={15}/></span><div><strong>{item.text}</strong><div className="action-owner">Responsible: {item.owner}{item.relatedTaskId && " · Related task found"}</div></div>{converted ? <Link href={converted.status === "pending" ? `/discover/${converted.id}` : `/tasks/${converted.id}`}><Button variant="secondary"><Check size={14}/>{converted.status === "pending" ? "Review discovery" : "View task"}</Button></Link> : <Button variant="secondary" onClick={() => demo.convertAction(meeting.id,item.id)}><Plus size={14}/>Convert to task</Button>}</div>})}</section>
    <section className="doc-section"><div className="ai-callout"><Sparkles size={18}/><div><strong>Illustrative simulated transcript</strong><p>The structured action wording above is based on the supplied meeting notes; it is not represented as a client-provided verbatim transcript.</p></div></div>{meeting.id === "meeting-b" && <div className="ai-callout" style={{marginTop:10}}><Link2 size={18}/><div><strong>Cross-source match</strong><p>The proposal action is already combined with Kari’s email in one discovery.</p></div></div>}{meeting.id === "meeting-c" && <div className="ai-callout" style={{marginTop:10}}><Link2 size={18}/><div><strong>Related task—not a duplicate</strong><p>Converting the training-plan action preserves both tasks and links it to “Call Telemark about training.”</p></div></div>}</section>
  </article>;
}
