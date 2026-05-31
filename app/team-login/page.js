import PortalLogin from "@/components/public/PortalLogin";
import { STUDIO_PORTAL_URL } from "@/lib/siteContent";

export const metadata = {
  title: "Team Login"
};

export default function TeamLoginPage() {
  return (
    <PortalLogin
      eyebrow="Internal team only"
      title="Team Studio Login"
      description="This login is for approved B Socio team members. Team members can view assigned clients, assigned work, internal discussions, client discussions, deadlines, and uploads."
      redirectTo="/dashboard/team"
      studioHref={STUDIO_PORTAL_URL}
      secondaryHref="/"
    />
  );
}
