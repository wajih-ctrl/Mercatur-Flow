"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Inbox, Mail, MessageSquareText, Newspaper, Radar, Sparkles, UserPlus } from "lucide-react";
import { Badge, Button, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";

export default function ScanPage(){
  const demo=useDemo();
  const [scanning,setScanning]=useState(false);
  const [progress,setProgress]=useState(0);
  const start=()=>{if(demo.scanComplete)return;setScanning(true);setProgress(1)};
  useEffect(()=>{
    if(!scanning)return;
    let current=1;
    const timer=setInterval(()=>{
      current+=1;
      setProgress(Math.min(current,4));
      if(current>=4){clearInterval(timer);setScanning(false);demo.runScan()}
    },560);
    return()=>clearInterval(timer)
  },[scanning,demo]);
  const complete=demo.scanComplete;
  return <div className="scan-stage"><PageHeader eyebrow="Deterministic demo workflow" title="Scan now" description="Review seeded communication sources and surface work without creating duplicates."/><section className="scan-hero surface"><div className={`radar-orb ${scanning?"scanning":""}`}><Radar size={32}/></div><h1>{scanning?"Finding commitments…":complete?"Scan complete":"Ready to discover the work"}</h1><p>{scanning?"Checking requests, promises, timing language, signatures, and calendar changes.":complete?"New records are linked and noise has been safely ignored. Running again will not create duplicates.":"This simulated scan uses the brief’s predefined data. No account, inbox, or external service is accessed."}</p>{!complete&&!scanning&&<Button onClick={start}><Sparkles size={16}/>Start simulated scan</Button>}{complete&&<div className="page-actions" style={{justifyContent:"center"}}><Link href="/discover"><Button><Inbox size={16}/>Review discoveries</Button></Link><Button variant="secondary" disabled>No additional unprocessed commitments</Button></div>}
      <div className="scan-sources"><div className="scan-source surface"><span><Mail size={16}/>15 emails</span><small>Incoming and sent commitments</small></div><div className="scan-source surface"><span><MessageSquareText size={16}/>3 meetings</span><small>Action items and ownership</small></div><div className="scan-source surface"><span><Radar size={16}/>1 calendar change</span><small>Existing event matched</small></div></div>
      {scanning&&<div className="scan-log" aria-live="polite">{progress>=1&&<div><em>✓</em> Reading customer emails and sent promises…</div>}{progress>=2&&<div><em>✓</em> Extracting owned actions from the Fjordtech meeting transcript…</div>}{progress>=3&&<div><em>✓</em> Matching Nordlys evidence across email and meeting…</div>}{progress>=4&&<div><em>✓</em> Checking signatures and filtering newsletter noise…</div>}</div>}
      {complete&&<div className="results-list"><div className="result-card surface success"><span><UserPlus size={16}/>New customer created from email signature</span><p>Svalbard Logistics · Nora Strand, COO. Seeded illustrative signature data.</p></div><div className="result-card surface"><span><Sparkles size={16}/>3 new discoveries revealed</span><p>Two email requests and one meeting-transcript action are now in the human review queue.</p></div><div className="result-card surface"><span><MessageSquareText size={16}/>Task discovered from meeting transcript</span><p>“Send revised pricing by Thursday, October 22” was extracted from the Fjordtech pricing call with its exact source attached.</p></div><div className="result-card surface"><span><Radar size={16}/>Calendar change detected</span><p>Nordlys Thursday meeting matched to Kari’s Friday 10:00 request.</p></div><div className="result-card surface ignored"><span><Newspaper size={16}/>Newsletter filtered — no action needed</span><p>Checked and ignored because it contains no customer commitment.</p></div></div>}
      {complete&&<div style={{marginTop:18}}><Badge tone="success"><Check size={11}/>12 visible customers · repeat-safe scan</Badge></div>}
    </section></div>}
