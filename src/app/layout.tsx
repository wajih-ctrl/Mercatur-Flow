import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/stores/demo-store";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "Mercatur Flow", description: "AI-assisted customer commitments, with you in control." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><DemoProvider><AppShell>{children}</AppShell></DemoProvider></body></html>;
}
