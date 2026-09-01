import type { WebsiteSnapshot } from "@/lib/snapshot";
import { computeOfferStatus } from "@/lib/offerStatus";
import { resolveLinkTarget } from "@/lib/linkTargets";
import { formatMoney, terminology } from "@/lib/businessConfig";

/**
 * One data-derivation layer shared by every template (Editorial / Boutique /
 * Conversion) and by both render paths (the live Next.js route, and the
 * static-file export via ReactDOMServer). Templates only decide how this
 * data looks — never re-derive it — so "products grouped by category" or
 * "which pillars qualify" can never drift between templates or between the
 * live site and the downloadable file.
 */

export type ResolvedLink = { href: string; external: boolean } | null;

/** Injected by the caller so templates never know whether they're being
 * rendered live (real /uploads URLs, real Next routes) or exported to a
 * static file (data URIs, in-page anchors only, no catalogue route). */
export type TemplateEnv = {
  img: (assetId: string | null | undefined) => string | null;
  resolveLink: (type: string | null | undefined, value: string | null | undefined) => ResolvedLink;
  catalogueHref: string | null;
  enquiryNode: unknown; // ReactNode, typed loosely here to keep this file JSX-free
};

export function makeLiveEnv(snapshot: WebsiteSnapshot, previewSlug: string, enquiryNode: unknown): TemplateEnv {
  const settings = snapshot.settings;
  const linkCtx = { phone: settings?.phone, whatsapp: settings?.whatsapp, phoneCountryCode: settings?.phoneCountryCode, mapsUrl: settings?.mapsUrl, previewSlug };
  return {
    img: (assetId) => (assetId ? snapshot.mediaAssets.find((a) => a.id === assetId)?.url ?? null : null),
    resolveLink: (type, value) => resolveLinkTarget({ type, value, ...linkCtx }),
    catalogueHref: `/sites/${previewSlug}/catalogue`,
    enquiryNode,
  };
}

/** Static export's rewrite rules: "scroll"/"enquiry" become bare #anchors
 * (no /sites/{slug} prefix — the target is in the same file), "catalogue"
 * is dropped (it's a separate live route, not bundled into the file). */
export function makeExportEnv(
  snapshot: WebsiteSnapshot,
  previewSlug: string,
  imgMap: Record<string, string>,
  enquiryNode: unknown
): TemplateEnv {
  const settings = snapshot.settings;
  const linkCtx = { phone: settings?.phone, whatsapp: settings?.whatsapp, phoneCountryCode: settings?.phoneCountryCode, mapsUrl: settings?.mapsUrl, previewSlug };
  return {
    img: (assetId) => (assetId ? imgMap[assetId] ?? null : null),
    resolveLink: (type, value) => {
      if (type === "catalogue") return null;
      const resolved = resolveLinkTarget({ type, value, ...linkCtx });
      if (!resolved) return null;
      const prefix = `/sites/${previewSlug}#`;
      if (resolved.href.startsWith(prefix)) return { href: `#${resolved.href.slice(prefix.length)}`, external: false };
      return resolved;
    },
    catalogueHref: null,
    enquiryNode,
  };
}

export type Pillar = { icon: string; title: string; desc: string };
export type Step = { title: string; desc: string };

/** Single source of truth for "can this product actually be sold right
 * now" — combines both signals a merchant can set (the `available`
 * toggle and a numeric `stockQty`). Every template and the public
 * catalogue page must call this instead of checking either field alone,
 * so an unavailable/out-of-stock product reads the same everywhere. */
export function isProductSellable(p: { available: boolean; stockQty: number | null }): boolean {
  return p.available && (p.stockQty === null || p.stockQty > 0);
}

export function deriveTemplateData(snapshot: WebsiteSnapshot, env: TemplateEnv, previewSlug: string) {
  const settings = snapshot.settings;
  const terms = terminology(settings?.category);
  const enabled = (key: string) => snapshot.sections.find((s) => s.key === key)?.enabled ?? false;

  const visibleProducts = snapshot.products.filter((p) => !p.hidden);
  const visibleCategories = snapshot.categories.filter((c) => !c.hidden);
  const productsByCategory = new Map<string, typeof visibleProducts>();
  for (const p of visibleProducts) {
    const key = p.categoryId ?? "uncategorised";
    if (!productsByCategory.has(key)) productsByCategory.set(key, []);
    productsByCategory.get(key)!.push(p);
  }
  const productGroups = [...productsByCategory.entries()].map(([catId, products]) => ({
    category: visibleCategories.find((c) => c.id === catId) ?? null,
    products,
  }));

  const activeOffers = snapshot.offers.filter((o) => computeOfferStatus(o) === "active");
  const galleryImages = snapshot.gallery.filter((g) => !g.hidden).sort((a, b) => a.order - b.order);

  const primaryCta = snapshot.homepage?.primaryCta
    ? { label: snapshot.homepage.primaryCta, link: env.resolveLink(snapshot.homepage.primaryCtaType, snapshot.homepage.primaryCtaValue) }
    : null;
  const secondaryCta = snapshot.homepage?.secondaryCta
    ? { label: snapshot.homepage.secondaryCta, link: env.resolveLink(snapshot.homepage.secondaryCtaType, snapshot.homepage.secondaryCtaValue) }
    : null;

  const whatsappLink = settings?.whatsapp && enabled("whatsapp")
    ? resolveLinkTarget({ type: "whatsapp", value: `Hi ${settings?.businessName}, I have a question.`, phone: settings?.phone, whatsapp: settings?.whatsapp, phoneCountryCode: settings?.phoneCountryCode, mapsUrl: settings?.mapsUrl, previewSlug })
    : null;
  const callLink = settings?.phone
    ? resolveLinkTarget({ type: "call", value: null, phone: settings?.phone, whatsapp: settings?.whatsapp, phoneCountryCode: settings?.phoneCountryCode, mapsUrl: settings?.mapsUrl, previewSlug })
    : null;
  const whatsappHref = whatsappLink?.href ?? null;
  const callHref = callLink?.href ?? null;

  const pillars: Pillar[] = [];
  if (whatsappHref) pillars.push({ icon: "MessageCircle", title: "Order on WhatsApp", desc: "Message us directly — no app or account needed." });
  if (activeOffers.length > 0 && enabled("offers")) pillars.push({ icon: "Tag", title: "Live Offers", desc: `${activeOffers.length} offer${activeOffers.length === 1 ? "" : "s"} running right now.` });
  if (enabled("products") && visibleProducts.length > 0) pillars.push({ icon: "ShoppingBag", title: "Browse the Range", desc: `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} to choose from.` });
  if (settings?.mapsUrl && enabled("location")) pillars.push({ icon: "MapPin", title: "Easy to Find", desc: "Get directions in one tap." });
  if (settings?.hours) pillars.push({ icon: "Clock3", title: "Know Before You Go", desc: settings.hours });
  const showPillars = enabled("whyus") && pillars.length > 0;

  const steps: Step[] = [
    { title: "Browse", desc: enabled("products") && visibleProducts.length > 0 ? "See what's available right here on the page." : "Take a look at what we offer." },
  ];
  if (whatsappHref) steps.push({ title: "Message Us", desc: "Send a WhatsApp message with what you're looking for." });
  else if (callHref) steps.push({ title: "Call Us", desc: "Give us a call to ask about anything." });
  steps.push({ title: "We Confirm", desc: "We'll confirm availability, pricing, and next steps." });
  if (settings?.address || settings?.mapsUrl) steps.push({ title: "Visit or Arrange Pickup", desc: "Come by, or ask us about delivery." });

  const coverImage = env.img(galleryImages.find((g) => g.isCover)?.assetId ?? galleryImages[0]?.assetId ?? null);

  const money = (value: number | null | undefined) => formatMoney(value, settings);

  return {
    settings,
    enabled,
    visibleProducts,
    visibleCategories,
    productGroups,
    activeOffers,
    galleryImages,
    primaryCta,
    secondaryCta,
    whatsappHref,
    callHref,
    pillars,
    showPillars,
    steps,
    coverImage,
    discounts: snapshot.discounts,
    previewSlug,
    money,
    terms,
  };
}

export type TemplateData = ReturnType<typeof deriveTemplateData>;
