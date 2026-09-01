/**
 * Pure, hook-free presentational pieces for the Visual Page Builder's
 * "custom-builder" template. No useState/useEffect here on purpose — that's
 * what lets the exact same components render inside the dashboard editor
 * (client-side, live preview) AND inside the actual public site (a plain
 * server component, via CustomBuilderTemplate) with zero drift between what
 * a merchant designs and what a customer sees.
 *
 * Products / Gallery / Contact are the three section types tied to real
 * business data. Their editors below don't let a merchant type in fake
 * items — the `products` / `images` / `contact` props are always resolved
 * from the actual Product / GalleryImage / Settings rows by the caller
 * (BuilderEditor.tsx for the dashboard preview, CustomBuilderTemplate.tsx
 * for the live site), so a real customer can never end up looking at demo
 * placeholder products.
 */
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/lib/businessConfig";
import {
  ArrowRight, BadgeCheck, BadgeDollarSign, Building2, CheckCircle2,
  Clock3, Image as ImageIcon, LifeBuoy, MapPin, MessageCircle, Package, Phone,
  Megaphone, Sparkles, ShieldCheck, ShoppingBag, Star, Store, Target, Truck, Users,
  Zap, BarChart3, Minus, Home, UserRound,
} from "lucide-react";


export type BuilderSectionType =
  | "hero" | "stats" | "features" | "products" | "gallery" | "about" | "cta" | "contact" | "divider";

export type BuilderSection = {
  id: string;
  type: BuilderSectionType;
  locked?: boolean;
  // Freeform per-type content the merchant edits. For "products" / "gallery"
  // / "contact" this only ever holds heading/bgColor/textColor — never fake
  // item data — real content for those three always comes from the
  // `products` / `images` / `contact` render props instead.
  content: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type RealProduct = { id: string; name: string; price?: number | null; offerPrice?: number | null; image?: string | null; available: boolean; stockQty?: number | null };
export type RealContact = { phone?: string | null; whatsapp?: string | null; address?: string | null; callHref?: string | null; whatsappHref?: string | null };

export const SECTION_TYPES: { type: BuilderSectionType; icon: LucideIcon; label: string }[] = [
  { type: "hero", icon: Home, label: "Hero Banner" },
  { type: "features", icon: Sparkles, label: "Features" },
  { type: "products", icon: ShoppingBag, label: "Products Grid" },
  { type: "gallery", icon: ImageIcon, label: "Gallery" },
  { type: "about", icon: UserRound, label: "About" },
  { type: "cta", icon: Megaphone, label: "Call to Action" },
  { type: "contact", icon: Phone, label: "Contact" },
  { type: "stats", icon: BarChart3, label: "Stats Strip" },
  { type: "divider", icon: Minus, label: "Divider" },
];

const FEATURE_ICON_MAP: Record<string, LucideIcon> = {
  Zap, ShieldCheck, BadgeDollarSign, LifeBuoy, CheckCircle2, Truck, Clock3, Star,
  Users, Target, Store, BadgeCheck, Package, Phone, MessageCircle, MapPin,
};

const LEGACY_FEATURE_ICONS: Record<string, string> = {
  "⚡": "Zap", "🛡": "ShieldCheck", "💰": "BadgeDollarSign", "🤝": "Users",
  "⭐": "Star", "📦": "Package", "📞": "Phone", "💬": "MessageCircle",
  "📍": "MapPin", "🚚": "Truck", "⏱": "Clock3",
};

export const FEATURE_ICON_OPTIONS = Object.keys(FEATURE_ICON_MAP).map((name) => ({ name, icon: FEATURE_ICON_MAP[name] }));

export function normalizeFeatureIcon(icon: string | undefined): string {
  return LEGACY_FEATURE_ICONS[icon ?? ""] ?? (icon && FEATURE_ICON_MAP[icon] ? icon : "CheckCircle2");
}

export function FeatureIcon({ name, size = 24, strokeWidth = 1.8 }: { name?: string; size?: number; strokeWidth?: number }) {
  const Icon = FEATURE_ICON_MAP[normalizeFeatureIcon(name)];
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export const PRESET_PALETTES = [
  { name: "Indigo", accent: "#6366f1", bg: "#f4f4f8", text: "#0f0f13" },
  { name: "Emerald", accent: "#10b981", bg: "#f0fdf4", text: "#052e16" },
  { name: "Rose", accent: "#e11d48", bg: "#fff1f2", text: "#1c0510" },
  { name: "Amber", accent: "#f59e0b", bg: "#fffbeb", text: "#1c1005" },
  { name: "Violet", accent: "#8b5cf6", bg: "#f5f3ff", text: "#170030" },
  { name: "Slate", accent: "#334155", bg: "#f8fafc", text: "#0f172a" },
  { name: "Coral", accent: "#f97316", bg: "#fff7ed", text: "#1c0b00" },
  { name: "Sky", accent: "#0ea5e9", bg: "#f0f9ff", text: "#082f49" },
];

export const GOOGLE_FONTS_POPULAR = [
  "Inter", "Plus Jakarta Sans", "Outfit", "DM Sans", "Manrope", "Sora", "Nunito", "Poppins",
  "Raleway", "Montserrat", "Lato", "Open Sans", "Roboto", "Source Sans 3", "Work Sans",
  "Fraunces", "Playfair Display", "Cormorant Garamond", "Merriweather", "Lora",
  "DM Serif Display", "Libre Baskerville", "EB Garamond", "Spectral",
  "Barlow Condensed", "Barlow", "Oswald", "Bebas Neue", "Space Grotesk",
];

export function getGoogleFontHref(font: string): string {
  const safeFont = GOOGLE_FONTS_POPULAR.includes(font) ? font : "Plus Jakarta Sans";
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(safeFont).replace(/%20/g, "+")}&display=swap`;
}

export function defaultSections(accent: string): BuilderSection[] {
  return [
    {
      id: "s1", type: "hero", locked: false,
      content: {
        headline: "Your Business Name",
        subline: "We deliver quality you can trust — fast, affordable, and built for you.",
        cta: "Get Started", cta2: "Learn More",
        bgColor: accent, textColor: "#ffffff", image: null,
      },
    },
    {
      id: "s2", type: "products", locked: false,
      content: { heading: "Our Products", bgColor: "#ffffff", textColor: "#0f0f13" },
    },
    {
      id: "s3", type: "features", locked: false,
      content: {
        heading: "Why Choose Us",
        items: [
          { icon: "Zap", title: "Lightning Fast", desc: "Delivery in 24–48 hours guaranteed." },
          { icon: "ShieldCheck", title: "Trusted Quality", desc: "Every order checked before it ships." },
          { icon: "BadgeDollarSign", title: "Best Prices", desc: "Fair pricing, always." },
          { icon: "LifeBuoy", title: "Great Support", desc: "We're here every step of the way." },
        ],
        bgColor: "#f4f4f8", textColor: "#0f0f13",
      },
    },
    {
      id: "s4", type: "contact", locked: false,
      content: { heading: "Get in Touch", bgColor: "#f4f4f8", textColor: "#0f0f13" },
    },
  ];
}

export function sectionDefaultsFor(type: BuilderSectionType, accent: string): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (type) {
    case "hero": return { headline: "Your Headline", subline: "Supporting text goes here.", cta: "Get Started", cta2: "Learn More", bgColor: accent, textColor: "#ffffff" };
    case "stats": return { stats: [{ number: "100+", label: "Clients" }, { number: "5★", label: "Rating" }, { number: "3yr", label: "Experience" }], bgColor: "#ffffff", textColor: "#0f0f13" };
    case "features": return { heading: "Our Features", items: [{ icon: "Zap", title: "Feature One", desc: "Brief description." }, { icon: "ShieldCheck", title: "Feature Two", desc: "Brief description." }], bgColor: "#f4f4f8", textColor: "#0f0f13" };
    case "products": return { heading: "Products", bgColor: "#ffffff", textColor: "#0f0f13" };
    case "gallery": return { heading: "Gallery", bgColor: "#f4f4f8", textColor: "#0f0f13" };
    case "about": return { heading: "About Us", text: "Tell your story here.", bgColor: "#ffffff", textColor: "#0f0f13" };
    case "cta": return { heading: "Ready to get started?", subline: "Join our happy customers today.", cta: "Contact Us", bgColor: accent, textColor: "#ffffff" };
    case "contact": return { heading: "Contact Us", bgColor: "#f4f4f8", textColor: "#0f0f13" };
    case "divider": return { label: "", bgColor: "#ffffff" };
  }
}

export function HeroSection({ content, font, primaryHref, secondaryHref, interactive = true }: { content: any; accent?: string; font: string; primaryHref?: string | null; secondaryHref?: string | null; interactive?: boolean }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const bg = content.image
    ? `linear-gradient(135deg, ${content.bgColor}dd 0%, ${content.bgColor}99 100%), url(${content.image}) center/cover`
    : `linear-gradient(135deg, ${content.bgColor} 0%, color-mix(in srgb, ${content.bgColor} 70%, #000) 100%)`;
  return (
    <div style={{ background: bg, color: content.textColor, padding: "5rem 2.5rem", position: "relative", overflow: "hidden", minHeight: 360, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: "15%", width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
        <h1 style={{ fontFamily: font, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0 }}>{content.headline}</h1>
        <p style={{ marginTop: "1rem", fontSize: "1.05rem", opacity: 0.85, maxWidth: 520, lineHeight: 1.65 }}>{content.subline}</p>
        <div style={{ marginTop: "1.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {content.cta && (
            <a href={primaryHref ?? "#contact"} onClick={interactive ? undefined : (e) => { e.preventDefault(); e.stopPropagation(); }} aria-disabled={!interactive || undefined} style={{ background: "#fff", color: content.bgColor, borderRadius: 12, padding: "0.8rem 1.75rem", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(0,0,0,0.2)", textDecoration: "none", display: "inline-block" }}>{content.cta} <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
          )}
          {content.cta2 && (
            <a href={secondaryHref ?? "#products"} onClick={interactive ? undefined : (e) => { e.preventDefault(); e.stopPropagation(); }} aria-disabled={!interactive || undefined} style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 12, padding: "0.8rem 1.75rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: font, textDecoration: "none", display: "inline-block" }}>{content.cta2}</a>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatsSection({ content, accent, font }: { content: any; accent: string; font: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div style={{ background: content.bgColor, display: "grid", gridTemplateColumns: `repeat(${content.stats.length}, 1fr)`, borderTop: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      {content.stats.map((st: { number: string; label: string }, i: number) => (
        <div key={i} style={{ padding: "1.5rem 1rem", textAlign: "center", borderRight: i < content.stats.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
          <div style={{ fontSize: "1.7rem", fontWeight: 800, color: accent, letterSpacing: "-0.03em", fontFamily: font }}>{st.number}</div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginTop: 4 }}>{st.label}</div>
        </div>
      ))}
    </div>
  );
}

export function FeaturesSection({ content, font }: { content: any; accent?: string; font: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div style={{ background: content.bgColor, padding: "4rem 2.5rem" }}>
      <h2 style={{ fontFamily: font, textAlign: "center", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: content.textColor, margin: "0 0 2rem" }}>{content.heading}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", maxWidth: 900, margin: "0 auto" }}>
        {content.items.map((item: { icon: string; title: string; desc: string }, i: number) => (
          <div key={i} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "1.5rem" }}>
            <span style={{ color: "inherit", display: "flex", alignItems: "center", marginBottom: "0.75rem" }}><FeatureIcon name={item.icon} size={24} /></span>
            <h3 style={{ fontFamily: font, fontSize: "0.95rem", fontWeight: 700, color: content.textColor, margin: 0 }}>{item.title}</h3>
            <p style={{ fontSize: "0.82rem", color: "#777", marginTop: "0.4rem", lineHeight: 1.55 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Always shows real products passed in by the caller — never fake demo items. */
export function ProductsSection({ content, accent, font, products, catalogueHref, currency = "USD", locale = "en-US", itemLabel = "Products" }: { content: any; accent: string; font: string; products: RealProduct[]; catalogueHref?: string | null; currency?: string; locale?: string; itemLabel?: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div id="products" style={{ background: content.bgColor || "#fff", padding: "4rem 2.5rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: font, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: content.textColor || "#0f0f13", margin: 0 }}>{content.heading || `Our ${itemLabel}`}</h2>
        {catalogueHref && <a href={catalogueHref} style={{ fontSize: "0.85rem", fontWeight: 700, color: accent, textDecoration: "none" }}>View full catalogue →</a>}
      </div>
      {products.length === 0 ? (
        <p style={{ color: "#999", fontSize: "0.9rem" }}>{itemLabel} you add from the dashboard will show up here automatically.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {products.map((item) => (
            <div key={item.id} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ aspectRatio: "4/3", background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(135deg, ${accent}22, ${accent}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!item.image && <Package size={32} strokeWidth={1.5} style={{ opacity: 0.3 }} />}
              </div>
              <div style={{ padding: "0.9rem 1rem" }}>
                <p style={{ fontFamily: font, fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{item.name}</p>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  {item.offerPrice != null && item.price != null && <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: "0.78rem" }}>{formatMoney(item.price, { currency, locale })}</span>}
                  {(item.offerPrice ?? item.price) != null && <span style={{ fontWeight: 800, color: accent, fontSize: "0.95rem" }}>{formatMoney(item.offerPrice ?? item.price, { currency, locale })}</span>}
                  {(!item.available || item.stockQty === 0) && <span style={{ background: "#f1f1f1", color: "#999", fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 999, textTransform: "uppercase" }}>Out of stock</span>}
                  {item.available && item.stockQty != null && item.stockQty > 0 && item.stockQty <= 5 && (
                    <span style={{ background: "#fff7ed", color: "#c2410c", fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 999, textTransform: "uppercase" }}>Only {item.stockQty} left</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Always shows real gallery photos passed in by the caller — never fake placeholders. */
export function GallerySection({ content, accent, font, images }: { content: any; accent: string; font: string; images: string[] }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div style={{ background: content.bgColor || "#f4f4f8", padding: "4rem 2.5rem" }}>
      <h2 style={{ fontFamily: font, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: content.textColor || "#0f0f13", margin: "0 0 2rem" }}>{content.heading || "Gallery"}</h2>
      {images.length === 0 ? (
        <p style={{ color: "#999", fontSize: "0.9rem" }}>Photos you upload from the Gallery page will show up here automatically.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img} alt="" loading="lazy" style={{ aspectRatio: "1", objectFit: "cover", width: "100%", borderRadius: 12, background: `${accent}22` }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AboutSection({ content, accent, font }: { content: any; accent: string; font: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div id="about" style={{ background: content.bgColor || "#fff", padding: "4rem 2.5rem", display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ flex: "1 1 300px" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, marginBottom: "0.5rem" }}>Our Story</div>
        <h2 style={{ fontFamily: font, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: content.textColor || "#0f0f13", margin: 0, lineHeight: 1.15 }}>{content.heading || "About Us"}</h2>
        <p style={{ marginTop: "1rem", fontSize: "1.02rem", color: "#555", lineHeight: 1.7 }}>{content.text}</p>
      </div>
      <div style={{ flex: "1 1 260px", aspectRatio: "4/3", borderRadius: 20, background: content.image ? `url(${content.image}) center/cover` : `linear-gradient(135deg, ${accent}22, ${accent}44)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!content.image && <Building2 size={56} strokeWidth={1.25} style={{ opacity: 0.3 }} />}
      </div>
    </div>
  );
}

export function CtaSection({ content, font, href, interactive = true }: { content: any; accent?: string; font: string; href?: string | null; interactive?: boolean }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div style={{ background: `linear-gradient(135deg, ${content.bgColor}, color-mix(in srgb, ${content.bgColor} 70%, #7c3aed))`, color: content.textColor, padding: "4.5rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: font, fontSize: "clamp(1.7rem,4vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>{content.heading}</h2>
        <p style={{ marginTop: "0.85rem", fontSize: "1.05rem", opacity: 0.85 }}>{content.subline}</p>
        {content.cta && (
          <a href={href ?? "#contact"} onClick={interactive ? undefined : (e) => { e.preventDefault(); e.stopPropagation(); }} aria-disabled={!interactive || undefined} style={{ marginTop: "2rem", background: "#fff", color: content.bgColor, borderRadius: 12, padding: "0.9rem 2.2rem", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", fontFamily: font, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", textDecoration: "none", display: "inline-block" }}>{content.cta} <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
        )}
      </div>
    </div>
  );
}

/** Always shows the real phone/WhatsApp/address passed in by the caller, plus the site's actual enquiry form. */
export function ContactSection({ content, accent = "#6366f1", font, contact, enquiryNode, interactive = true }: { content: any; accent?: string; font: string; contact: RealContact; enquiryNode?: ReactNode; interactive?: boolean }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const rows = [
    contact.phone ? { icon: Phone, label: "Phone", value: contact.phone, href: contact.callHref } : null,
    contact.whatsapp ? { icon: MessageCircle, label: "WhatsApp", value: contact.whatsapp, href: contact.whatsappHref } : null,
    contact.address ? { icon: MapPin, label: "Address", value: contact.address, href: null } : null,
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string; href?: string | null }[];

  return (
    <div id="contact" style={{ background: content.bgColor || "#f4f4f8", padding: "4rem 2.5rem" }}>
      <h2 style={{ fontFamily: font, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: content.textColor || "#0f0f13", margin: "0 0 2rem" }}>{content.heading || "Contact Us"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", maxWidth: 800, marginBottom: rows.length ? "2rem" : 0 }}>
        {rows.map((item, i) => (
          <a key={i} href={item.href ?? undefined} onClick={interactive ? undefined : (e) => { e.preventDefault(); e.stopPropagation(); }} aria-disabled={!interactive || undefined} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: "1.25rem", textDecoration: "none", color: "inherit", display: "block" }}>
            <span style={{ color: accent, display: "inline-flex" }}><item.icon size={22} strokeWidth={1.9} /></span>
            <p style={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#888", margin: "0.5rem 0 0.2rem" }}>{item.label}</p>
            <p style={{ fontWeight: 700, color: content.textColor || "#0f0f13", fontSize: "0.92rem" }}>{item.value}</p>
          </a>
        ))}
      </div>
      {enquiryNode && <div style={{ maxWidth: 420 }}>{enquiryNode}</div>}
    </div>
  );
}

export function DividerSection({ content }: { content: any; accent?: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div style={{ background: content.bgColor || "#fff", padding: "1rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }} />
      {content.label && <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#aaa" }}>{content.label}</span>}
      <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }} />
    </div>
  );
}
