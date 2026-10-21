export type Role = "Olav" | "Sales" | "Admin";
export type CustomerStatus = "Active deal" | "Negotiation" | "Active customer" | "Warm lead" | "New lead" | "Renewal due" | "Going quiet";

export interface Customer {
  id: string;
  company: string;
  contact: string;
  position: string;
  status: CustomerStatus;
  statusDetail?: string;
  lastContact: string;
  quiet?: boolean;
  staged?: boolean;
  summary: string;
}

export interface Email {
  id: string;
  sender: string;
  recipient?: string;
  customerId?: string;
  date: string;
  language: "Norwegian" | "English";
  direction: "Incoming" | "Sent";
  subject: string;
  quote: string;
  body: string;
  actionable: boolean;
}

export interface SourceRef {
  type: "email" | "meeting";
  id: string;
  label: string;
  excerpt: string;
}

export interface Task {
  id: string;
  title: string;
  customerId?: string;
  due?: string;
  status: "pending" | "approved" | "done" | "dismissed";
  origin: "AI" | "Manual";
  confidence?: number;
  category: string;
  owner: string;
  sources: SourceRef[];
  duplicateOf?: string;
  relatedTo?: string;
  staleDays?: number;
  staged?: boolean;
  createdAt: string;
}

export interface ActionItem { id: string; text: string; owner: string; convertedTaskId?: string; relatedTaskId?: string; }
export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  language: "Norwegian" | "English";
  participants: string[];
  customerId: string;
  summary: string;
  decisions?: string[];
  concerns?: string[];
  sentiment?: string;
  calendarEventId?: string;
  actionItems: ActionItem[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: "confirmed" | "task" | "proposed" | "suggested";
  customerId?: string;
  taskId?: string;
}

export interface DemoState {
  tasks: Task[];
  customers: Customer[];
  events: CalendarEvent[];
  meetings: Meeting[];
  role: Role;
  scanComplete: boolean;
  connections: Record<string, boolean>;
  preferences: {
    taskCalendarEntries: boolean;
    attentionSummaries: boolean;
  };
}
