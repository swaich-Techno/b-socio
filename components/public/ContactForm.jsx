"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/Button";

export default function ContactForm({ services = [] }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not send your message.");
      return;
    }
    form.reset();
    setStatus(data.message || "Thank you. B Socio will contact you soon.");
  }

  return (
    <form action="/api/contact" method="post" onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Name
          <input name="name" required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Business Name
          <input name="businessName" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Phone Number
          <input name="phone" required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Email
          <input name="email" type="email" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">Service Required
        <select name="serviceRequired" required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
          <option value="">Select service</option>
          {services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">Message
        <textarea name="message" rows={5} className="resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
      </label>
      {status ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{status}</p> : null}
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <Button type="submit" className="gap-2" disabled={saving}>{saving ? "Sending..." : "Send Message"} <Send size={17} /></Button>
    </form>
  );
}
