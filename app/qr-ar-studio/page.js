import { ArrowRight, CheckCircle2, ExternalLink, QrCode, ScanLine } from "lucide-react";
import Button from "@/components/Button";
import PublicFooter from "@/components/public/PublicFooter";
import { AR_STUDIO_URL, getPublicSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "QR/AR Digital Studio",
  description: "B Socio QR/AR Studio helps businesses create QR-based and AR-based product previews, menus, catalogs, posters, and interactive marketing campaigns."
};

const useCases = [
  "Product preview using QR",
  "AR-based marketing campaigns",
  "QR-based business cards and posters",
  "Digital menu or product catalog",
  "Interactive business promotion",
  "Real estate, furniture, event, packaging, and brand promotion"
];

export default async function QrArStudioPage() {
  const content = await getPublicSiteContent();

  return (
    <div className="bg-white">
      <section className="bg-slate-950 px-4 py-16 text-white md:py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">B Socio QR/AR Digital Studio</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Make posters, menus, catalogs, and products interactive</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Our QR/AR Studio helps businesses create scan-to-open digital experiences for products, offers, menus, catalogs, furniture, real estate, packaging, and campaigns.
            </p>
            <Button href={AR_STUDIO_URL} className="mt-8 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Visit AR Studio <ExternalLink size={17} /></Button>
          </div>
          <img src={content.images.arStudioImageUrl} alt="QR and AR product preview marketing" className="h-[440px] w-full rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="page-container grid gap-5 md:grid-cols-3">
          {[
            ["Scan", "Customers scan a QR code from your poster, menu, packaging, catalog, or business card.", QrCode],
            ["Preview", "They see a product, offer, menu, catalog, or AR-style digital experience instantly.", ScanLine],
            ["Inquire", "Clear CTAs help them message, call, visit, or buy with less friction.", ArrowRight]
          ].map(([title, text, Icon]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><Icon size={23} /></span>
              <h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16">
        <div className="page-container">
          <h2 className="text-3xl font-black text-slate-950">Useful for many business promotions</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                <CheckCircle2 size={17} className="text-cyan-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="page-container rounded-2xl bg-slate-950 p-7 text-white md:p-10">
          <h2 className="text-3xl font-black">Explore the AR Studio</h2>
          <p className="mt-3 max-w-2xl text-slate-300">The AR Studio runs separately from the public B Socio website and is available at the correct portal link.</p>
          <Button href={AR_STUDIO_URL} className="mt-6 gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">Visit AR Studio <ExternalLink size={17} /></Button>
        </div>
      </section>

      <PublicFooter content={content} />
    </div>
  );
}
