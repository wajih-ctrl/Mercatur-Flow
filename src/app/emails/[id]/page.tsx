import { EmailView } from "@/components/email-view";
export default async function EmailDetail({params}:{params:Promise<{id:string}>}){const {id}=await params;return <EmailView initialId={id}/>}
