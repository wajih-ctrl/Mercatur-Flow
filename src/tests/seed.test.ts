import { describe, expect, it } from "vitest";
import { createInitialState, customers, emails, meetings, seedStats } from "@/data/seed";
import { DEMO_TODAY } from "@/lib/utils";

describe("deterministic Mercatur seed", () => {
  it("contains the required source records", () => {
    expect(seedStats).toEqual({ customers: 12, emails: 15, meetings: 3, manualTasks: 4 });
    expect(customers).toHaveLength(12); expect(emails).toHaveLength(15); expect(meetings).toHaveLength(3);
    expect(DEMO_TODAY).toBe("2026-10-21");
    const state = createInitialState();
    expect(state.preferences).toEqual({ taskCalendarEntries: true, attentionSummaries: true });
    expect(state.language).toBe("en");
    expect(state.users).toHaveLength(3);
  });
  it("preserves required discovery scenarios", () => {
    const state = createInitialState();
    expect(state.tasks.find(t => t.id === "disc-1")?.sources).toHaveLength(2);
    expect(state.tasks.find(t => t.id === "disc-2")?.due).toBe("2026-10-20");
    expect(state.tasks.find(t => t.id === "disc-3")?.due).toBe("2026-10-26");
    expect(state.tasks.find(t => t.id === "disc-5")?.category).toBe("Implied follow-up");
    expect(emails.find(e => e.id === "email-14")?.actionable).toBe(false);
    expect(state.tasks.find(t => t.id === "disc-15")?.confidence).toBeUndefined();
    expect(meetings.find(m => m.id === "meeting-c")?.participants).toEqual(["Olav", "Henrik Moen", "1 colleague"]);
  });
  it("starts with Svalbard staged and no duplicate customer", () => {
    const state = createInitialState();
    expect(state.customers.filter(c => c.id === "svalbard")).toHaveLength(1);
    expect(state.customers.find(c => c.id === "svalbard")?.staged).toBe(true);
    expect(state.customers.find(c => c.id === "svalbard")?.createdFromSignature).toBe(true);
    expect(state.customers.find(c => c.id === "lysefjord")).toMatchObject({ status: "Active customer", statusDetail: "Renewal due" });
    expect(state.tasks.filter(t => t.staged).map(t => t.id).sort()).toEqual(["disc-10", "disc-15"]);
  });
  it("preserves the deliberate demo moments and role assignments", () => {
    const state = createInitialState();
    expect(state.customers.filter(customer => customer.quiet).map(customer => customer.id).sort()).toEqual(["aurora", "bergen", "vestland"]);
    expect(state.tasks.filter(task => task.duplicateOf).map(task => task.id).sort()).toEqual(["disc-12", "disc-6"]);
    expect(state.tasks.filter(task => task.owner === "Maja Nilsen").map(task => task.id).sort()).toEqual(["manual-3", "manual-4"]);
    expect(state.events.find(event => event.id === "slot-nordlys")).toMatchObject({ date: "2026-10-22", time: "15:00", type: "suggested" });
    expect(state.meetings.find(meeting => meeting.id === "meeting-b")?.actionItems.find(action => action.id === "b3")?.convertedTaskId).toBe("disc-1");
    expect(state.meetings.find(meeting => meeting.id === "meeting-c")?.actionItems.find(action => action.id === "c1")?.relatedTaskId).toBe("manual-4");
  });
  it("every discovery has valid immutable source references", () => {
    const state = createInitialState();
    const emailIds = new Set(emails.map(e => e.id)); const meetingIds = new Set(meetings.map(m => m.id));
    for (const task of state.tasks.filter(t => t.origin === "AI")) {
      expect(task.sources.length).toBeGreaterThan(0);
      for (const source of task.sources) expect(source.type === "email" ? emailIds.has(source.id) : meetingIds.has(source.id)).toBe(true);
    }
  });
  it("places every scheduled approved task on the calendar at its selected time", () => {
    const state = createInitialState();
    for (const task of state.tasks.filter(task => task.status === "approved" && task.due)) {
      expect(task.time).toMatch(/^\d{2}:\d{2}$/);
      expect(state.events.find(event => event.taskId === task.id)).toMatchObject({ date: task.due, time: task.time, type: "task" });
    }
  });
});
