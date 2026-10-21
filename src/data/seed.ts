import type { CalendarEvent, Customer, DemoState, Email, Meeting, Task } from "@/lib/types";

export const customers: Customer[] = [
  { id: "nordlys", company: "Nordlys Bygg AS", contact: "Kari Solberg", position: "Prosjektleder", status: "Active deal", statusDetail: "Proposal pending", lastContact: "2026-10-19", summary: "Positive buying signal. A revised proposal is due before the board review on Monday." },
  { id: "fjordtech", company: "Fjordtech Solutions", contact: "Erik Lund", position: "CTO", status: "Negotiation", lastContact: "2026-10-21", summary: "Legal review is the remaining blocker. Erik is positive and the team has agreed to a three-month pilot." },
  { id: "havbris", company: "Havbris Sjømat", contact: "Ingrid Haugen", position: "Innkjøpssjef", status: "Active customer", lastContact: "2026-10-16", summary: "The procurement team has asked for a product demonstration next week." },
  { id: "bergen", company: "Bergen Maritime Partners", contact: "Tom Eriksen", position: "Managing Director", status: "Warm lead", lastContact: "2026-10-12", quiet: true, summary: "The relationship is cooling. Tom suggested reconnecting after the Posidonia trade fair." },
  { id: "oslo", company: "Oslo Design Collective", contact: "Marte Dahl", position: "Founder", status: "Active customer", lastContact: "2026-10-20", summary: "Healthy active account, with one unresolved October invoice question." },
  { id: "telemark", company: "Telemark Energi", contact: "Henrik Moen", position: "Head of Operations", status: "Active deal", statusDetail: "Pilot", lastContact: "2026-10-18", summary: "Pilot results are positive. Training and data export are the current focus areas." },
  { id: "aurora", company: "Aurora Retail Group", contact: "Sofie Berg", position: "Digital Director", status: "Warm lead", lastContact: "2026-10-09", quiet: true, summary: "No response for 12 days after a case-study request. A thoughtful follow-up is recommended." },
  { id: "kystveien", company: "Kystveien Eiendom", contact: "Lars Pettersen", position: "Daglig leder", status: "Active customer", lastContact: "2026-10-15", summary: "Lars is waiting for a call after Olav reviews the agreement." },
  { id: "svalbard", company: "Svalbard Logistics", contact: "Nora Strand", position: "COO", status: "New lead", lastContact: "2026-10-21", staged: true, createdFromSignature: true, summary: "New referral. Company identity was discovered from a seeded email signature." },
  { id: "lysefjord", company: "Lysefjord Hotels", contact: "Anders Vik", position: "General Manager", status: "Active customer", statusDetail: "Renewal due", lastContact: "2026-10-17", summary: "Contract expires 31 December. Anders has invited a renewal conversation." },
  { id: "nordic", company: "Nordic Pulse Health", contact: "Emma Johansen", position: "Operations Lead", status: "Negotiation", lastContact: "2026-10-19", summary: "GDPR documentation is the active blocker in this negotiation." },
  { id: "vestland", company: "Vestland Kraft", contact: "Jonas Aas", position: "Prosjektdirektør", status: "Going quiet", lastContact: "2026-09-30", quiet: true, summary: "No contact for 21 days. Jonas expected to make a decision during October." },
];

export const emails: Email[] = [
  { id: "email-1", sender: "Kari Solberg", customerId: "nordlys", date: "2026-10-19", language: "Norwegian", direction: "Incoming", subject: "Revidert tilbud før styremøtet", quote: "Kan du sende oss et revidert tilbud innen fredag? Styret skal behandle saken mandag.", body: "Hei Olav,\n\nTakk for et godt møte. Kan du sende oss et revidert tilbud innen fredag? Styret skal behandle saken mandag.\n\nVennlig hilsen\nKari", actionable: true },
  { id: "email-2", sender: "Olav", recipient: "Kari Solberg", customerId: "nordlys", date: "2026-10-19", language: "Norwegian", direction: "Sent", subject: "Prisoversikt", quote: "Jeg sender deg en oppdatert prisoversikt i morgen.", body: "Hei Kari,\n\nJeg sender deg en oppdatert prisoversikt i morgen.\n\nOlav", actionable: true },
  { id: "email-3", sender: "Erik Lund", customerId: "fjordtech", date: "2026-10-21", language: "English", direction: "Incoming", subject: "DPA needed for signature", quote: "Our legal team needs the data processing agreement before we can sign. Can you get that to us by Monday?", body: "Hi Olav,\n\nOur legal team needs the data processing agreement before we can sign. Can you get that to us by Monday?\n\nErik", actionable: true },
  { id: "email-4", sender: "Ingrid Haugen", customerId: "havbris", date: "2026-10-16", language: "Norwegian", direction: "Incoming", subject: "Demo for innkjøpsteamet", quote: "Vi trenger en demo for innkjøpsteamet. Passer det i neste uke?", body: "Hei,\n\nVi trenger en demo for innkjøpsteamet. Passer det i neste uke?\n\nIngrid", actionable: true },
  { id: "email-5", sender: "Tom Eriksen", customerId: "bergen", date: "2026-10-12", language: "English", direction: "Incoming", subject: "After Posidonia", quote: "Let's reconnect after the Posidonia trade fair, I'll be back late November.", body: "Thanks Olav. Let's reconnect after the Posidonia trade fair, I'll be back late November.\n\nTom", actionable: true },
  { id: "email-6", sender: "Marte Dahl", customerId: "oslo", date: "2026-10-20", language: "Norwegian", direction: "Incoming", subject: "Oktoberfaktura", quote: "Fakturaen for oktober ser feil ut, kan du sjekke den?", body: "Hei Olav,\n\nFakturaen for oktober ser feil ut, kan du sjekke den?\n\nMarte", actionable: true },
  { id: "email-7", sender: "Henrik Moen", customerId: "telemark", date: "2026-10-18", language: "English", direction: "Incoming", subject: "Pilot success metrics", quote: "Please share the pilot success metrics so we can brief our steering committee on 5 November.", body: "Hi Olav,\n\nPlease share the pilot success metrics so we can brief our steering committee on 5 November.\n\nHenrik", actionable: true },
  { id: "email-8", sender: "Sofie Berg", customerId: "aurora", date: "2026-10-09", language: "English", direction: "Incoming", subject: "Retail case study", quote: "Interesting, send me a case study from a similar retailer.", body: "Interesting, send me a case study from a similar retailer.\n\nSofie", actionable: true },
  { id: "email-9", sender: "Lars Pettersen", customerId: "kystveien", date: "2026-10-15", language: "Norwegian", direction: "Incoming", subject: "Avtalen", quote: "Ring meg når du har sett på avtalen.", body: "Hei Olav,\n\nRing meg når du har sett på avtalen.\n\nLars", actionable: true },
  { id: "email-10", sender: "Nora Strand", customerId: "svalbard", date: "2026-10-21", language: "English", direction: "Incoming", subject: "Referral — intro call", quote: "We found you via a referral. Could we set up an intro call this week?", body: "Hi Olav,\n\nWe found you via a referral. Could we set up an intro call this week?\n\nNora Strand\nCOO\nSvalbard Logistics", actionable: true },
  { id: "email-11", sender: "Anders Vik", customerId: "lysefjord", date: "2026-10-17", language: "Norwegian", direction: "Incoming", subject: "Fornyelse av kontrakt", quote: "Kontrakten går ut 31. desember. Vi vil gjerne diskutere vilkår for fornyelse.", body: "Hei,\n\nKontrakten går ut 31. desember. Vi vil gjerne diskutere vilkår for fornyelse.\n\nAnders", actionable: true },
  { id: "email-12", sender: "Emma Johansen", customerId: "nordic", date: "2026-10-19", language: "English", direction: "Incoming", subject: "GDPR confirmation", quote: "Can you confirm GDPR compliance in writing?", body: "Hi Olav,\n\nCan you confirm GDPR compliance in writing?\n\nEmma", actionable: true },
  { id: "email-13", sender: "Jonas Aas", customerId: "vestland", date: "2026-09-30", language: "Norwegian", direction: "Incoming", subject: "Status", quote: "Vi har ikke bestemt oss ennå, hør fra oss i oktober.", body: "Hei Olav,\n\nVi har ikke bestemt oss ennå, hør fra oss i oktober.\n\nJonas", actionable: true },
  { id: "email-14", sender: "SaaS vendor newsletter", date: "2026-10-20", language: "English", direction: "Incoming", subject: "Your weekly digest", quote: "Your weekly digest...", body: "Your weekly digest... Product updates, events and community news.", actionable: false },
  { id: "email-15", sender: "Kari Solberg", customerId: "nordlys", date: "2026-10-21", language: "Norwegian", direction: "Incoming", subject: "Flytte møtet", quote: "Hyggelig å høre. Kan vi flytte møtet fra torsdag til fredag kl. 10?", body: "Hei Olav,\n\nHyggelig å høre. Kan vi flytte møtet fra torsdag til fredag kl. 10?\n\nKari", actionable: true },
];

export const meetings: Meeting[] = [
  { id: "meeting-a", title: "Fjordtech: pricing call", date: "2026-10-20", duration: 32, language: "English", participants: ["Olav", "Erik Lund"], customerId: "fjordtech", calendarEventId: "event-fjord", summary: "Erik is positive but needs board approval.", decisions: ["Pilot first", "Three-month term"], actionItems: [
    { id: "a1", text: "Send revised pricing by Thursday, October 22", owner: "Olav" }, { id: "a2", text: "Introduce the CFO", owner: "Erik Lund" }, { id: "a3", text: "Share the security whitepaper", owner: "Olav" },
  ] },
  { id: "meeting-b", title: "Nordlys Bygg: oppfølging", date: "2026-10-19", duration: 24, language: "Norwegian", participants: ["Olav", "Kari Solberg"], customerId: "nordlys", calendarEventId: "event-nordlys", summary: "Kari ønsker integrasjon mot Tripletex.", sentiment: "Positive", actionItems: [
    { id: "b1", text: "Sjekk API-støtte for Tripletex", owner: "Olav" }, { id: "b2", text: "Send prosjektliste", owner: "Kari Solberg" }, { id: "b3", text: "Send tilbud innen fredag", owner: "Olav", convertedTaskId: "disc-1" },
  ] },
  { id: "meeting-c", title: "Telemark Energi: pilot review", date: "2026-10-18", duration: 41, language: "English", participants: ["Olav", "Henrik Moen", "1 colleague"], customerId: "telemark", calendarEventId: "event-telemark", summary: "The pilot is going well.", concerns: ["Data export", "User training schedule"], actionItems: [
    { id: "c1", text: "Send the training plan", owner: "Olav", relatedTaskId: "manual-4" }, { id: "c2", text: "Schedule a follow-up before November 5", owner: "Olav" },
  ] },
];

const emailSource = (id: string) => {
  const email = emails.find((item) => item.id === id)!;
  return { type: "email" as const, id, label: `Email from ${email.sender}`, excerpt: email.quote };
};
const discovered: Task[] = [
  { id: "disc-1", title: "Send revidert tilbud til Nordlys Bygg", customerId: "nordlys", due: "2026-10-23", status: "pending", origin: "AI", confidence: 96, category: "Customer request + deadline", owner: "Olav", sources: [emailSource("email-1"), { type: "meeting", id: "meeting-b", label: "Nordlys Bygg meeting", excerpt: "Olav sender tilbud innen fredag." }], createdAt: "2026-10-19" },
  { id: "disc-2", title: "Send oppdatert prisoversikt til Kari", customerId: "nordlys", due: "2026-10-20", status: "pending", origin: "AI", confidence: 91, category: "Promise made by you", owner: "Olav", sources: [emailSource("email-2")], createdAt: "2026-10-19" },
  { id: "disc-3", title: "Send DPA to Fjordtech legal", customerId: "fjordtech", due: "2026-10-26", status: "pending", origin: "AI", confidence: 94, category: "Customer request + deadline", owner: "Olav", sources: [emailSource("email-3")], createdAt: "2026-10-21" },
  { id: "disc-4", title: "Foreslå demo-tidspunkt for Havbris innkjøpsteam", customerId: "havbris", due: "2026-10-23", status: "pending", origin: "AI", confidence: 88, category: "Meeting request", owner: "Olav", sources: [emailSource("email-4")], createdAt: "2026-10-16" },
  { id: "disc-5", title: "Follow up with Tom Eriksen", customerId: "bergen", due: "2026-11-30", status: "pending", origin: "AI", confidence: 72, category: "Implied follow-up", owner: "Olav", sources: [emailSource("email-5")], createdAt: "2026-10-12" },
  { id: "disc-6", title: "Sjekk oktoberfaktura for Oslo Design Collective", customerId: "oslo", due: "2026-10-22", status: "pending", origin: "AI", confidence: 93, category: "Customer request", owner: "Olav", duplicateOf: "manual-3", sources: [emailSource("email-6")], createdAt: "2026-10-20" },
  { id: "disc-7", title: "Send pilot success metrics to Telemark", customerId: "telemark", due: "2026-11-04", status: "pending", origin: "AI", confidence: 95, category: "Deliverable with deadline", owner: "Olav", sources: [emailSource("email-7")], createdAt: "2026-10-18" },
  { id: "disc-8", title: "Send retail case study to Sofie Berg", customerId: "aurora", status: "pending", origin: "AI", confidence: 90, category: "Stale customer request", owner: "Olav", staleDays: 12, sources: [emailSource("email-8")], createdAt: "2026-10-09" },
  { id: "disc-9", title: "Ring Lars Pettersen om avtalen", customerId: "kystveien", due: "2026-10-22", status: "pending", origin: "AI", confidence: 85, category: "Follow-up commitment", owner: "Olav", sources: [emailSource("email-9")], createdAt: "2026-10-15" },
  { id: "disc-10", title: "Book intro call with Nora Strand", customerId: "svalbard", due: "2026-10-23", status: "pending", origin: "AI", confidence: 97, category: "New customer request", owner: "Olav", sources: [emailSource("email-10")], staged: true, createdAt: "2026-10-21" },
  { id: "disc-11", title: "Start fornyelsessamtale med Lysefjord Hotels", customerId: "lysefjord", due: "2026-11-06", status: "pending", origin: "AI", confidence: 92, category: "Contract renewal opportunity", owner: "Olav", sources: [emailSource("email-11")], createdAt: "2026-10-17" },
  { id: "disc-12", title: "Send GDPR confirmation to Nordic Pulse", customerId: "nordic", status: "pending", origin: "AI", confidence: 89, category: "Customer request", owner: "Olav", duplicateOf: "manual-1", sources: [emailSource("email-12")], createdAt: "2026-10-19" },
  { id: "disc-13", title: "Sjekk inn med Jonas Aas", customerId: "vestland", due: "2026-10-21", status: "pending", origin: "AI", confidence: 78, category: "Implied follow-up", owner: "Olav", sources: [emailSource("email-13")], createdAt: "2026-09-30" },
  { id: "disc-15", title: "Flytt møte med Nordlys Bygg til fredag 10:00", customerId: "nordlys", due: "2026-10-23", status: "pending", origin: "AI", category: "Calendar change request", owner: "Olav", sources: [emailSource("email-15")], staged: true, createdAt: "2026-10-21" },
];

const manualTasks: Task[] = [
  { id: "manual-1", title: "GDPR doc for Nordic Pulse", customerId: "nordic", due: "2026-10-23", status: "approved", origin: "Manual", category: "Manual", owner: "Olav", sources: [], createdAt: "2026-10-16" },
  { id: "manual-2", title: "Prepare Q4 pipeline review", due: "2026-10-30", status: "approved", origin: "Manual", category: "Internal", owner: "Olav", sources: [], createdAt: "2026-10-15" },
  { id: "manual-3", title: "Invoice check: Oslo Design", customerId: "oslo", due: "2026-10-22", status: "approved", origin: "Manual", category: "Manual", owner: "Maja Nilsen", sources: [], createdAt: "2026-10-20" },
  { id: "manual-4", title: "Call Telemark about training", customerId: "telemark", due: "2026-10-24", status: "approved", origin: "Manual", category: "Manual", owner: "Maja Nilsen", sources: [], createdAt: "2026-10-18" },
];

export const events: CalendarEvent[] = [
  { id: "event-fjord", title: "Fjordtech follow-up", date: "2026-10-21", time: "14:00", duration: 30, type: "confirmed", customerId: "fjordtech" },
  { id: "event-nordlys", title: "Nordlys Bygg meeting", date: "2026-10-22", time: "10:00", duration: 60, type: "confirmed", customerId: "nordlys" },
  { id: "event-internal", title: "Internal product review", date: "2026-10-22", time: "13:00", duration: 60, type: "confirmed" },
  { id: "slot-nordlys", title: "Prepare Nordlys proposal", date: "2026-10-22", time: "15:00", duration: 90, type: "suggested", customerId: "nordlys" },
  { id: "event-telemark", title: "Telemark Energi check-in", date: "2026-10-26", time: "09:00", duration: 30, type: "confirmed", customerId: "telemark" },
  { id: "event-lysefjord", title: "Lysefjord Hotels renewal call", date: "2026-10-28", time: "11:00", duration: 30, type: "proposed", customerId: "lysefjord" },
];

export function createInitialState(): DemoState {
  return {
    tasks: [...manualTasks.map((task) => ({ ...task })), ...discovered.map((task) => ({ ...task, sources: task.sources.map((source) => ({ ...source })) }))],
    customers: customers.map((customer) => ({ ...customer })),
    events: events.map((event) => ({ ...event })),
    meetings: meetings.map((meeting) => ({ ...meeting, actionItems: meeting.actionItems.map((item) => ({ ...item })) })),
    role: "Olav",
    scanComplete: false,
    connections: { Gmail: true, Outlook: false, Calendar: true, Meetings: true },
    preferences: { taskCalendarEntries: true, attentionSummaries: true },
  };
}

export const seedStats = { customers: customers.length, emails: emails.length, meetings: meetings.length, manualTasks: manualTasks.length };
