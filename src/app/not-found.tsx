"use client";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { tr } from "@/lib/i18n";
export default function NotFound(){const demo=useDemo();const c=(english:string,norwegian:string)=>tr(demo.language,english,norwegian);return <div className="not-found surface"><EmptyState icon={<Compass/>} title={c("That record isn’t in this demo","Denne oppføringen finnes ikke i demoen")} description={c("The link may be outdated or the record may have been removed during this session.","Lenken kan være utdatert, eller oppføringen kan ha blitt fjernet i denne økten.")} action={<Link href="/today"><Button><ArrowLeft size={15}/>{c("Back to Today","Tilbake til I dag")}</Button></Link>}/></div>}
