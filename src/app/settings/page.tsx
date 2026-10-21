"use client";

import { useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import { Badge, Button, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";

export default function SettingsPage() {
  const demo = useDemo();
  const [tab, setTab] = useState<"preferences" | "ai" | "demo">("preferences");
  const [reset, setReset] = useState(false);

  return <>
    <PageHeader eyebrow="Workspace" title="Settings" description="Tune how Mercatur Flow presents discoveries and manages this demonstration." />
    <div className="settings-layout">
      <nav className="settings-nav surface" aria-label="Settings sections">
        <button className={tab === "preferences" ? "active" : ""} onClick={() => setTab("preferences")}>Preferences</button>
        <button className={tab === "ai" ? "active" : ""} onClick={() => setTab("ai")}>AI review</button>
        <button className={tab === "demo" ? "active" : ""} onClick={() => setTab("demo")}>Demo utility</button>
      </nav>
      <section className={`settings-panel surface ${tab === "demo" ? "danger-zone" : ""}`}>
        {tab === "preferences" && <>
          <div className="section-title"><div><h2>Personal preferences</h2><p>Saved in this browser and applied across the prototype.</p></div><Badge tone="success"><Check size={11}/>Saved automatically</Badge></div>
          <div className="settings-row"><div><strong>Task calendar entries</strong><span>Show approved dated tasks alongside meetings in the calendar.</span></div><button role="switch" aria-checked={demo.preferences.taskCalendarEntries} aria-label="Toggle task calendar entries" className={`switch ${demo.preferences.taskCalendarEntries ? "on" : ""}`} onClick={() => demo.setPreference("taskCalendarEntries", !demo.preferences.taskCalendarEntries)} /></div>
          <div className="settings-row"><div><strong>Attention summaries</strong><span>Surface overdue commitments and quiet accounts on Today.</span></div><button role="switch" aria-checked={demo.preferences.attentionSummaries} aria-label="Toggle attention summaries" className={`switch ${demo.preferences.attentionSummaries ? "on" : ""}`} onClick={() => demo.setPreference("attentionSummaries", !demo.preferences.attentionSummaries)} /></div>
        </>}
        {tab === "ai" && <>
          <div className="section-title"><div><h2>AI review policy</h2><p>Human approval is required for every discovered task.</p></div><Badge tone="accent"><Sparkles size={11}/>Simulated AI</Badge></div>
          <div className="settings-row"><div><strong>Approval mode</strong><span>Nothing becomes active work without a person’s decision.</span></div><Badge>Always review</Badge></div>
          <div className="settings-row"><div><strong>Source evidence</strong><span>Keep immutable links to the originating email or meeting.</span></div><Badge tone="success">Required</Badge></div>
          <div className="settings-row"><div><strong>Confidence indicators</strong><span>Illustrative signals, never presented as objective truth.</span></div><Badge>Contextual</Badge></div>
        </>}
        {tab === "demo" && <>
          <div className="section-title"><div><h2>Reset demonstration</h2><p>Restore all customers, tasks, discoveries, preferences, and calendar events to their seeded state.</p></div></div>
          <div className="settings-row"><div><strong>Deterministic seed state</strong><span>Clears browser persistence and restarts the guided story.</span></div><Button variant="danger" onClick={() => setReset(true)}><RotateCcw size={16}/>Reset demo</Button></div>
        </>}
      </section>
    </div>
    <Modal open={reset} onOpenChange={setReset} title="Reset the entire demo?" description="Approvals, edits, merges, scans, preferences, role selection, and rescheduled events will return to their original state.">
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setReset(false)}>Cancel</Button><Button variant="danger" onClick={() => { demo.resetDemo(); setReset(false); }}><RotateCcw size={15}/>Reset everything</Button></div>
    </Modal>
  </>;
}
