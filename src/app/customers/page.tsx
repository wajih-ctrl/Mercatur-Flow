"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, Radar, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, EmptyState, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, initials } from "@/lib/utils";
import { localizeLabel, localeFor, tr } from "@/lib/i18n";

export default function CustomersPage() {
  const demo = useDemo();
  const c = (english: string, norwegian: string) => tr(demo.language, english, norwegian);
  const [query, setQuery] = useState("");
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    // URL state is only available after the client has hydrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (new URLSearchParams(window.location.search).get("filter") === "quiet") setQuiet(true);
  }, []);
  const salesCustomerIds = useMemo(() => new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId)), [demo.tasks]);
  const active = useMemo(() => demo.customers.filter((customer) =>
    !customer.staged &&
    (demo.role !== "Sales" || salesCustomerIds.has(customer.id)) &&
    (!quiet || customer.quiet) &&
    (customer.company.toLowerCase().includes(query.toLowerCase()) || customer.contact.toLowerCase().includes(query.toLowerCase()))
  ), [demo.customers, demo.role, salesCustomerIds, query, quiet]);

  return <>
    <PageHeader eyebrow={c("Relationship intelligence","Relasjonsinnsikt")} title={demo.role === "Sales" ? c("My customers","Mine kunder") : c("Customers","Kunder")} description={c(`${active.length} ${demo.role === "Sales" ? "assigned" : "visible"} relationships, with context from every customer touchpoint.`,`${active.length} ${demo.role === "Sales" ? "tildelte" : "synlige"} relasjoner, med kontekst fra hvert kundekontaktpunkt.`)} actions={demo.role !== "Sales" ? <Link href="/scan"><Button variant="secondary"><Radar size={16}/>{c("Discover customer","Finn kunde")}</Button></Link> : undefined}/>
    <div className="filter-bar">
      <div className="filter-search"><Search size={16}/><input aria-label={c("Search customers","Søk i kunder")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c("Search companies or contacts…","Søk etter bedrifter eller kontakter…")}/></div>
      <button className={`filter-chip ${!quiet ? "active" : ""}`} onClick={() => setQuiet(false)}>{c("All customers","Alle kunder")}</button>
      <button className={`filter-chip ${quiet ? "active" : ""}`} onClick={() => setQuiet(true)}>{c("Going quiet","Mindre aktivitet")}</button>
    </div>
    {active.length ? <div className="customer-grid">{active.map((customer) => <Link className="customer-card surface" href={`/customers/${customer.id}`} key={customer.id}>
      <div className="customer-head"><span className="company-logo" style={{width:40,height:40,borderRadius:11,fontSize:12}}>{initials(customer.company)}</span>{customer.createdFromSignature ? <Badge tone="success">{c("Auto-created","Opprettet automatisk")}</Badge> : customer.quiet ? <Badge tone="warning"><AlertCircle size={11}/>{c("Going quiet","Mindre aktivitet")}</Badge> : <Badge tone="accent">{localizeLabel(demo.language,customer.status)}</Badge>}</div>
      <h3>{customer.company}</h3><p>{customer.contact} · {customer.position}</p>
      <div className="customer-foot"><span>{c("Last contact","Siste kontakt")} {formatDate(customer.lastContact,true,localeFor(demo.language))}</span><ArrowRight size={14}/></div>
    </Link>)}</div> : <div className="surface"><EmptyState icon={<UsersRound/>} title={c("No customers found","Ingen kunder funnet")} description={c("Clear the filter or search for another name.","Nullstill filteret eller søk etter et annet navn.")} action={<Button variant="secondary" onClick={() => {setQuery("");setQuiet(false)}}>{c("Clear filters","Nullstill filtre")}</Button>}/></div>}
  </>;
}
