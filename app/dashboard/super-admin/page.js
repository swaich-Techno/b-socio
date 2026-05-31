import { redirect } from "next/navigation";
import { ArrowUpRight, Globe2, Images, LayoutDashboard, MessageCircle, Settings, ShieldCheck, Users } from "lucide-react";
import Button from "@/components/Button";
import { getSessionUser, isOwnerAdmin } from "@/lib/auth";
import { AR_STUDIO_URL, STUDIO_PORTAL_URL } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

const adminSections = [
  ["Website Content Manager", "Change homepage hero images, service images, QR/AR images, banners, CTA text, and homepage copy.", "/settings", Images],
  ["Contact Manager", "Update email, WhatsApp number, address, social links, and contact form receiving email.", "/settings#contact-manager", Globe2],
  ["Services Manager", "Add, edit, delete, and describe services shown on the public Services page.", "/settings#services-manager", Settings],
  ["User Manager", "Create, approve, block, or remove team members and client portal users.", "/settings#user-manager", Users],
  ["Chat Manager", "View internal team discussions and client discussions, reply to chats, and monitor activity.", "/chat", MessageCircle],
  ["Client Project Manager", "Add projects, assign team members, update statuses, upload files, and track approvals.", "/clients", LayoutDashboard]
];

export default async function SuperAdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!isOwnerAdmin(user)) redirect("/dashboard");

  return (
    <div className="page-container">
      <div className="rounded-2xl bg-slate-950 p-7 text-white shadow-soft md:p-9">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-300"><ShieldCheck size={17} /> Super Admin Dashboard</p>
        <h1 className="mt-4 text-3xl font-black md:text-5xl">B Socio control center</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Manage the public website, services, clients, team, chats, approvals, and projects from one private dashboard.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/settings" className="gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Website Manager <ArrowUpRight size={17} /></Button>
          <Button href={STUDIO_PORTAL_URL} variant="secondary" className="gap-2 bg-white text-slate-950 hover:bg-slate-100">Internal Studio Portal <ArrowUpRight size={17} /></Button>
          <Button href={AR_STUDIO_URL} variant="ghost" className="border border-white/20 text-white hover:bg-white/10">AR Studio</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map(([title, text, href, Icon]) => (
          <a key={title} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-soft">
            <Icon className="text-cyan-600" size={26} />
            <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
