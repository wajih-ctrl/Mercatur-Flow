"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, CheckSquare2, ChevronDown, Command, ContactRound, Inbox, LayoutDashboard, Menu, MessageSquareText, Plus, Radar, Search, Settings2, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { cn, initials } from "@/lib/utils";

const primary = [
  ["/today", "Today", LayoutDashboard], ["/discover", "AI Discoveries", Sparkles], ["/tasks", "Tasks", CheckSquare2], ["/customers", "Customers", ContactRound], ["/emails", "Emails", Inbox], ["/meetings", "Meetings", MessageSquareText], ["/calendar", "Calendar", CalendarDays],
] as const;
const secondary = [["/connections", "Connections & Privacy", ShieldCheck], ["/settings", "Settings", Settings2], ["/admin", "Admin", UsersRound]] as const;

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
      { label: "Workspace administration", href: "/admin", kind: "Manage" },
      { label: "Connections & privacy", href: "/connections", kind: "Manage" },
      { label: "Workspace settings", href: "/settings", kind: "Manage" },
    ];
    const salesCustomerIds = new Set(demo.tasks.filter((task) => task.owner === "Maja Nilsen").map((task) => task.customerId));
    const visibleTasks = demo.tasks.filter((task) => !task.staged && (demo.role !== "Sales" || task.owner === "Maja Nilsen"));
    const visibleCustomers = demo.customers.filter((customer) => !customer.staged && (demo.role !== "Sales" || salesCustomerIds.has(customer.id)));
    return [
      ...visibleTasks.map((task) => ({ label: task.title, href: task.status === "pending" ? `/discover/${task.id}` : `/tasks/${task.id}`, kind: "Task" })),
      ...visibleCustomers.map((customer) => ({ label: customer.company, href: `/customers/${customer.id}`, kind: "Customer" })),
    ];
  }, [demo.tasks, demo.customers, demo.role]);
  const results = query.trim() ? allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
  const pending = demo.tasks.filter((task) => task.status === "pending" && !task.staged).length;

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

  if (!demo.hydrated) return <div className="app-loading" role="status" aria-live="polite"><span className="brand-mark"><Activity size={18}/></span><div><strong>Mercatur Flow</strong><small>Restoring your local demo workspace…</small></div></div>;

  const nav = <>
    <div className="brand"><div className="brand-mark"><Activity size={18} /></div><div><strong>Mercatur Flow</strong><span>Mercatur workspace</span></div></div>
    {demo.role === "Olav" ? <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/scan"); }}><Radar size={17} /> Scan now</Button> : demo.role === "Sales" ? <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/tasks?new=1"); }}><Plus size={17} /> Add my task</Button> : <Button className="scan-button" onClick={() => { setMobileOpen(false); router.push("/settings"); }}><Settings2 size={17} /> Workspace settings</Button>}
    <nav className="side-nav" aria-label="Primary navigation">
      <div className="nav-section">Workspace</div>
      {primary.filter(([href]) => demo.role === "Sales" ? ["/today", "/tasks", "/customers", "/calendar"].includes(href) : demo.role === "Admin" ? false : true).map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("nav-item", pathname === href || pathname.startsWith(`${href}/`) ? "active" : "")}><Icon size={18} /><span>{label}</span>{label === "AI Discoveries" && pending > 0 && <em>{pending}</em>}</Link>)}
      <div className="nav-section secondary">Manage</div>
      {secondary.filter(() => demo.role !== "Sales").map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("nav-item", pathname === href ? "active" : "")}><Icon size={18} /><span>{label}</span></Link>)}
    </nav>
    {demo.role === "Olav" && <button className="guide-card" onClick={() => setGuideOpen(true)} aria-label="Open the six-step guided demo"><span><Sparkles size={15} /> Guided demo</span><small>Six steps · under 3 min</small></button>}
    <div className="simulated"><span /> Simulated AI · demo data</div>
  </>;

  return <div className="app-shell">
    <aside className="sidebar">{nav}</aside>
    {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)}><aside className="mobile-sidebar" onClick={(e) => e.stopPropagation()}><button className="mobile-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></button>{nav}</aside></div>}
    <div className="workspace">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
        <button className="global-search" aria-label={demo.role === "Admin" ? "Search management pages" : "Search tasks and customers"} onClick={() => setSearchOpen(true)}><Search size={17} /><span>{demo.role === "Admin" ? "Search management" : "Search tasks and customers"}</span><kbd><Command size={12} /> K</kbd></button>
        <div className="topbar-spacer" />
        <Badge tone="accent"><Sparkles size={12} /> Simulated AI</Badge>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="role-trigger" aria-label={`Switch role. Viewing as ${demo.role}`}><span className="avatar">{initials(demo.role)}</span><span><small>Viewing as</small>{demo.role}</span><ChevronDown size={15} /></DropdownMenu.Trigger>
          <DropdownMenu.Portal><DropdownMenu.Content className="dropdown" align="end" sideOffset={8}>
            <DropdownMenu.Label>Switch experience</DropdownMenu.Label>
            {(["Olav", "Sales", "Admin"] as const).map((role) => <DropdownMenu.Item key={role} className={cn("dropdown-item", demo.role === role && "selected")} onSelect={() => { demo.setRole(role); router.push(role === "Admin" ? "/admin" : role === "Sales" ? "/tasks" : "/today"); }}><span className="avatar tiny">{initials(role)}</span><div><strong>{role}</strong><small>{role === "Olav" ? "Owner · full workspace" : role === "Sales" ? "Assigned work only" : "Workspace administration"}</small></div></DropdownMenu.Item>)}
          </DropdownMenu.Content></DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>
      <main>{children}</main>
    </div>
    <Modal open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setQuery(""); }} title="Search Mercatur" description={demo.role === "Admin" ? "Jump to a management area. Press Ctrl/⌘ K from anywhere." : "Jump to a customer or task in your current role scope. Press Ctrl/⌘ K from anywhere."}>
      <div className="search-box"><Search size={18} /><input aria-label="Search Mercatur" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={demo.role === "Admin" ? "Search management…" : "Search by name or task…"} /></div>
      <div className="search-results">{!query && <div className="search-hint"><Sparkles size={15}/><span>{demo.role === "Admin" ? "Try “connections”, “settings”, or “administration”." : demo.role === "Sales" ? "Search Maja’s assigned tasks and accounts." : "Try “Nordlys”, “invoice”, or a customer contact."}</span></div>}{results.map((item) => <button key={item.href} onClick={() => { setSearchOpen(false); setQuery(""); router.push(item.href); }}><span>{item.label}</span><Badge>{item.kind}</Badge></button>)}{query && !results.length && <div className="no-results">No matches found in this role’s workspace.</div>}</div>
    </Modal>
    <Modal open={guideOpen} onOpenChange={setGuideOpen} title="A three-minute story" description="Follow Olav from discovered promise to customer follow-through.">
      <ol className="guide-steps"><li><strong>Start with Today</strong><span>See commitments and relationships that need attention.</span></li><li><strong>Review evidence</strong><span>Open an AI discovery and inspect the exact source.</span></li><li><strong>Run Scan Now</strong><span>Reveal the new Svalbard lead and filter newsletter noise.</span></li><li><strong>Resolve duplication</strong><span>Merge the Oslo invoice task without losing evidence.</span></li><li><strong>Reschedule Nordlys</strong><span>Move Thursday’s meeting to Friday at 10:00.</span></li><li><strong>Close the loop</strong><span>Approve a task and see it reach the calendar.</span></li></ol>
      <div className="dialog-actions"><Button variant="secondary" onClick={() => setGuideOpen(false)}>Not now</Button><Button onClick={() => { setGuideOpen(false); router.push("/today"); }}>Start on Today</Button></div>
    </Modal>
  </div>;
}
