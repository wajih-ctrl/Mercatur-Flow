import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
export default function NotFound(){return <div className="not-found surface"><EmptyState icon={<Compass/>} title="That record isn’t in this demo" description="The link may be outdated or the record may have been removed during this session." action={<Link href="/today"><Button><ArrowLeft size={15}/>Back to Today</Button></Link>}/></div>}
