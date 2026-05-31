import PortalLogin from "@/components/public/PortalLogin";

export const metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <PortalLogin
      eyebrow="Secure portal"
      title="Login to your B Socio workspace"
      description="Clients, team members, and super admins can use this secure login. Access after login depends on your approved role."
      secondaryHref="/"
    />
  );
}
