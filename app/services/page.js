import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import PublicFooter from "@/components/public/PublicFooter";
import { getPublicSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Digital Marketing Services",
  description: "Explore B Socio services for social media management, reels, design, paid ads, branding, WhatsApp marketing, websites, and QR/AR marketing."
};

export default async function ServicesPage() {
  const content = await getPublicSiteContent();

  return (
    <div className="bg-white">
      <section className="bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Services</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Digital marketing services built for real business growth</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              B Socio helps shops, restaurants, salons, boutiques, coaching centers, startups, and service providers look professional online and get more customer inquiries.
            </p>
            <Button href="/contact" className="mt-8 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Discuss Your Business Growth <ArrowRight size={17} /></Button>
          </div>
          <img src={content.images.servicesImageUrl} alt="Digital marketing services planning" className="h-[420px] w-full rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container grid gap-5 md:grid-cols-2">
          {content.services.map((service) => (
            <article key={service.id || service.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <img src={service.imageUrl || content.images.servicesImageUrl} alt={`${service.title} service`} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-black text-slate-950">{service.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-cyan-700">
                  <CheckCircle2 size={17} /> Practical plan, clean creatives, clear reporting
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16">
        <div className="page-container grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl font-black text-slate-950">Discuss Your Business Growth</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Share what you sell, where your customers are, and what you want to improve. We will suggest a simple digital growth path.</p>
          </div>
          <Button href="/contact" className="gap-2">Contact B Socio <ArrowRight size={17} /></Button>
        </div>
      </section>

      <PublicFooter content={content} />
    </div>
  );
}
