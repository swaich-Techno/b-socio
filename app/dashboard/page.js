import { redirect } from "next/navigation";
import { getSessionUser, isOwnerAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardRouterPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.status === "pending") redirect("/pending");
  if (user.status === "rejected" || user.status === "suspended") redirect("/inactive");
  if (user.role === "Client") redirect("/dashboard/client");
  if (isOwnerAdmin(user)) redirect("/dashboard/super-admin");
  redirect("/dashboard/team");
}
