"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, CheckSquare2, ChevronDown, Command, ContactRound, Inbox, Languages, LayoutDashboard, Menu, MessageSquareText, Plus, Radar, Search, Settings2, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { cn, initials } from "@/lib/utils";
import { localizeContent, t, tr, type TranslationKey } from "@/lib/i18n";

const primary = [
  ["/today", "today", LayoutDashboard], ["/discover", "discoveries", Sparkles], ["/tasks", "tasks", CheckSquare2], ["/customers", "customers", ContactRound], ["/emails", "emails", Inbox], ["/meetings", "meetings", MessageSquareText], ["/calendar", "calendar", CalendarDays],
] as const;
const secondary = [["/connections", "connections", ShieldCheck], ["/settings", "settings", Settings2], ["/admin", "admin", UsersRound]] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const demo = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [query, setQuery] = useState("");
  const allItems = useMemo(() => {
    if (demo.role === "Admin") return [
      { label: tr(demo.language,"Workspace administration","Administrasjon av arbeidsområdet"), href: "/admin", kind: "Manage" },
      { label: t(demo.language,"connections"), href: "/connections", kind: "Manage" },
      { label: t(demo.language,"workspaceSettings"), href: "/settings", kind: "Manage" },
    ];
    const salesCustomerIds = new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId));
    const visibleTasks = demo.tasks.filter((task) => !task.staged && (demo.role !== "Sales" || task.owner === "Maja Nilsen"));
    const visibleCustomers = demo.customers.filter((customer) => !customer.staged && (demo.role !== "Sales" || salesCustomerIds.has(customer.id)));
    return [
      ...visibleTasks.map((task) => ({ label: localizeContent(demo.language,task.title), href: task.status === "pending" ? `/discover/${task.id}` : `/tasks/${task.id}`, kind: "Task" })),
      ...visibleCustomers.map((customer) => ({ label: customer.company, href: `/customers/${customer.id}`, kind: "Customer" })),
    ];
  }, [demo.tasks, demo.customers, demo.role, demo.language]);
  const results = query.trim() ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
  const pending = demo.tasks.filter((task) => task.status === "pending" && !task.staged).length;
  const guideSteps = demo.language === "no" ? [
    ["Start på I dag", "Se forpliktelser og relasjoner som trenger oppmerksomhet."], ["Se kildegrunnlaget", "Åpne et AI-funn og kontroller den nøyaktige kilden."], ["Kjør Skann nå", "Vis den nye Svalbard-kunden og filtrer bort nyhetsbrev."], ["Løs duplikater", "Slå sammen Oslo-fakturaoppgaven uten å miste kildegrunnlag."], ["Flytt Nordlys", "Flytt torsdagens møte til fredag kl. 10:00."], ["Fullfør flyten", "Godkjenn en oppgave og se den i kalenderen."],
  ] : [
    ["Start with Today", "See commitments and relationships that need attention."], ["Review evidence", "Open an AI discovery and inspect the exact source."], ["Run Scan Now", "Reveal the new Svalbard lead and filter newsletter noise."], ["Resolve duplication", "Merge the Oslo invoice task without losing evidence."], ["Reschedule Nordlys", "Move Thursday’s meeting to Friday at 10:00."], ["Close the loop", "Approve a task and see it reach the calendar."],
  ];

  useEffect(() => {
    const openCommandSearch = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", openCommandSearch);
    return () => window.removeEventListener("keydown", openCommandSearch);
  }, []);

  useEffect(() => { document.documentElement.lang = demo.language === "no" ? "nb" : "en"; }, [demo.language]);

  if (!demo.hydrated) return <div className="app-loading" role="status" aria-live="polite"><span className="brand-mark"><Activity size={18}/></span><div><strong>Mercatur Flow</strong><small>{tr(demo.language,"Restoring your local demo workspace…","Gjenoppretter det lokale demoarbeidsområdet…")}</small></div></div>;

  const nav = <>
    <div className="brand"><div className="brand-mark"><Activity size={18} /></div><div><strong>Mercatur Flow</strong><span>{tr(demo.language,"Mercatur workspace","Mercatur-arbeidsområde")}</span></div></div>
    {demo.role === "Olav" ? <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/scan"); }}><Radar size={17} /> {t(demo.language,"scanNow")}</Button> : demo.role === "Sales" ? <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/tasks?new=1"); }}><Plus size={17} /> {t(demo.language,"addMyTask")}</Button> : <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/settings"); }}><Settings2 size={17} /> {t(demo.language,"workspaceSettings")}</Button>}
    <nav className="side-nav" aria-label={tr(demo.language,"Primary navigation","Hovednavigasjon")}>
      <div className="nav-section">{t(demo.language,"workspace")}</div>
      {primary.filter(([href]) => demo.role === "Sales" ? ["/today", "/tasks", "/customers", "/emails", "/meetings", "/calendar"].includes(href) : demo.role === "Admin" ? false : true).map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("nav-item", pathname === href || pathname.startsWith(`${href}/`) ? "active" : "")}><Icon size={18} /><span>{t(demo.language,label as TranslationKey)}</span>{label === "discoveries" && pending > 0 && <em>{pending}</em>}</Link>)}
      <div className="nav-section secondary">{t(demo.language,"manage")}</div>
      {secondary.filter(() => demo.role !== "Sales").map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("nav-item", pathname === href ? "active" : "")}><Icon size={18} /><span>{t(demo.language,label as TranslationKey)}</span></Link>)}
    </nav>
    {demo.role === "Olav" && <button className="guide-card" onClick={() => setGuideOpen(true)} aria-label={tr(demo.language,"Open the six-step guided demo","Åpne den veiledede demoen med seks trinn")}><span><Sparkles size={15} /> {t(demo.language,"guidedDemo")}</span><small>{t(demo.language,"guidedTime")}</small></button>}
    <div className="simulated"><span /> {t(demo.language,"simulatedDemo")}</div>
  </>;

  return <div className="app-shell">
    <aside className="sidebar">{nav}</aside>
    {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}><aside className="mobile-sidebar" onClick={(e) => e.stopPropagation()}><button className="mobile-close" aria-label={tr(demo.language,"Close navigation","Lukk navigasjon")} onClick={() => setMobileOpen(false)}><X /></button>{nav}</aside></div>}
    <div className="workspace">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label={tr(demo.language,"Open navigation","Åpne navigasjon")}><Menu /></button>
        <button className="global-search" aria-label={demo.role === "Admin" ? t(demo.language,"searchManagement") : t(demo.language,"search")} onClick={() => setSearchOpen(true)}><Search size={17} /><span>{demo.role === "Admin" ? t(demo.language,"searchManagement") : t(demo.language,"search")}</span><kbd><Command size={12} /> K</kbd></button>
        <div className="topbar-spacer" />
        <div className="language-switcher" role="group" aria-label={t(demo.language,"language")} title={t(demo.language,"language")}><Languages size={16}/><span className="language-label">{t(demo.language,"language")}</span><button className={demo.language === "en" ? "active" : ""} aria-pressed={demo.language === "en"} onClick={()=>demo.setLanguage("en")}>EN</button><button className={demo.language === "no" ? "active" : ""} aria-pressed={demo.language === "no"} onClick={()=>demo.setLanguage("no")}>Norsk</button></div>
        <Badge tone="accent"><Sparkles size={12} /> {t(demo.language,"simulatedAI")}</Badge>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="role-trigger" aria-label={`${t(demo.language,"switchExperience")}. ${t(demo.language,"viewingAs")} ${demo.role}`}><span className="avatar">{initials(demo.role)}</span><span><small>{t(demo.language,"viewingAs")}</small>{demo.role === "Sales" ? t(demo.language,"salesMember") : demo.role}</span><ChevronDown size={15} /></DropdownMenu.Trigger>
          <DropdownMenu.Portal><DropdownMenu.Content className="dropdown" align="end" sideOffset={8}>
          <DropdownMenu.Label>{t(demo.language,"switchExperience")}</DropdownMenu.Label>
            {(["Olav", "Sales", "Admin"] as const).map((role) => <DropdownMenu.Item key={role} className={cn("dropdown-item", demo.role === role && "selected")} onSelect={() => { demo.setRole(role); router.push(role === "Admin" ? "/admin" : role === "Sales" ? "/tasks" : "/today"); }}><span className="avatar tiny">{initials(role)}</span><div><strong>{role === "Sales" ? t(demo.language,"salesMember") : role}</strong><small>{role === "Olav" ? t(demo.language,"ownerScope") : role === "Sales" ? t(demo.language,"salesScope") : t(demo.language,"adminScope")}</small></div></DropdownMenu.Item>)}
          </DropdownMenu.Content></DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>
      <main>{children}</main>
    </div>
    <Modal open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setQuery(""); }} title={t(demo.language,"commandSearchTitle")} description={demo.role === "Admin" ? t(demo.language,"commandSearchAdminDescription") : t(demo.language,"commandSearchDescription")}>
      <div className="search-box"><Search size={18} /><input aria-label={t(demo.language,"commandSearchTitle")} autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={demo.role === "Admin" ? t(demo.language,"searchManagementPlaceholder") : t(demo.language,"searchPlaceholder")} /></div>
      <div className="search-results">{!query && <div className="search-hint"><Sparkles size={15}/><span>{demo.role === "Admin" ? tr(demo.language,"Try “connections”, “settings”, or “administration”.","Prøv «tilkoblinger», «innstillinger» eller «administrasjon».") : demo.role === "Sales" ? tr(demo.language,"Search Maja’s assigned tasks and accounts.","Søk i Majas tildelte oppgaver og kontoer.") : tr(demo.language,"Try “Nordlys”, “invoice”, or a customer contact.","Prøv «Nordlys», «faktura» eller en kundekontakt.")}</span></div>}{results.map((item) => <button key={item.href} onClick={() => { setSearchOpen(false); setQuery(""); router.push(item.href); }}><span>{item.label}</span><Badge>{tr(demo.language,item.kind,item.kind === "Task" ? "Oppgave" : item.kind === "Customer" ? "Kunde" : "Administrer")}</Badge></button>)}{query && !results.length && <div className="no-results">{t(demo.language,"noMatches")}</div>}</div>
    </Modal>
    <Modal open={guideOpen} onOpenChange={setGuideOpen} title={t(demo.language,"threeMinuteStory")} description={t(demo.language,"guideDescription")}>
      <ol className="guide-steps">{guideSteps.map(([title,description])=><li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ol>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setGuideOpen(false)}>{t(demo.language,"notNow")}</Button><Button onClick={() => { setGuideOpen(false); router.push("/today"); }}>{t(demo.language,"startToday")}</Button></div>
    </Modal>
  </div>;
}
