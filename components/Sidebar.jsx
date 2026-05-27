"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, BookOpen, CalendarDays, CheckCircle2, FileText, Home, Image, ListChecks, Menu, MessageCircle, ReceiptText, Search, Settings, Sparkles, Store, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageSelector";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, audience: "all" },
  { href: "/clients", label: "Clients", icon: Store, audience: "team" },
  { href: "/catalogues", label: "Catalogues", icon: BookOpen, audience: "team" },
  { href: "/content-generator", label: "Generator", icon: Sparkles, audience: "team" },
  { href: "/ai-image-studio", label: "Image Prompts", icon: Image, audience: "team" },
  { href: "/trends", label: "Trends", icon: TrendingUp, audience: "team" },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, audience: "team" },
  { href: "/tasks", label: "Tasks", icon: ListChecks, audience: "team" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, audience: "team" },
  { href: "/reports", label: "Reports", icon: FileText, audience: "team" },
  { href: "/billing", label: "Billing", icon: ReceiptText, audience: "admin" },
  { href: "/chat", label: "Chat", icon: MessageCircle, audience: "all" },
  { href: "/search", label: "Search", icon: Search, audience: "team" },
  { href: "/notifications", label: "Notifications", icon: Bell, audience: "team" },
  { href: "/team", label: "Team", icon: Users, audience: "admin" },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2, audience: "admin" },
  { href: "/settings", label: "Settings", icon: Settings, audience: "admin" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const isClient = user?.role === "Client";
  const isAdmin = user?.role === "Owner/Admin" || user?.role === "Owner" || user?.role === "Super Admin";
  const visibleItems = navItems.filter((item) => {
    if (item.audience === "all") return true;
    if (item.audience === "admin") return isAdmin;
    if (item.audience === "team") return !isClient;
    return true;
  });

  const nav = (
    <nav className="flex flex-col gap-1">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-[#071525]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            title={t(item.label)}
          >
            <Icon size={19} />
            <span>{t(item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-2xl bg-[#071525] text-white shadow-soft md:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <aside className="fixed inset-y-16 left-0 z-30 hidden w-64 border-r border-white/10 bg-[#071525] px-4 py-6 md:block">
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 md:hidden">
          <aside className="h-full w-[82vw] max-w-xs bg-[#071525] p-4 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">B Socio Studio</p>
                <p className="text-xs text-slate-400">Be Seen. Be Social.</p>
              </div>
              <button className="rounded-xl bg-white/10 p-2 text-white" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
