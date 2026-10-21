import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const DEMO_TODAY = "2026-10-21";
export function formatDate(value?: string, compact = false) {
  if (!value) return "No sourced deadline";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", compact ? { day: "numeric", month: "short" } : { weekday: "short", day: "numeric", month: "short" }).format(date);
}
export function isOverdue(value?: string) { return Boolean(value && value < DEMO_TODAY); }
export function initials(name: string) { return name.split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase(); }
