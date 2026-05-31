import PortalLogin from "@/components/public/PortalLogin";

export const metadata = {
  title: "Client Login"
};

export default function ClientLoginPage() {
  return (
    <PortalLogin
      eyebrow="Client Portal"
      title="Track your project, approvals, files, and messages"
      description="B Socio clients can log in to view project status, assigned services, uploaded files, creative approvals, pending requirements, completed work, and discussion history."
      expectedRole="Client"
      redirectTo="/dashboard/client"
      secondaryHref="/contact"
    />
  );
}
