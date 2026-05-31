"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Plus, Save, Trash2, UserPlus } from "lucide-react";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

const imageFields = [
  ["heroImageUrl", "Homepage hero image"],
  ["servicesImageUrl", "Services image"],
  ["digitalMarketingImageUrl", "Digital marketing visual"],
  ["arStudioImageUrl", "QR/AR section image"],
  ["promoImageUrl", "Promotional banner image"]
];

function emptyService() {
  return {
    id: `service-${Date.now()}`,
    title: "",
    summary: "",
    description: "",
    imageUrl: ""
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const [content, setContent] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const contentResponse = await fetch("/api/site-content", { cache: "no-store" });
      const contentData = await contentResponse.json();
      setContent(contentData.content);
      const usersResponse = await fetch("/api/portal-users", { cache: "no-store" });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
        setClients(usersData.clients || []);
      }
    }
    load();
  }, []);

  function updateSection(section, key, value) {
    setContent((current) => ({
      ...current,
      [section]: {
        ...(current?.[section] || {}),
        [key]: value
      }
    }));
  }

  function updateSocial(key, value) {
    setContent((current) => ({
      ...current,
      contact: {
        ...(current?.contact || {}),
        socialLinks: {
          ...(current?.contact?.socialLinks || {}),
          [key]: value
        }
      }
    }));
  }

  async function handleImageUpload(key, file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 2_500_000) {
      setError("Please keep image uploads under 2.5 MB.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    updateSection("images", key, dataUrl);
  }

  function updateService(index, key, value) {
    setContent((current) => {
      const services = [...(current.services || [])];
      services[index] = { ...services[index], [key]: value };
      return { ...current, services };
    });
  }

  function addService() {
    setContent((current) => ({ ...current, services: [...(current.services || []), emptyService()] }));
  }

  function deleteService(index) {
    setContent((current) => ({ ...current, services: (current.services || []).filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function saveContent() {
    setSaving(true);
    setStatus("");
    setError("");
    const response = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Website content could not be saved.");
      return;
    }
    setContent(data.content);
    setStatus("Website content saved.");
  }

  async function createPortalUser(event) {
    event.preventDefault();
    setStatus("");
    setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    payload.assignedClients = payload.assignedClient ? [payload.assignedClient] : [];
    const response = await fetch("/api/portal-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Portal user could not be created.");
      return;
    }
    setUsers((current) => [...current, data.user]);
    form.reset();
    setStatus("Portal user created.");
  }

  async function updateUser(user, update) {
    const response = await fetch(`/api/portal-users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "User could not be updated.");
      return;
    }
    setUsers((current) => current.map((item) => item.id === user.id ? data.user : item));
    setStatus("User updated.");
  }

  async function deleteUser(user) {
    const response = await fetch(`/api/portal-users/${user.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "User could not be removed.");
      return;
    }
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setStatus("User removed.");
  }

  if (!content) return <Loading label="Loading website manager..." />;

  return (
    <div className="page-container">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Super Admin</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Website and Portal Manager</h1>
          <p className="mt-2 text-slate-500">Update public content, landing images, contact details, services, team users, and client portal users.</p>
        </div>
        <Button onClick={saveContent} disabled={saving} className="gap-2"><Save size={17} /> {saving ? "Saving..." : "Save Website Content"}</Button>
      </div>

      {status ? <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{status}</p> : null}
      {error ? <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Website Content Manager</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">Hero headline
              <input value={content.hero.headline || ""} onChange={(event) => updateSection("hero", "headline", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">Hero subheadline
              <textarea value={content.hero.subheadline || ""} onChange={(event) => updateSection("hero", "subheadline", event.target.value)} rows={4} className="resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">Primary CTA
                <input value={content.hero.primaryCta || ""} onChange={(event) => updateSection("hero", "primaryCta", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">Secondary CTA
                <input value={content.hero.secondaryCta || ""} onChange={(event) => updateSection("hero", "secondaryCta", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Landing Page Images</h2>
          <div className="mt-5 grid gap-4">
            {imageFields.map(([key, label]) => (
              <div key={key} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <img src={content.images[key]} alt={label} className="h-20 w-28 rounded-xl object-cover" />
                  <label className="grid flex-1 gap-2 text-sm font-semibold text-slate-700">{label} URL
                    <input value={content.images[key] || ""} onChange={(event) => updateSection("images", key, event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
                  </label>
                </div>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200">
                  <ImagePlus size={17} /> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(key, event.target.files?.[0])} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-manager" className="mt-8 card p-6">
        <h2 className="text-xl font-black text-slate-950">Contact Manager</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["heading", "Contact page heading"],
            ["message", "Contact page message"],
            ["email", "Email"],
            ["whatsapp", "WhatsApp number"],
            ["whatsappLink", "WhatsApp link"],
            ["address", "Business address"],
            ["formReceivingEmail", "Contact form receiving email"]
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm font-semibold text-slate-700">{label}
              <input value={content.contact[key] || ""} onChange={(event) => updateSection("contact", key, event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            </label>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {["instagram", "facebook", "linkedin", "youtube"].map((key) => (
            <label key={key} className="grid gap-2 text-sm font-semibold capitalize text-slate-700">{key}
              <input value={content.contact.socialLinks?.[key] || ""} onChange={(event) => updateSocial(key, event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            </label>
          ))}
        </div>
      </section>

      <section id="services-manager" className="mt-8 card p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-black text-slate-950">Services Manager</h2>
            <p className="mt-1 text-sm text-slate-500">Add, edit, delete, and update Services page content.</p>
          </div>
          <Button onClick={addService} variant="secondary" className="gap-2"><Plus size={17} /> Add Service</Button>
        </div>
        <div className="mt-5 grid gap-5">
          {(content.services || []).map((service, index) => (
            <div key={service.id || index} className="rounded-2xl border border-slate-200 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">Service title
                  <input value={service.title || ""} onChange={(event) => updateService(index, "title", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">Service image URL
                  <input value={service.imageUrl || ""} onChange={(event) => updateService(index, "imageUrl", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
                </label>
              </div>
              <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Short summary
                <input value={service.summary || ""} onChange={(event) => updateService(index, "summary", event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
              </label>
              <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Description
                <textarea value={service.description || ""} onChange={(event) => updateService(index, "description", event.target.value)} rows={3} className="resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
              </label>
              <Button onClick={() => deleteService(index)} variant="danger" className="mt-4 gap-2"><Trash2 size={17} /> Delete Service</Button>
            </div>
          ))}
        </div>
      </section>

      <section id="user-manager" className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={createPortalUser} className="card p-6">
          <h2 className="text-xl font-black text-slate-950">User Manager</h2>
          <p className="mt-1 text-sm text-slate-500">Create team members, clients, and super admin accounts.</p>
          <div className="mt-5 grid gap-4">
            <input name="name" placeholder="Name" required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            <input name="email" placeholder="Email" type="email" required className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            <input name="password" placeholder="Temporary password" type="password" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100" />
            <select name="role" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option value="Client">Client</option>
              <option value="Social Media Manager">Team Member - Social Media Manager</option>
              <option value="Designer">Team Member - Designer</option>
              <option value="Ads Manager">Team Member - Ads Manager</option>
              <option value="Client Coordinator">Team Member - Client Coordinator</option>
              <option value="Owner/Admin">Super Admin</option>
            </select>
            <select name="status" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option value="approved">Approved</option>
              <option value="pending">Pending approval</option>
              <option value="suspended">Blocked</option>
            </select>
            <select name="assignedClient" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100">
              <option value="">Assign client, optional</option>
              {clients.map((client) => <option key={client._id} value={client._id}>{client.businessName}</option>)}
            </select>
          </div>
          <Button type="submit" className="mt-5 w-full gap-2"><UserPlus size={17} /> Create User</Button>
        </form>

        <div className="card p-6">
          <h2 className="text-xl font-black text-slate-950">Portal Users</h2>
          <div className="mt-5 grid gap-3">
            {users.map((user) => (
              <article key={user.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <h3 className="font-black text-slate-950">{user.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{user.email} - {user.role} - {user.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => updateUser(user, { status: "approved" })} variant="secondary">Approve</Button>
                    <Button onClick={() => updateUser(user, { status: "suspended" })} variant="secondary">Block</Button>
                    <Button onClick={() => deleteUser(user)} variant="danger">Remove</Button>
                  </div>
                </div>
              </article>
            ))}
            {!users.length ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No portal users found.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
