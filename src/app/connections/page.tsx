"use client";

import { CalendarDays, CheckCircle2, DatabaseZap, EyeOff, LockKeyhole, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { tr } from "@/lib/i18n";

const services = [
  { name: "Gmail", stateKey: "Gmail", desc: "15 seeded messages available", icon: Mail },
  { name: "Outlook", stateKey: "Outlook", desc: "Mock inbox connection available", icon: Mail },
  { name: "Google Calendar / Outlook", stateKey: "Calendar", desc: "Seeded events and two-way sync preview", icon: CalendarDays },
  { name: "Meeting recorder", stateKey: "Meetings", desc: "Zoom, Teams, and Fireflies · 3 seeded transcripts", icon: MessageSquareText },
];

export default function ConnectionsPage() {
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const descriptions: Record<string, string> = { Gmail: c("15 seeded messages available","15 seedede meldinger er tilgjengelige"), Outlook: c("Mock inbox connection available","Simulert innbokstilkobling er tilgjengelig"), Calendar: c("Seeded events and two-way sync preview","Seedede hendelser og forhåndsvisning av toveis synkronisering"), Meetings: c("Zoom, Teams, and Fireflies · 3 seeded transcripts","Zoom, Teams og Fireflies · 3 seedede møtereferater") };
  return <>
    <PageHeader eyebrow={c("Transparent by design","Åpenhet som prinsipp")} title={c("Connections & privacy","Tilkoblinger og personvern")} description={c("Preview onboarding and integration states without connecting a real account or sending data externally.","Forhåndsvis oppstart og integrasjoner uten å koble til en ekte konto eller sende data ut av løsningen.")} actions={<Badge tone="accent"><ShieldCheck size={12}/>{c("Simulation only","Kun simulering")}</Badge>}/>
    <div className="connections-grid">{services.map(({name,stateKey,icon:Icon}) => {const connected=demo.connections[stateKey];return <div className="connection-card surface" key={name}><span className="connection-icon"><Icon size={20}/></span><div className="connection-copy"><strong>{name}</strong><span>{descriptions[stateKey]}</span></div><span className={`connection-status ${connected ? "connected" : "available"}`}><i/>{connected ? c("Connected","Tilkoblet") : c("Available","Tilgjengelig")}</span><button role="switch" aria-checked={connected} aria-label={`${connected ? c("Disconnect","Koble fra") : c("Connect","Koble til")} ${name}`} className={`switch ${connected ? "on" : ""}`} onClick={() => demo.setConnection(stateKey,!connected)}/></div>})}</div>
    <section className="privacy surface"><div className="section-title"><div><h2>{c("What the AI reads—and what it never does","Hva AI-en leser – og hva den aldri gjør")}</h2><p>{c("Clear boundaries for a trustworthy demonstration","Tydelige grenser for en pålitelig demonstrasjon")}</p></div></div><div className="privacy-grid">
      <div className="privacy-item"><DatabaseZap size={18}/><strong>{c("Seed data only","Kun seedede data")}</strong><p>{c("All companies, people, messages, and results are fictional deterministic records.","Alle bedrifter, personer, meldinger og resultater er fiktive, deterministiske data.")}</p></div>
      <div className="privacy-item"><CheckCircle2 size={18}/><strong>{c("Human approval required","Menneskelig godkjenning kreves")}</strong><p>{c("Nothing becomes an active task until the user explicitly approves it.","Ingenting blir en aktiv oppgave før brukeren uttrykkelig godkjenner det.")}</p></div>
      <div className="privacy-item"><LockKeyhole size={18}/><strong>{c("Stored in your browser","Lagres i nettleseren")}</strong><p>{c("Demo decisions persist locally. No production database or cloud storage is used.","Demobeslutninger lagres lokalt. Ingen produksjonsdatabase eller skylagring brukes.")}</p></div>
      <div className="privacy-item"><EyeOff size={18}/><strong>{c("Simulated AI pipeline","Simulert AI-prosess")}</strong><p>{c("No content leaves this app. Confidence, extraction, and summaries are pre-computed illustrations.","Innhold forlater ikke appen. Konfidens, uttrekk og oppsummeringer er forhåndsberegnede illustrasjoner.")}</p></div>
    </div></section>
  </>;
}
