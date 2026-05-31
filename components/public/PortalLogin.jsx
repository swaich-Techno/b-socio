"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

function routeForUser(user, fallback) {
  if (fallback) return fallback;
  if (user?.role === "Client") return "/dashboard/client";
  if (user?.role === "Owner/Admin" || user?.role === "Owner" || user?.role === "Super Admin") return "/dashboard/super-admin";
  return "/dashboard/team";
}

export default function PortalLogin({ title, description, eyebrow, expectedRole, redirectTo, studioHref, secondaryHref }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Login failed.");
      return;
    }
    if (data.user?.status === "pending") {
      router.push("/pending");
    } else if (data.user?.status === "rejected" || data.user?.status === "suspended") {
      router.push("/inactive");
    } else if (expectedRole === "Client" && data.user?.role !== "Client") {
      router.push(routeForUser(data.user));
    } else {
      router.push(routeForUser(data.user, redirectTo));
    }
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-12">
      <div className="page-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">{description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {studioHref ? (
              <Button href={studioHref} variant="secondary" className="gap-2">Team Studio Login <ArrowRight size={17} /></Button>
            ) : null}
            {secondaryHref ? <Button href={secondaryHref} variant="ghost">Back to Website</Button> : null}
          </div>
        </section>
        <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-white">
            <LockKeyhole size={22} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">Secure Login</h2>
          <p className="mt-2 text-sm text-slate-500">Use the email and password created by B Socio.</p>
          <div className="mt-6 grid gap-4">
            <FormInput label="Email" name="email" type="email" required />
            <FormInput label="Password" name="password" type="password" required />
          </div>
          {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button type="submit" className="mt-6 w-full gap-2" disabled={loading}>{loading ? "Checking..." : "Login"} <ArrowRight size={17} /></Button>
          <div className="mt-4 text-center text-sm">
            <a href="/forgot-password" className="font-semibold text-cyan-700 hover:text-cyan-900">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
