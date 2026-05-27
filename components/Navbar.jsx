"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LogIn } from "lucide-react";
import Button from "@/components/Button";
import LanguageSelector, { useLanguage } from "@/components/LanguageSelector";
import { AR_STUDIO_URL, STUDIO_PORTAL_URL } from "@/lib/siteContent";

const publicLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["QR/AR Studio", "/qr-ar-studio"],
  ["Client Login", "/client-login"],
  ["Contact Us", "/contact"]
];

export default function Navbar({ isPublic }) {
  const router = useRouter();
  const { t } = useLanguage();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href={isPublic ? "/" : "/dashboard"} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#071525] text-sm font-black text-white">BS</span>
          <span>
            <span className="block text-sm font-black tracking-tight text-slate-950">{isPublic ? "B Socio" : "B Socio Studio"}</span>
            <span className="block text-xs text-slate-500">Be Seen. Be Social.</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2">
          {isPublic ? (
            <>
              <div className="hidden items-center gap-1 lg:flex">
                {publicLinks.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                    {label}
                  </Link>
                ))}
              </div>
              <Button href={AR_STUDIO_URL} variant="secondary" className="hidden gap-1.5 sm:inline-flex">AR Studio <ArrowUpRight size={15} /></Button>
              <Button href={STUDIO_PORTAL_URL} variant="ghost" className="gap-1.5 text-xs">Studio Login <LogIn size={15} /></Button>
            </>
          ) : (
            <>
              <LanguageSelector />
              <Button href="/" variant="ghost">Public Site</Button>
              <Button variant="secondary" onClick={logout}>{t("Logout")}</Button>
            </>
          )}
        </nav>
      </div>
      {isPublic ? (
        <div className="border-t border-slate-100 px-4 py-2 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {publicLinks.map(([label, href]) => (
              <Link key={href} href={href} className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
