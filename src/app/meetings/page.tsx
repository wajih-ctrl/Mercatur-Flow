"use client";
import Link from "next/link";
import { ArrowRight, Clock3, Languages, MessageSquareText, UsersRound } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { formatDate } from "@/lib/utils";

export default function MeetingsPage(){const demo=useDemo();return <><PageHeader eyebrow="Conversation intelligence" title="Meetings" description="Structured notes, decisions, and accountable action items from every customer call."/><div className="meeting-grid">{demo.meetings.map(meeting=>{const customer=demo.customers.find(c=>c.id===meeting.customerId);return <Link className="meeting-card surface" href={`/meetings/${meeting.id}`} key={meeting.id}><div className="meeting-meta"><span><Clock3 size={12}/> {meeting.duration} min</span><Badge><Languages size={10}/>{meeting.language}</Badge></div><h3>{meeting.title}</h3><p>{meeting.summary}</p><div className="discovery-meta"><Badge tone="accent"><MessageSquareText size={10}/>{meeting.actionItems.length} action items</Badge><Badge><UsersRound size={10}/>{meeting.participants.length}</Badge></div><div className="customer-foot"><span>{customer?.company} · {formatDate(meeting.date,true)}</span><ArrowRight size={14}/></div></Link>})}</div></>}
