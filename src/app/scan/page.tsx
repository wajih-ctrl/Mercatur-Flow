"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Inbox, Mail, MessageSquareText, Newspaper, Radar, Sparkles, UserPlus } from "lucide-react";
import { Badge, Button, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { tr } from "@/lib/i18n";

export default function ScanPage(){
  const demo=useDemo();
  const c=(english:string,norwegian:string)=>tr(demo.language,english,norwegian);
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
  return <div className="scan-stage"><PageHeader eyebrow={c("Deterministic demo workflow","Deterministisk demoflyt")} title={c("Scan now","Skann nå")} description={c("Review seeded communication sources and surface work without creating duplicates.","Gå gjennom seedede kommunikasjonskilder og finn arbeid uten å opprette duplikater.")}/><section className="scan-hero surface"><div className={`radar-orb ${scanning?"scanning":""}`}><Radar size={32}/></div><h1>{scanning?c("Finding commitments…","Finner forpliktelser…"):complete?c("Scan complete","Skanning fullført"):c("Ready to discover the work","Klar til å finne arbeidet")}</h1><p>{scanning?c("Checking requests, promises, timing language, signatures, and calendar changes.","Kontrollerer forespørsler, løfter, tidsuttrykk, signaturer og kalenderendringer."):complete?c("New records are linked and noise has been safely ignored. Running again will not create duplicates.","Nye oppføringer er koblet sammen, og støy er trygt filtrert bort. En ny kjøring oppretter ikke duplikater."):c("This simulated scan uses the brief’s predefined data. No account, inbox, or external service is accessed.","Denne simulerte skanningen bruker forhåndsdefinerte data. Ingen konto, innboks eller ekstern tjeneste åpnes.")}</p>{!complete&&!scanning&&<Button onClick={start}><Sparkles size={16}/>{c("Start simulated scan","Start simulert skanning")}</Button>}{complete&&<div className="page-actions" style={{justifyContent:"center"}}><Link href="/discover"><Button><Inbox size={16}/>{c("Review discoveries","Gå gjennom funn")}</Button></Link><Button variant="secondary" disabled>{c("No additional unprocessed commitments","Ingen flere ubehandlede forpliktelser")}</Button></div>}
      <div className="scan-sources"><div className="scan-source surface"><span><Mail size={16}/>15 {c("emails","e-poster")}</span><small>{c("Incoming and sent commitments","Innkommende og sendte forpliktelser")}</small></div><div className="scan-source surface"><span><MessageSquareText size={16}/>3 {c("meetings","møter")}</span><small>{c("Action items and ownership","Handlingspunkter og ansvar")}</small></div><div className="scan-source surface"><span><Radar size={16}/>1 {c("calendar change","kalenderendring")}</span><small>{c("Existing event matched","Eksisterende hendelse funnet")}</small></div></div>
      {scanning&&<div className="scan-log" aria-live="polite">{progress>=1&&<div><em>✓</em> {c("Reading customer emails and sent promises…","Leser kunde-e-poster og sendte løfter…")}</div>}{progress>=2&&<div><em>✓</em> {c("Extracting owned actions from the Fjordtech meeting transcript…","Henter ansvarlige handlinger fra møtereferatet med Fjordtech…")}</div>}{progress>=3&&<div><em>✓</em> {c("Matching Nordlys evidence across email and meeting…","Sammenstiller Nordlys-kilder fra e-post og møte…")}</div>}{progress>=4&&<div><em>✓</em> {c("Checking signatures and filtering newsletter noise…","Kontrollerer signaturer og filtrerer bort nyhetsbrev…")}</div>}</div>}
      {complete&&<div className="results-list"><div className="result-card surface success"><span><UserPlus size={16}/>{c("New customer created from email signature","Ny kunde opprettet fra e-postsignatur")}</span><p>{c("Svalbard Logistics · Nora Strand, COO. Seeded illustrative signature data.","Svalbard Logistics · Nora Strand, COO. Illustrativt, seedet signaturgrunnlag.")}</p></div><div className="result-card surface"><span><Sparkles size={16}/>{c("3 new discoveries revealed","3 nye funn avdekket")}</span><p>{c("Two email requests and one meeting-transcript action are now in the human review queue.","To e-postforespørsler og ett handlingspunkt fra et møtereferat ligger nå i køen for menneskelig gjennomgang.")}</p></div><div className="result-card surface"><span><MessageSquareText size={16}/>{c("Task discovered from meeting transcript","Oppgave funnet i møtereferat")}</span><p>{c("“Send revised pricing by Thursday, October 22” was extracted from the Fjordtech pricing call with its exact source attached.","«Send revidert pris innen torsdag 22. oktober» ble hentet fra prissamtalen med Fjordtech, med nøyaktig kilde vedlagt.")}</p></div><div className="result-card surface"><span><Radar size={16}/>{c("Calendar change detected","Kalenderendring oppdaget")}</span><p>{c("Nordlys Thursday meeting matched to Kari’s Friday 10:00 request.","Nordlys-møtet torsdag ble koblet til Karis forespørsel om fredag kl. 10:00.")}</p></div><div className="result-card surface ignored"><span><Newspaper size={16}/>{c("Newsletter filtered — no action needed","Nyhetsbrev filtrert – ingen handling nødvendig")}</span><p>{c("Checked and ignored because it contains no customer commitment.","Kontrollert og ignorert fordi det ikke inneholder noen kundeforpliktelse.")}</p></div></div>}
      {complete&&<div style={{marginTop:18}}><Badge tone="success"><Check size={11}/>{c("12 visible customers · repeat-safe scan","12 synlige kunder · trygg å kjøre flere ganger")}</Badge></div>}
    </section></div>}
