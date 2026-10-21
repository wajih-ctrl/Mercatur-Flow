"use client";

import { useState } from "react";
import { KeyRound, Plus, Settings2, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge, Button, Modal, PageHeader } from "@/components/ui";
import { useDemo } from "@/stores/demo-store";
import { t } from "@/lib/i18n";
import type { WorkspaceUser } from "@/lib/types";

type UserRole = WorkspaceUser["role"];

const scopeForRole: Record<UserRole, string> = {
  "Owner / Account manager": "All customers",
  "Sales team member": "Assigned accounts",
  Administrator: "Workspace settings",
};

export default function AdminPage() {
  const demo = useDemo();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Sales team member");
  const [error, setError] = useState("");

  const previewRole = (nextRole: "Olav" | "Sales" | "Admin") => {
    demo.setRole(nextRole);
    router.push(nextRole === "Admin" ? "/admin" : nextRole === "Sales" ? "/tasks" : "/today");
  };
  const close = () => {
    setOpen(false);
    setError("");
  };
  const createUser = () => {
    if (!name.trim()) return setError(t(demo.language,"nameRequired"));
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError(t(demo.language,"emailRequired"));
    demo.addUser({ name: name.trim(), email: email.trim(), role, scope: scopeForRole[role] });
    setName("");
    setEmail("");
    setRole("Sales team member");
    close();
  };

  return <>
    <PageHeader eyebrow={t(demo.language,"administration")} title={t(demo.language,"workspaceTitle")} description={t(demo.language,"adminDescription")} actions={<><Badge tone="accent"><ShieldCheck size={12}/>{t(demo.language,"demoWorkspace")}</Badge><Button onClick={() => setOpen(true)}><UserPlus size={16}/>{t(demo.language,"addUser")}</Button></>} />
    <div className="admin-stats">
      <div className="admin-card surface"><UsersRound size={18}/><strong>{demo.users.length}</strong><span>{t(demo.language,"teamMembers")}</span></div>
      <div className="admin-card surface"><KeyRound size={18}/><strong>{Object.values(demo.connections).filter(Boolean).length}</strong><span>{t(demo.language,"mockSources")}</span></div>
      <div className="admin-card surface"><Settings2 size={18}/><strong>{demo.scanComplete?t(demo.language,"scanned"):t(demo.language,"ready")}</strong><span>{t(demo.language,"demoStatus")}</span></div>
    </div>
    <div className="surface data-table-wrap admin-table-wrap"><table className="data-table admin-team-table"><thead><tr><th>{t(demo.language,"teamMember")}</th><th>{t(demo.language,"email")}</th><th>{t(demo.language,"role")}</th><th>{t(demo.language,"scope")}</th><th>{t(demo.language,"status")}</th></tr></thead><tbody>{demo.users.map(member=><tr key={member.id}><td data-label={t(demo.language,"teamMember")}><span className="cell-title">{member.name}</span></td><td data-label={t(demo.language,"email")}>{member.email}</td><td data-label={t(demo.language,"role")}>{member.role}</td><td data-label={t(demo.language,"scope")}>{member.scope}</td><td data-label={t(demo.language,"status")}><Badge tone="success">{t(demo.language,"active")}</Badge></td></tr>)}</tbody></table></div>
    <section className="privacy surface"><div className="section-title"><div><h2>{t(demo.language,"rolePreview")}</h2><p>{t(demo.language,"rolePreviewDescription")}</p></div></div><div className="page-actions"><Button variant={demo.role==="Olav"?"primary":"secondary"} onClick={()=>previewRole("Olav")}>Olav</Button><Button variant={demo.role==="Sales"?"primary":"secondary"} onClick={()=>previewRole("Sales")}>{t(demo.language,"salesMember")}</Button><Button variant={demo.role==="Admin"?"primary":"secondary"} onClick={()=>previewRole("Admin")}>Admin</Button></div></section>
    <Modal open={open} onOpenChange={(next) => next ? setOpen(true) : close()} title={t(demo.language,"addUserTitle")} description={t(demo.language,"addUserDescription")}>
      <div className="field"><label htmlFor="new-user-name">{t(demo.language,"fullName")}</label><input id="new-user-name" value={name} onChange={(event)=>{setName(event.target.value);setError("")}} placeholder="Maja Nilsen" autoFocus/></div>
      <div className="field"><label htmlFor="new-user-email">{t(demo.language,"emailAddress")}</label><input id="new-user-email" type="email" value={email} onChange={(event)=>{setEmail(event.target.value);setError("")}} placeholder="maja@mercatur.no"/></div>
      <div className="form-row"><div className="field"><label htmlFor="new-user-role">{t(demo.language,"userRole")}</label><select id="new-user-role" value={role} onChange={(event)=>setRole(event.target.value as UserRole)}><option>Owner / Account manager</option><option>Sales team member</option><option>Administrator</option></select></div><div className="field"><label>{t(demo.language,"accountScope")}</label><input value={scopeForRole[role]} readOnly/></div></div>
      {error&&<div className="form-error" role="alert">{error}</div>}
      <div className="dialog-actions"><Button variant="secondary" onClick={close}>{t(demo.language,"cancel")}</Button><Button onClick={createUser}><Plus size={15}/>{t(demo.language,"createUser")}</Button></div>
    </Modal>
  </>;
}
