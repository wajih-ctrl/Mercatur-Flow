"use client";

import { CalendarDays, CheckCircle2, DatabaseZap, EyeOff, LockKeyhole, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";

const services = [
  { name: "Gmail", stateKey: "Gmail", desc: "15 seeded messages available", icon: Mail },
  { name: "Outlook", stateKey: "Outlook", desc: "Mock inbox connection available", icon: Mail },
  { name: "Google Calendar / Outlook", stateKey: "Calendar", desc: "Seeded events and two-way sync preview", icon: CalendarDays },
  { name: "Meeting recorder", stateKey: "Meetings", desc: "Zoom, Teams, and Fireflies · 3 seeded transcripts", icon: MessageSquareText },
];

export default function ConnectionsPage() {
  const demo = useDemo();
  return <>
    <PageHeader eyebrow="Transparent by design" title="Connections & privacy" description="Preview onboarding and integration states without connecting a real account or sending data externally." actions={<Badge tone="accent"><ShieldCheck size={12}/>Simulation only</Badge>}/>
    <div className="connections-grid">{services.map(({name,stateKey,desc,icon:Icon}) => {const connected=demo.connections[stateKey];return <div className="connection-card surface" key={name}><span className="connection-icon"><Icon size={20}/></span><div className="connection-copy"><strong>{name}</strong><span>{desc}</span></div><span className={`connection-status ${connected ? "connected" : "available"}`}><i/>{connected ? "Connected" : "Available"}</span><button role="switch" aria-checked={connected} aria-label={`${connected ? "Disconnect" : "Connect"} ${name} demo source`} className={`switch ${connected ? "on" : ""}`} onClick={() => demo.setConnection(stateKey,!connected)}/></div>})}</div>
    <section className="privacy surface"><div className="section-title"><div><h2>What the AI reads—and what it never does</h2><p>Clear boundaries for a trustworthy demonstration</p></div></div><div className="privacy-grid">
      <div className="privacy-item"><DatabaseZap size={18}/><strong>Seed data only</strong><p>All companies, people, messages, and results are fictional deterministic records.</p></div>
      <div className="privacy-item"><CheckCircle2 size={18}/><strong>Human approval required</strong><p>Nothing becomes an active task until the user explicitly approves it.</p></div>
      <div className="privacy-item"><LockKeyhole size={18}/><strong>Stored in your browser</strong><p>Demo decisions persist locally. No production database or cloud storage is used.</p></div>
      <div className="privacy-item"><EyeOff size={18}/><strong>Simulated AI pipeline</strong><p>No content leaves this app. Confidence, extraction, and summaries are pre-computed illustrations.</p></div>
    </div></section>
  </>;
}
