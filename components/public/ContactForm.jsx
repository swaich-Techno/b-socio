"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import Button from "@/components/Button";

function buildMessage(values) {
  return [
    "Hi B Socio, I want to discuss digital marketing for my business.",
    "",
    `Name: ${values.name || ""}`,
    `Business: ${values.businessName || ""}`,
    `Phone: ${values.phone || ""}`,
    `Email: ${values.email || ""}`,
    `Service Required: ${values.serviceRequired || ""}`,
    "",
    `Message: ${values.message || ""}`
  ].join("\n");
}

export default function ContactForm({ services = [], contact = {} }) {
  const [status, setStatus] = useState("");
  const [values, setValues] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    serviceRequired: "",
    message: ""
  });

  const email = contact.email || "connect@bsocio.in";
  const phone = String(contact.whatsapp || "+919781580475").replace(/\D/g, "") || "919781580475";
  const message = buildMessage(values);
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(`B Socio inquiry: ${values.serviceRequired || "Digital Marketing"}`)}&body=${encodeURIComponent(message)}`;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
    setStatus("WhatsApp opened with your message details. You can also send the same details by email.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Name
          <input name="name" value={values.name} onChange={handleChange} required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Business Name
          <input name="businessName" value={values.businessName} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Phone Number
          <input name="phone" value={values.phone} onChange={handleChange} required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Email
          <input name="email" type="email" value={values.email} onChange={handleChange} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">Service Required
        <select name="serviceRequired" value={values.serviceRequired} onChange={handleChange} required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
          <option value="">Select service</option>
          {services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">Message
        <textarea name="message" rows={5} value={values.message} onChange={handleChange} className="resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
      </label>
      {status ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{status}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700">Send on WhatsApp <MessageCircle size={17} /></Button>
        <a href={mailtoHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
          Send by Email <Mail size={17} />
        </a>
      </div>
    </form>
  );
}
