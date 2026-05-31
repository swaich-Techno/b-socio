import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export const BSOCIO_URL = "https://bsocio.in";
export const AR_STUDIO_URL = "https://ar.bsocio.in";
export const STUDIO_PORTAL_URL = "https://studio.bsocio.in";
export const DEFAULT_EMAIL = "connect@bsocio.in";
export const DEFAULT_WHATSAPP = "+919781580475";
export const DEFAULT_WHATSAPP_LINK = "https://wa.me/919781580475";

export const homeServiceCards = [
  { title: "Social Media Management", text: "Consistent posts, stories, captions, and page care for Instagram and Facebook.", icon: "Share2" },
  { title: "Instagram & Facebook Growth", text: "Better profile planning, content rhythm, and local reach for your audience.", icon: "TrendingUp" },
  { title: "Reels & Short Video Content", text: "Short video ideas, scripts, hooks, and posting plans that help people notice you.", icon: "Video" },
  { title: "Poster & Creative Design", text: "Professional posters, offers, festival creatives, menu posts, and product designs.", icon: "Palette" },
  { title: "Paid Ads Campaigns", text: "Meta ad campaigns focused on leads, calls, WhatsApp inquiries, and local customers.", icon: "Megaphone" },
  { title: "Branding & Business Identity", text: "A cleaner business look with brand colors, tone, and social media style direction.", icon: "BadgeCheck" },
  { title: "Local Business Promotion", text: "Campaigns built for shops, restaurants, service providers, and neighborhood brands.", icon: "MapPin" },
  { title: "Lead Generation", text: "Simple funnels and CTAs that turn views into messages, calls, and customer inquiries.", icon: "Target" },
  { title: "WhatsApp Marketing", text: "Offer messages, inquiry flows, and customer follow-up support through WhatsApp.", icon: "MessageCircle" },
  { title: "Website & Landing Page Support", text: "Clean campaign pages, lead pages, and product pages for digital promotions.", icon: "Layout" },
  { title: "QR Code Marketing", text: "QR campaigns for menus, catalogs, posters, business cards, and offers.", icon: "QrCode" },
  { title: "AR Product Preview Support", text: "Interactive previews that make products, spaces, packaging, and promotions engaging.", icon: "ScanLine" }
];

export const detailedServices = [
  {
    id: "social-media-management",
    title: "Social Media Management",
    summary: "Instagram, Facebook, captions, stories, and regular posting.",
    description: "We manage your Instagram, Facebook, and online presence with regular posts, reels, stories, captions, and engagement strategy.",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "reels-video-content",
    title: "Reels & Video Content",
    summary: "Short-form video ideas, scripts, edits, and publishing plans.",
    description: "We create short-form video ideas, scripts, edits, and posting plans to help your business reach more people.",
    imageUrl: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "poster-creative-design",
    title: "Poster & Creative Design",
    summary: "Offers, menus, product creatives, and festival content.",
    description: "We design professional posters, offers, menus, product creatives, festival posts, and brand content.",
    imageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "paid-ads",
    title: "Paid Ads",
    summary: "Facebook and Instagram ads for leads, messages, calls, and reach.",
    description: "We help run Facebook and Instagram ads to bring more local customers, leads, messages, and calls.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "branding",
    title: "Branding",
    summary: "Logo direction, brand colors, page style, and business presentation.",
    description: "We help businesses with logo direction, brand colors, brand style, social media identity, and professional presentation.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "whatsapp-marketing",
    title: "WhatsApp Marketing",
    summary: "Campaign messages, offers, and customer inquiry flows.",
    description: "We help businesses connect with customers through WhatsApp campaigns, offer messages, and inquiry flows.",
    imageUrl: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "website-landing-page-support",
    title: "Website & Landing Page Support",
    summary: "Simple pages for campaigns, products, and lead collection.",
    description: "We help businesses create simple landing pages, product pages, campaign pages, and lead collection pages.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "qr-ar-marketing",
    title: "QR/AR Marketing",
    summary: "QR codes and AR previews for interactive product promotion.",
    description: "We help businesses use QR codes and AR previews for product promotions, menus, real estate, furniture, packaging, and interactive campaigns.",
    imageUrl: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&w=1400&q=80"
  }
];

export const defaultSiteContent = {
  key: "main",
  hero: {
    headline: "Grow Your Business with Smart Digital Marketing",
    subheadline:
      "B Socio helps businesses get seen, get social, and get more customers through social media marketing, content creation, paid ads, branding, and QR/AR digital experiences.",
    primaryCta: "Get Started",
    secondaryCta: "Explore Services"
  },
  images: {
    heroImageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
    servicesImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    digitalMarketingImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    arStudioImageUrl: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&w=1400&q=80",
    promoImageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1400&q=80"
  },
  contact: {
    heading: "Let us plan your digital growth",
    message: "Tell us about your business and the service you need. The B Socio team will contact you with the next best step.",
    email: DEFAULT_EMAIL,
    whatsapp: DEFAULT_WHATSAPP,
    whatsappLink: DEFAULT_WHATSAPP_LINK,
    address: "Punjab, India",
    formReceivingEmail: DEFAULT_EMAIL,
    socialLinks: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: ""
    }
  },
  cta: {
    headline: "Ready to Make Your Business More Visible?",
    text: "Let B Socio handle your digital presence while you focus on running your business."
  },
  homeServices: homeServiceCards,
  services: detailedServices
};

export function mergeSiteContent(saved = {}) {
  const plain = typeof saved.toObject === "function" ? saved.toObject() : saved;
  return {
    ...defaultSiteContent,
    ...plain,
    hero: { ...defaultSiteContent.hero, ...(plain.hero || {}) },
    images: { ...defaultSiteContent.images, ...(plain.images || {}) },
    contact: {
      ...defaultSiteContent.contact,
      ...(plain.contact || {}),
      socialLinks: {
        ...defaultSiteContent.contact.socialLinks,
        ...(plain.contact?.socialLinks || {})
      }
    },
    cta: { ...defaultSiteContent.cta, ...(plain.cta || {}) },
    homeServices: plain.homeServices?.length ? plain.homeServices : defaultSiteContent.homeServices,
    services: plain.services?.length ? plain.services : defaultSiteContent.services
  };
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Site content database lookup timed out.")), ms);
    })
  ]);
}

export async function getPublicSiteContent() {
  try {
    await withTimeout(connectDB(), 900);
    const saved = await SiteContent.findOne({ key: "main" }).lean();
    return mergeSiteContent(saved || {});
  } catch {
    return mergeSiteContent();
  }
}
