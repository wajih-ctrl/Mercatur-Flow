"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, CalendarDays, CheckSquare2, Mail, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { emails } from "@/data/seed";
import { formatDate, initials } from "@/lib/utils";

export default function CustomerDetail({params}:{params:Promise<{id:string}>}) {
  const {id} = use(params);
  const demo = useDemo();
  const customer = demo.customers.find((item) => item.id === id);
  if (!customer || customer.staged) notFound();
  const customerEmails = emails.filter((email) => email.customerId === id);
  const tasks = demo.tasks.filter((task) => task.customerId === id && task.status !== "dismissed" && !task.staged);
  const openCommitments = tasks.filter((task) => task.status === "pending" || task.status === "approved");
  const meetings = demo.meetings.filter((meeting) => meeting.customerId === id);
  const sentiment = customer.quiet ? "Cooling · attention recommended" : customer.id === "nordlys" || customer.id === "fjordtech" || customer.id === "telemark" ? "Positive" : "Stable";
  const nextStep = openCommitments[0]?.title || (customer.quiet ? `Reconnect with ${customer.contact}` : "Maintain the current follow-up rhythm");
  const timeline = [
    ...customerEmails.map((email) => ({date:email.date,type:"email",title:email.subject,text:email.quote,id:email.id,status:undefined,origin:undefined})),
    ...meetings.map((meeting) => ({date:meeting.date,type:"meeting",title:meeting.title,text:meeting.summary,id:meeting.id,status:undefined,origin:undefined})),
    ...tasks.map((task) => ({date:task.createdAt,type:"task",title:task.title,text:`${task.status} · ${formatDate(task.due)}`,id:task.id,status:task.status,origin:task.origin})),
  ].sort((a,b) => b.date.localeCompare(a.date));

  return <>
    <Link href="/customers" className="text-link"><ArrowLeft size={14}/>Customers</Link>
    <section className="detail-grid" style={{marginTop:18}}>
      <div className="profile-hero surface"><div className="profile-main"><div className="identity"><span className="company-logo">{initials(customer.company)}</span><div><div className="discovery-meta"><Badge tone={customer.quiet ? "warning" : "accent"}>{customer.quiet && <AlertTriangle size={11}/>} {customer.status}</Badge>{customer.statusDetail && <Badge>{customer.statusDetail}</Badge>}{customer.createdFromSignature && <Badge tone="success"><Sparkles size={11}/>Auto-created from signature</Badge>}</div><h1>{customer.company}</h1><p>{customer.contact} · {customer.position}</p></div></div><dl className="profile-facts"><div><dt>Company</dt><dd>{customer.company}</dd></div><div><dt>Primary contact</dt><dd>{customer.contact}</dd></div><div><dt>Role</dt><dd>{customer.position}</dd></div><div><dt>Record source</dt><dd>{customer.createdFromSignature ? <Link className="text-link" href="/emails/email-10">Seeded email signature</Link> : "Seeded CRM profile"}</dd></div></dl></div><div className="page-actions"><Link href={customerEmails[0] ? `/emails/${customerEmails[0].id}` : "/emails"}><Button variant="secondary"><Mail size={16}/>Email history</Button></Link><Link href={`/tasks?new=1&customer=${customer.id}`}><Button><Plus size={16}/>Add follow-up</Button></Link></div></div>
      <div className="timeline surface"><div className="section-title"><div><h2>Unified timeline</h2><p>Messages, meetings, and work in one history</p></div></div><div className="timeline-list">{timeline.map((item,index) => <Link key={`${item.type}-${item.id}-${index}`} href={item.type === "email" ? `/emails/${item.id}` : item.type === "meeting" ? `/meetings/${item.id}` : item.origin === "AI" && item.status === "pending" ? `/discover/${item.id}` : `/tasks/${item.id}`} className="timeline-item"><span className="timeline-dot">{item.type === "email" ? <Mail size={14}/> : item.type === "meeting" ? <MessageSquareText size={14}/> : <CheckSquare2 size={14}/>}</span><div><h4>{item.title}</h4><p>{formatDate(item.date)} · {item.text}</p></div></Link>)}</div></div>
      <aside className="summary-card surface"><div className="eyebrow">AI relationship brief · simulated</div><h2>{customer.quiet ? "Momentum needs attention" : "Relationship in context"}</h2><p>{customer.summary}</p><div className="source-stack" style={{marginTop:20}}>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><CalendarDays size={15}/><div><strong>Last contact</strong><span style={{color:"#c8d5d0"}}>{formatDate(customer.lastContact)}</span></div></div>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><CheckSquare2 size={15}/><div><strong>{openCommitments.length} open commitments</strong><span style={{color:"#c8d5d0"}}>{tasks.filter((task) => task.status === "pending").length} awaiting review</span></div></div>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><Sparkles size={15}/><div><strong>Sentiment: {sentiment}</strong><span style={{color:"#c8d5d0"}}>Suggested next step: {nextStep}</span></div></div>
      </div>{customer.createdFromSignature && <p style={{fontSize:12,borderTop:"1px solid rgba(255,255,255,.13)",paddingTop:14}}>Company and contact details were populated from Nora’s illustrative seeded email signature.</p>}</aside>
    </section>
  </>;
}
