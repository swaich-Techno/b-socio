import { ArrowRight, CheckCircle2, ExternalLink, MessageCircle, MousePointer2, QrCode, Sparkles } from "lucide-react";
import Button from "@/components/Button";
import { PublicIcon } from "@/components/public/IconMap";
import PublicFooter from "@/components/public/PublicFooter";
import { AR_STUDIO_URL, STUDIO_PORTAL_URL, getPublicSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

const processSteps = [
  "Understand Your Business",
  "Plan Your Content & Ads",
  "Create Posts, Reels & Campaigns",
  "Publish & Promote",
  "Track Results",
  "Improve Every Month"
];

const industries = [
  "Sweet Shops",
  "Restaurants & Cafes",
  "Boutiques & Clothing Stores",
  "Salons & Beauty Studios",
  "Gyms & Fitness Centers",
  "Coaching Institutes",
  "Real Estate Dealers",
  "Furniture Shops",
  "Local Service Providers",
  "Startups & Personal Brands",
  "Event Businesses",
  "Local Manufacturers"
];

const resultPoints = [
  "Better online presence",
  "More customer trust",
  "More inquiries on WhatsApp",
  "Better brand image",
  "More local reach",
  "Professional content",
  "Consistent posting",
  "Smart ad campaigns",
  "Better customer engagement",
  "More leads and conversions"
];

const arExamples = [
  "Scan QR code to open product preview",
  "Show AR product experience",
  "Digital menu or product catalog",
  "Interactive business promotion",
  "Smart marketing for shops, restaurants, real estate, furniture, events, and brands",
  "QR-based business cards and posters"
];

export default async function LandingPage() {
  const content = await getPublicSiteContent();
  const { hero, images, contact, cta, homeServices } = content;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="absolute inset-0 opacity-40">
          <img src={images.heroImageUrl} alt="Digital marketing team planning growth campaigns" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96),rgba(2,6,23,0.74),rgba(8,47,73,0.38))]" />
        <div className="page-container relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
              <Sparkles size={16} /> Be Seen. Be Social.
            </p>
            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">{hero.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{hero.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" className="gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">{hero.primaryCta || "Get Started"} <ArrowRight size={18} /></Button>
              <Button href="/services" variant="secondary" className="gap-2 bg-white text-slate-950 hover:bg-slate-100">{hero.secondaryCta || "Explore Services"}</Button>
              <Button href={AR_STUDIO_URL} variant="ghost" className="gap-2 border border-white/20 text-white hover:bg-white/10">Visit AR Studio <ExternalLink size={17} /></Button>
            </div>
          </div>
          <div className="relative min-h-[430px]">
            <div className="absolute right-0 top-0 w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur">
              <img src={images.promoImageUrl} alt="Social media growth dashboard and campaign planning" className="h-80 w-full object-cover" />
              <div className="grid grid-cols-3 gap-px bg-white/10 text-center text-xs font-bold text-slate-100">
                <div className="bg-slate-950/70 px-3 py-4">Reels</div>
                <div className="bg-slate-950/70 px-3 py-4">Paid Ads</div>
                <div className="bg-slate-950/70 px-3 py-4">QR/AR</div>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 grid max-w-xs gap-3 rounded-2xl border border-cyan-300/30 bg-slate-950/80 p-4 shadow-2xl backdrop-blur">
              {["Local reach + brand trust", "WhatsApp inquiries", "Creative approvals"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-slate-950"><CheckCircle2 size={17} /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-16 md:py-20">
        <div className="page-container">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">What we do</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">How B Socio Helps Your Business</h2>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeServices.map((service) => (
              <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
                  <PublicIcon name={service.icon} />
                </span>
                <h3 className="mt-5 text-lg font-black text-slate-950">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 md:py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Why it matters</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Customers search before they visit</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Today, customers search online before visiting a shop or buying a service. If your business is not visible on Instagram, Facebook, Google, and WhatsApp, you are losing customers. B Socio helps you build trust, attract local customers, and convert views into real sales.
            </p>
          </div>
          <img src={images.digitalMarketingImageUrl} alt="Business team reviewing digital marketing analytics" className="h-[420px] w-full rounded-2xl object-cover shadow-soft" />
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Process</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Our Simple Growth Process</h2>
            </div>
            <Button href="/contact" variant="secondary" className="gap-2">Discuss Growth <MessageCircle size={17} /></Button>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-black text-cyan-600">0{index + 1}</span>
                <h3 className="mt-3 text-lg font-black text-slate-950">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="qr-ar-studio" className="bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">QR/AR Digital Studio</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">QR/AR Digital Studio by B Socio</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Our QR/AR Studio helps businesses create interactive digital experiences. Instead of showing only normal posters or product images, businesses can use QR codes and AR previews to make their products, menus, offers, catalogs, real estate, furniture, packaging, and brand promotions more engaging.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {arExamples.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <QrCode className="mt-0.5 shrink-0 text-cyan-300" size={18} />
                  {item}
                </div>
              ))}
            </div>
            <Button href={AR_STUDIO_URL} className="mt-8 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Visit AR Studio <ExternalLink size={17} /></Button>
          </div>
          <div className="relative">
            <img src={images.arStudioImageUrl} alt="QR and AR marketing experience preview" className="h-[460px] w-full rounded-2xl object-cover shadow-2xl" />
            <div className="absolute bottom-5 left-5 right-5 grid gap-3 rounded-2xl border border-white/15 bg-slate-950/80 p-4 backdrop-blur sm:grid-cols-3">
              {["QR Menus", "AR Preview", "Smart Posters"].map((item) => (
                <div key={item} className="rounded-xl bg-white/10 px-3 py-3 text-center text-sm font-bold text-cyan-100">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Who we help</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">Built for Local and Growing Businesses</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div key={industry} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 md:py-20">
        <div className="page-container">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Results</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">We Focus on Real Business Growth</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {resultPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <CheckCircle2 size={17} className="shrink-0 text-cyan-600" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">Client Portal</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Client Portal</h2>
            <p className="mt-4 leading-7 text-slate-600">B Socio clients can log in to view project updates, share requirements, approve creatives, chat with our team, and track their digital marketing work.</p>
            <Button href="/client-login" className="mt-6 gap-2">Client Login <ArrowRight size={17} /></Button>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">Internal only</p>
            <h2 className="mt-3 text-3xl font-black">B Socio Studio</h2>
            <p className="mt-4 leading-7 text-slate-300">Our internal studio portal helps the B Socio team manage clients, content, discussions, campaigns, approvals, and project updates. This is for team and super admin only.</p>
            <Button href={STUDIO_PORTAL_URL} className="mt-6 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Studio Login <ExternalLink size={17} /></Button>
          </article>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-20">
        <div className="page-container overflow-hidden rounded-2xl bg-slate-950 p-7 text-white shadow-soft md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">{cta.headline}</h2>
              <p className="mt-3 max-w-2xl text-slate-300">{cta.text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" className="gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Contact Us <MousePointer2 size={17} /></Button>
              <Button href={AR_STUDIO_URL} variant="secondary" className="gap-2 bg-white text-slate-950 hover:bg-slate-100">Visit AR Studio</Button>
              <Button href="/client-login" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">Client Login</Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter content={{ contact }} />
    </div>
  );
}
