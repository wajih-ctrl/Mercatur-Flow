import { DiscoveryWorkspace } from "@/components/discovery-workspace";
export default async function DiscoverDetail({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <DiscoveryWorkspace initialId={id}/>; }
