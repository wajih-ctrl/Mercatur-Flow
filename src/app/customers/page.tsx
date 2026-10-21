"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, Radar, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, EmptyState, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate, initials } from "@/lib/utils";

export default function CustomersPage() {
  const demo = useDemo();
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
    <PageHeader eyebrow="Relationship intelligence" title={demo.role === "Sales" ? "My customers" : "Customers"} description={`${active.length} ${demo.role === "Sales" ? "assigned" : "visible"} relationships, with context from every customer touchpoint.`} actions={demo.role !== "Sales" ? <Link href="/scan"><Button variant="secondary"><Radar size={16}/>Discover customer</Button></Link> : undefined}/>
    <div className="filter-bar">
      <div className="filter-search"><Search size={16}/><input aria-label="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies or contacts…"/></div>
      <button className={`filter-chip ${!quiet ? "active" : ""}`} onClick={() => setQuiet(false)}>All customers</button>
      <button className={`filter-chip ${quiet ? "active" : ""}`} onClick={() => setQuiet(true)}>Going quiet</button>
    </div>
    {active.length ? <div className="customer-grid">{active.map((customer) => <Link className="customer-card surface" href={`/customers/${customer.id}`} key={customer.id}>
      <div className="customer-head"><span className="company-logo" style={{width:40,height:40,borderRadius:11,fontSize:12}}>{initials(customer.company)}</span>{customer.quiet ? <Badge tone="warning"><AlertCircle size={11}/>Going quiet</Badge> : <Badge tone="accent">{customer.status}</Badge>}</div>
      <h3>{customer.company}</h3><p>{customer.contact} · {customer.position}</p>
      <div className="customer-foot"><span>Last contact {formatDate(customer.lastContact,true)}</span><ArrowRight size={14}/></div>
    </Link>)}</div> : <div className="surface"><EmptyState icon={<UsersRound/>} title="No customers found" description="Clear the filter or search for another name." action={<Button variant="secondary" onClick={() => {setQuery("");setQuiet(false)}}>Clear filters</Button>}/></div>}
  </>;
}
