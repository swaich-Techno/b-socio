import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AR_STUDIO_URL, BSOCIO_URL, DEFAULT_EMAIL, DEFAULT_WHATSAPP, STUDIO_PORTAL_URL } from "@/lib/siteContent";

const footerLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["QR/AR Studio", "/qr-ar-studio"],
  ["Client Login", "/client-login"],
  ["Contact Us", "/contact"]
];

export default function PublicFooter({ content }) {
  const contact = content?.contact || {};
  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-4 py-12 text-white">
      <div className="page-container grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950">BS</span>
            <div>
              <p className="text-lg font-black">B Socio</p>
              <p className="text-sm text-slate-400">Be Seen. Be Social.</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
            Digital Marketing | Branding | Ads | QR/AR Studio
          </p>
          <p className="mt-4 text-sm text-slate-400">Website: {BSOCIO_URL}</p>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            {footerLinks.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-white">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Portals</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <a href={AR_STUDIO_URL} className="inline-flex items-center gap-2 hover:text-white">AR Studio <ArrowUpRight size={14} /></a>
            <a href={STUDIO_PORTAL_URL} className="inline-flex items-center gap-2 hover:text-white">Studio Portal <ArrowUpRight size={14} /></a>
            <a href={`mailto:${contact.email || DEFAULT_EMAIL}`} className="hover:text-white">{contact.email || DEFAULT_EMAIL}</a>
            <a href={contact.whatsappLink || "https://wa.me/919781580475"} className="hover:text-white">{contact.whatsapp || DEFAULT_WHATSAPP}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
