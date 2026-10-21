import { DiscoveryWorkspace } from "@/components/discovery-workspace";
export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const initialFilter = filter === "overdue" || filter === "duplicates" ? filter : "all";
  return <DiscoveryWorkspace initialFilter={initialFilter}/>;
}
