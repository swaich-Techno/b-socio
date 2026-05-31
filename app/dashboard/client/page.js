import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, FileImage, MessageCircle, Phone, Upload } from "lucide-react";
import Button from "@/components/Button";
import { getSessionUser } from "@/lib/auth";
import Client from "@/models/Client";
import ClientApproval from "@/models/ClientApproval";
import Task from "@/models/Task";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/client-login");
  if (user.role !== "Client") redirect("/dashboard");

  const assignedIds = user.assignedClients || [];
  const [clients, tasks, approvals] = await Promise.all([
    Client.find({ _id: { $in: assignedIds } }).populate("assignedTeamMembers", "name role").lean(),
    Task.find({ clientId: { $in: assignedIds } }).populate("clientId", "businessName").sort({ updatedAt: -1 }).limit(8).lean(),
    ClientApproval.find({ clientId: { $in: assignedIds } }).populate("clientId", "businessName").sort({ updatedAt: -1 }).limit(8).lean()
  ]);

  const primaryClient = clients[0];

  return (
    <div className="page-container">
      <div className="rounded-2xl bg-slate-950 p-7 text-white shadow-soft md:p-9">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Client Portal</p>
        <h1 className="mt-4 text-3xl font-black md:text-5xl">{primaryClient?.businessName || "Your B Socio Project"}</h1>
        <p className="mt-4 max-w-3xl text-slate-300">View your project status, services, assigned team, updates, uploaded work, requirements, approvals, and messages.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/chat" className="gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300"><MessageCircle size={17} /> Chat with B Socio</Button>
          <Button href="/contact" variant="secondary" className="gap-2 bg-white text-slate-950 hover:bg-slate-100"><Phone size={17} /> Contact Support</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          [Clock3, "Project Status", primaryClient?.status || "Onboarding"],
          [CheckCircle2, "Assigned Services", primaryClient?.packageName || "Digital Marketing"],
          [FileImage, "Creative Approvals", approvals.length],
          [Upload, "Pending Requirements", tasks.filter((task) => task.status !== "Completed").length]
        ].map(([Icon, label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-cyan-600" size={24} />
            <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Assigned Team</h2>
          <div className="mt-4 grid gap-3">
            {(primaryClient?.assignedTeamMembers || []).map((member) => (
              <div key={member._id.toString()} className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-slate-950">{member.name}</p>
                <p className="mt-1 text-slate-500">{member.role}</p>
              </div>
            ))}
            {!primaryClient?.assignedTeamMembers?.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Your assigned team will appear here.</p> : null}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Project Updates</h2>
          <div className="mt-4 grid gap-3">
            {tasks.map((task) => (
              <div key={task._id.toString()} className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-slate-950">{task.title}</p>
                <p className="mt-1 text-slate-500">{task.clientId?.businessName || "Project"} - {task.status}</p>
              </div>
            ))}
            {!tasks.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Project updates and pending requirements will appear here.</p> : null}
          </div>
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="text-xl font-black text-slate-950">Creative Approval Section</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {approvals.map((approval) => (
              <div key={approval._id.toString()} className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-black text-slate-950">{approval.title || "Creative approval"}</p>
                <p className="mt-1 text-slate-500">{approval.clientId?.businessName || "Project"} - {approval.status}</p>
              </div>
            ))}
            {!approvals.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Uploaded work samples, campaign plans, and creative approvals will appear here.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
