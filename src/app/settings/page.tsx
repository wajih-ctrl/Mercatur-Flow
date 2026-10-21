"use client";

import { useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { Badge, Button, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { tr } from "@/lib/i18n";

export default function SettingsPage() {
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const [tab, setTab] = useState<"preferences" | "ai" | "demo">("preferences");
  const [reset, setReset] = useState(false);

  return <>
    <PageHeader eyebrow={c("Workspace","Arbeidsområde")} title={c("Settings","Innstillinger")} description={c("Tune how Mercatur Flow presents discoveries and manages this demonstration.","Tilpass hvordan Mercatur Flow viser funn og styrer denne demonstrasjonen.")} />
    <div className="settings-layout">
      <nav className="settings-nav surface" aria-label={c("Settings sections","Innstillingsområder")}>
        <button className={tab === "preferences" ? "active" : ""} onClick={() => setTab("preferences")}>{c("Preferences","Preferanser")}</button>
        <button className={tab === "ai" ? "active" : ""} onClick={() => setTab("ai")}>{c("AI review","AI-gjennomgang")}</button>
        <button className={tab === "demo" ? "active" : ""} onClick={() => setTab("demo")}>{c("Demo utility","Demoverktøy")}</button>
      </nav>
      <section className={`settings-panel surface ${tab === "demo" ? "danger-zone" : ""}`}>
        {tab === "preferences" && <>
          <div className="section-title"><div><h2>{c("Personal preferences","Personlige preferanser")}</h2><p>{c("Saved in this browser and applied across the prototype.","Lagres i denne nettleseren og brukes i hele prototypen.")}</p></div><Badge tone="success"><Check size={11}/>{c("Saved automatically","Lagres automatisk")}</Badge></div>
          <div className="settings-row"><div><strong>{c("Task calendar entries","Oppgaver i kalenderen")}</strong><span>{c("Show approved dated tasks alongside meetings in the calendar.","Vis godkjente oppgaver med dato sammen med møter i kalenderen.")}</span></div><button role="switch" aria-checked={demo.preferences.taskCalendarEntries} aria-label={c("Toggle task calendar entries","Slå kalenderoppføringer for oppgaver av eller på")} className={`switch ${demo.preferences.taskCalendarEntries ? "on" : ""}`} onClick={() => demo.setPreference("taskCalendarEntries", !demo.preferences.taskCalendarEntries)} /></div>
          <div className="settings-row"><div><strong>{c("Attention summaries","Oppmerksomhetsoversikter")}</strong><span>{c("Surface overdue commitments and quiet accounts on Today.","Vis forfalte forpliktelser og kontoer med lav aktivitet på I dag-siden.")}</span></div><button role="switch" aria-checked={demo.preferences.attentionSummaries} aria-label={c("Toggle attention summaries","Slå oppmerksomhetsoversikter av eller på")} className={`switch ${demo.preferences.attentionSummaries ? "on" : ""}`} onClick={() => demo.setPreference("attentionSummaries", !demo.preferences.attentionSummaries)} /></div>
        </>}
        {tab === "ai" && <>
          <div className="section-title"><div><h2>{c("AI review policy","Policy for AI-gjennomgang")}</h2><p>{c("Human approval is required for every discovered task.","Alle oppdagede oppgaver krever menneskelig godkjenning.")}</p></div><Badge tone="accent"><Sparkles size={11}/>{c("Simulated AI","Simulert AI")}</Badge></div>
          <div className="settings-row"><div><strong>{c("Approval mode","Godkjenningsmodus")}</strong><span>{c("Nothing becomes active work without a person’s decision.","Ingenting blir aktivt arbeid uten at en person tar en beslutning.")}</span></div><Badge>{c("Always review","Alltid gjennomgang")}</Badge></div>
          <div className="settings-row"><div><strong>{c("Source evidence","Kildegrunnlag")}</strong><span>{c("Keep immutable links to the originating email or meeting.","Behold uforanderlige koblinger til den opprinnelige e-posten eller møtet.")}</span></div><Badge tone="success">{c("Required","Påkrevd")}</Badge></div>
          <div className="settings-row"><div><strong>{c("Confidence indicators","Konfidensindikatorer")}</strong><span>{c("Illustrative signals, never presented as objective truth.","Illustrative signaler som aldri fremstilles som objektiv sannhet.")}</span></div><Badge>{c("Contextual","Kontekstavhengig")}</Badge></div>
        </>}
        {tab === "demo" && <>
          <div className="section-title"><div><h2>{c("Reset demonstration","Tilbakestill demonstrasjonen")}</h2><p>{c("Restore all customers, tasks, discoveries, preferences, and calendar events to their seeded state.","Gjenopprett alle kunder, oppgaver, funn, preferanser og kalenderhendelser til utgangstilstanden.")}</p></div></div>
          <div className="settings-row"><div><strong>{c("Deterministic seed state","Deterministisk utgangstilstand")}</strong><span>{c("Clears browser persistence and restarts the guided story.","Sletter lokal nettleserlagring og starter den veiledede historien på nytt.")}</span></div><Button variant="danger" onClick={() => setReset(true)}><RotateCcw size={16}/>{c("Reset demo","Tilbakestill demo")}</Button></div>
        </>}
      </section>
    </div>
    <Modal open={reset} onOpenChange={setReset} title={c("Reset the entire demo?","Tilbakestille hele demoen?")} description={c("Approvals, edits, merges, scans, preferences, role selection, and rescheduled events will return to their original state.","Godkjenninger, redigeringer, sammenslåinger, skanninger, preferanser, rollevalg og flyttede hendelser går tilbake til utgangstilstanden.")}>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setReset(false)}>{c("Cancel","Avbryt")}</Button><Button variant="danger" onClick={() => { demo.resetDemo(); setReset(false); }}><RotateCcw size={15}/>{c("Reset everything","Tilbakestill alt")}</Button></div>
    </Modal>
  </>;
}
