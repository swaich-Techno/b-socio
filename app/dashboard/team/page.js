import { redirect } from "next/navigation";
import { CalendarDays, FolderKanban, MessageCircle, Upload, Users } from "lucide-react";
import Button from "@/components/Button";
import { accessibleClientIds } from "@/lib/access";
import { getSessionUser, isOwnerAdmin } from "@/lib/auth";
import Client from "@/models/Client";
import Task from "@/models/Task";

export const dynamic = "force-dynamic";

export default async function TeamDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "Client") redirect("/dashboard/client");
  if (isOwnerAdmin(user)) redirect("/dashboard/super-admin");

  const clientIds = await accessibleClientIds(user);
  const [clients, tasks] = await Promise.all([
    Client.find({ _id: { $in: clientIds } }).select("businessName industry status packageName renewalDate").sort({ updatedAt: -1 }).limit(8).lean(),
    Task.find({ clientId: { $in: clientIds }, status: { $ne: "Completed" } }).populate("clientId", "businessName").sort({ dueDate: 1 }).limit(8).lean()
  ]);

  return (
    <div className="page-container">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Team Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Assigned clients and work</h1>
          <p className="mt-2 text-slate-500">See your clients, tasks, internal discussions, project updates, and uploads.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/chat" className="gap-2"><MessageCircle size={17} /> Internal Discussion</Button>
          <Button href="/tasks" variant="secondary" className="gap-2"><CalendarDays size={17} /> Deadlines</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          [Users, "Assigned Clients", clients.length],
          [FolderKanban, "Open Tasks", tasks.length],
          [MessageCircle, "Client Discussions", "Chat"],
          [Upload, "Work Uploads", "Files"]
        ].map(([Icon, label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-cyan-600" size={24} />
            <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Assigned Clients</h2>
          <div className="mt-4 grid gap-3">
            {clients.map((client) => (
              <a key={client._id.toString()} href={`/clients/${client._id}`} className="rounded-xl bg-slate-50 p-4 text-sm hover:bg-slate-100">
                <p className="font-black text-slate-950">{client.businessName}</p>
                <p className="mt-1 text-slate-500">{client.industry} - {client.status} - {client.packageName || "Package not set"}</p>
              </a>
            ))}
            {!clients.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No assigned clients yet.</p> : null}
          </div>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Assigned Tasks</h2>
          <div className="mt-4 grid gap-3">
            {tasks.map((task) => (
              <a key={task._id.toString()} href="/tasks" className="rounded-xl bg-slate-50 p-4 text-sm hover:bg-slate-100">
                <p className="font-black text-slate-950">{task.title}</p>
                <p className="mt-1 text-slate-500">{task.clientId?.businessName || "Client"} - {task.status}</p>
              </a>
            ))}
            {!tasks.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No open assigned tasks.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
