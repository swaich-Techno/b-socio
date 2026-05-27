import PortalLogin from "@/components/public/PortalLogin";
import { STUDIO_PORTAL_URL } from "@/lib/siteContent";

export const metadata = {
  title: "Super Admin Login"
};

export default function SuperAdminLoginPage() {
  return (
    <PortalLogin
      eyebrow="Super admin only"
      title="Manage the B Socio website, users, services, projects, and chats"
      description="Super admin access is private. Use it to manage public website content, landing page images, contact details, services, users, client projects, and all discussions."
      redirectTo="/dashboard/super-admin"
      studioHref={STUDIO_PORTAL_URL}
      secondaryHref="/"
    />
  );
}
