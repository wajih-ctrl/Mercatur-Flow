"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, CalendarDays, CheckSquare2, Mail, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { emails } from "@/data/seed";
import { formatDate, initials } from "@/lib/utils";
import { localizeContent, localizeLabel, localeFor, tr } from "@/lib/i18n";

export default function CustomerDetail({params}:{params:Promise<{id:string}>}) {
  const {id} = use(params);
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const customer = demo.customers.find((item) => item.id === id);
  if (!customer || customer.staged) notFound();
  const customerEmails = emails.filter((email) => email.customerId === id);
  const tasks = demo.tasks.filter((task) => task.customerId === id && task.status !== "dismissed" && !task.staged);
  const openCommitments = tasks.filter((task) => task.status === "pending" || task.status === "approved");
  const meetings = demo.meetings.filter((meeting) => meeting.customerId === id);
  const sentiment = customer.quiet ? localizeLabel(demo.language,"Cooling · attention recommended") : customer.id === "nordlys" || customer.id === "fjordtech" || customer.id === "telemark" ? localizeLabel(demo.language,"Positive") : localizeLabel(demo.language,"Stable");
  const nextStep = openCommitments[0]?.title ? localizeContent(demo.language,openCommitments[0].title) : (customer.quiet ? c(`Reconnect with ${customer.contact}`,`Ta kontakt med ${customer.contact} igjen`) : c("Maintain the current follow-up rhythm","Oppretthold dagens oppfølgingsrytme"));
  const timeline = [
    ...customerEmails.map((email) => ({date:email.date,type:"email",title:email.subject,text:email.quote,id:email.id,status:undefined,origin:undefined})),
    ...meetings.map((meeting) => ({date:meeting.date,type:"meeting",title:meeting.title,text:meeting.summary,id:meeting.id,status:undefined,origin:undefined})),
    ...tasks.map((task) => ({date:task.createdAt,type:"task",title:task.title,text:`${localizeLabel(demo.language,task.status)} · ${formatDate(task.due,false,localeFor(demo.language))}`,id:task.id,status:task.status,origin:task.origin})),
  ].sort((a,b) => b.date.localeCompare(a.date));

  return <>
    <Link href="/customers" className="text-link"><ArrowLeft size={14}/>{c("Customers","Kunder")}</Link>
    <section className="detail-grid" style={{marginTop:18}}>
      <div className="profile-hero surface"><div className="profile-main"><div className="identity"><span className="company-logo">{initials(customer.company)}</span><div><div className="discovery-meta"><Badge tone={customer.quiet ? "warning" : "accent"}>{customer.quiet && <AlertTriangle size={11}/>} {localizeLabel(demo.language,customer.status)}</Badge>{customer.statusDetail && <Badge>{localizeLabel(demo.language,customer.statusDetail)}</Badge>}{customer.createdFromSignature && <Badge tone="success"><Sparkles size={11}/>{c("Auto-created from signature","Opprettet automatisk fra signatur")}</Badge>}</div><h1>{customer.company}</h1><p>{customer.contact} · {localizeContent(demo.language,customer.position)}</p></div></div><dl className="profile-facts"><div><dt>{c("Company","Bedrift")}</dt><dd>{customer.company}</dd></div><div><dt>{c("Primary contact","Hovedkontakt")}</dt><dd>{customer.contact}</dd></div><div><dt>{c("Role","Rolle")}</dt><dd>{localizeContent(demo.language,customer.position)}</dd></div><div><dt>{c("Record source","Datakilde")}</dt><dd>{customer.createdFromSignature ? <Link className="text-link" href="/emails/email-10">{c("Seeded email signature","Seedet e-postsignatur")}</Link> : c("Seeded CRM profile","Seedet CRM-profil")}</dd></div></dl></div><div className="page-actions"><Link href={customerEmails[0] ? `/emails/${customerEmails[0].id}` : "/emails"}><Button variant="secondary"><Mail size={16}/>{c("Email history","E-posthistorikk")}</Button></Link><Link href={`/tasks?new=1&customer=${customer.id}`}><Button><Plus size={16}/>{c("Add follow-up","Legg til oppfølging")}</Button></Link></div></div>
      <div className="timeline surface"><div className="section-title"><div><h2>{c("Unified timeline","Samlet tidslinje")}</h2><p>{c("Messages, meetings, and work in one history","Meldinger, møter og arbeid samlet i én historikk")}</p></div></div><div className="timeline-list">{timeline.map((item,index) => <Link key={`${item.type}-${item.id}-${index}`} href={item.type === "email" ? `/emails/${item.id}` : item.type === "meeting" ? `/meetings/${item.id}` : item.origin === "AI" && item.status === "pending" ? `/discover/${item.id}` : `/tasks/${item.id}`} className="timeline-item"><span className="timeline-dot">{item.type === "email" ? <Mail size={14}/> : item.type === "meeting" ? <MessageSquareText size={14}/> : <CheckSquare2 size={14}/>}</span><div><h4>{item.type === "email" ? item.title : localizeContent(demo.language,item.title)}</h4><p>{formatDate(item.date,false,localeFor(demo.language))} · {item.type === "email" ? item.text : localizeContent(demo.language,item.text)}</p></div></Link>)}</div></div>
      <aside className="summary-card surface"><div className="eyebrow">{c("AI relationship brief · simulated","AI-relasjonsoversikt · simulert")}</div><h2>{customer.quiet ? c("Momentum needs attention","Fremdriften trenger oppmerksomhet") : c("Relationship in context","Relasjonen i kontekst")}</h2><p>{localizeContent(demo.language,customer.summary)}</p><div className="source-stack" style={{marginTop:20}}>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><CalendarDays size={15}/><div><strong>{c("Last contact","Siste kontakt")}</strong><span style={{color:"#c8d5d0"}}>{formatDate(customer.lastContact,false,localeFor(demo.language))}</span></div></div>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><CheckSquare2 size={15}/><div><strong>{openCommitments.length} {c("open commitments","åpne forpliktelser")}</strong><span style={{color:"#c8d5d0"}}>{tasks.filter((task) => task.status === "pending").length} {c("awaiting review","venter på gjennomgang")}</span></div></div>
        <div className="source-card" style={{borderColor:"rgba(255,255,255,.15)"}}><Sparkles size={15}/><div><strong>{c("Sentiment","Stemning")}: {sentiment}</strong><span style={{color:"#c8d5d0"}}>{c("Suggested next step","Foreslått neste steg")}: {nextStep}</span></div></div>
      </div>{customer.createdFromSignature && <p style={{fontSize:12,borderTop:"1px solid rgba(255,255,255,.13)",paddingTop:14}}>{c("Company and contact details were populated from Nora’s illustrative seeded email signature.","Bedrifts- og kontaktopplysninger ble fylt ut fra Noras illustrative, seedede e-postsignatur.")}</p>}</aside>
    </section>
  </>;
}
