import "./globals.css";
import AppFrame from "@/components/AppFrame";

export const metadata = {
  metadataBase: new URL("https://bsocio.in"),
  title: {
    default: "B Socio | Be Seen. Be Social.",
    template: "%s | B Socio"
  },
  description: "B Socio is a digital marketing agency helping local businesses grow with social media marketing, paid ads, branding, lead generation, and QR/AR digital experiences.",
  openGraph: {
    title: "B Socio",
    description: "Be Seen. Be Social.",
    url: "https://bsocio.in",
    siteName: "B Socio",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
