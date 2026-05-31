import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/Button";
import ContactForm from "@/components/public/ContactForm";
import PublicFooter from "@/components/public/PublicFooter";
import { DEFAULT_WHATSAPP_LINK, getPublicSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
  description: "Contact B Socio for digital marketing, branding, paid ads, social media management, and QR/AR marketing support."
};

const contactNotices = {
  sent: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    text: "Thank you. Your message was sent to B Socio."
  },
  saved: {
    className: "border-amber-200 bg-amber-50 text-amber-800",
    text: "Thank you. Your inquiry was saved. Email sending is not configured yet."
  },
  "setup-needed": {
    className: "border-red-200 bg-red-50 text-red-800",
    text: "The form is ready, but local email and database access are not configured. Add Resend email settings and allow MongoDB Atlas access before using it live."
  },
  "missing-fields": {
    className: "border-red-200 bg-red-50 text-red-800",
    text: "Please add your name, phone number, and required service before sending."
  },
  form: {
    className: "border-slate-200 bg-slate-50 text-slate-700",
    text: "Please use the contact form below."
  }
};

export default async function ContactPage({ searchParams }) {
  const content = await getPublicSiteContent();
  const contact = content.contact;
  const params = await searchParams;
  const notice = contactNotices[params?.contact];

  return (
    <div className="bg-white">
      <section className="bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Contact Us</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">{contact.heading}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{contact.message}</p>
            <Button href={contact.whatsappLink || DEFAULT_WHATSAPP_LINK} className="mt-8 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Chat on WhatsApp <MessageCircle size={17} /></Button>
          </div>
          <div className="grid gap-4">
            {[
              [Mail, "Email", contact.email, `mailto:${contact.email}`],
              [Phone, "WhatsApp", contact.whatsapp, contact.whatsappLink || DEFAULT_WHATSAPP_LINK],
              [MapPin, "Address", contact.address, ""]
            ].map(([Icon, label, value, href]) => {
              const CardTag = href ? "a" : "div";
              return (
              <CardTag key={label} href={href || undefined} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:border-cyan-300/50">
                <Icon className="text-cyan-300" size={23} />
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-black">{value}</p>
              </CardTag>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 className="text-3xl font-black text-slate-950">Tell us what you need</h2>
            <p className="mt-4 leading-7 text-slate-600">Fill the form and the B Socio team will contact you. You can also use WhatsApp for faster discussion.</p>
            {notice ? (
              <p className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.className}`}>{notice.text}</p>
            ) : null}
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700">
              <a href={`mailto:${contact.email}`} className="rounded-xl border border-slate-200 px-4 py-3 hover:border-cyan-300">{contact.email}</a>
              <a href={contact.whatsappLink || DEFAULT_WHATSAPP_LINK} className="rounded-xl border border-slate-200 px-4 py-3 hover:border-cyan-300">Chat on WhatsApp</a>
            </div>
          </div>
          <ContactForm services={content.services} contact={contact} />
        </div>
      </section>

      <PublicFooter content={content} />
    </div>
  );
}
