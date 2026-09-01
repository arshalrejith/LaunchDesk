import type { ReactNode } from "react";
import { deriveTemplateData } from "@/lib/templateData";
import { WhatsAppFab } from "./icons";
import type { TemplateComponentProps } from "./types";
import {
  HeroSection, StatsSection, FeaturesSection, ProductsSection, GallerySection,
  AboutSection, CtaSection, ContactSection, DividerSection,
  defaultSections, getGoogleFontHref, type BuilderSection,
} from "@/components/builder/sections";
import { normalizeBuilderAccent, normalizeBuilderFont, parseBuilderSections } from "@/lib/builderValidation";

/**
 * Renders whatever the client assembled in the Visual Page Builder
 * (Website.customPage.sectionsJson), selected via templateId "custom-builder"
 * exactly like any other template. Products/Gallery/Contact sections always
 * pull from the frozen snapshot's real data (see sections.tsx) — never from
 * whatever placeholder content the editor shows for an empty business.
 */
export default function CustomBuilderTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const settings = d.settings;

  const custom = snapshot.customPage;
  const accent = normalizeBuilderAccent(custom?.accent);
  const font = normalizeBuilderFont(custom?.font);
  let sections: BuilderSection[] = defaultSections(accent);
  if (custom?.sectionsJson) {
    try {
      sections = parseBuilderSections(JSON.parse(custom.sectionsJson), accent);
    } catch {
      sections = defaultSections(accent);
    }
  }

  const realProducts = d.visibleProducts.map((p) => ({
    id: p.id, name: p.name, price: p.price, offerPrice: p.offerPrice, available: p.available, stockQty: p.stockQty,
    image: env.img(p.imageAssetId),
  }));
  const realImages = d.galleryImages.map((g) => env.img(g.assetId)).filter((u): u is string => !!u);
  const contact = {
    phone: settings?.phone, whatsapp: settings?.whatsapp,
    address: [settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ") || null,
    callHref: d.callHref, whatsappHref: d.whatsappHref,
  };

  return (
    <div style={{ fontFamily: `'${font}', ui-sans-serif, sans-serif` }}>
      <style>{`@import url("${getGoogleFontHref(font)}");`}</style>
      {d.discounts.length > 0 && (
        <div className="discount-banner">
          {d.discounts.map((disc) => (
            <span key={disc.id} style={{ marginRight: "1rem" }}>
              {disc.name}: {disc.type === "percent" ? `${disc.value}% off` : `${d.money(disc.value)} off`}
              {disc.code && ` — mention code ${disc.code} when you enquire`}
            </span>
          ))}
        </div>
      )}

      {sections.map((sec) => {
        switch (sec.type) {
          case "hero":
            return <HeroSection key={sec.id} content={sec.content} font={font} primaryHref={d.whatsappHref ?? d.callHref ?? "#contact"} secondaryHref={d.enabled("products") ? "#products" : "#contact"} />;
          case "stats":
            return <StatsSection key={sec.id} content={sec.content} accent={accent} font={font} />;
          case "features":
            return <FeaturesSection key={sec.id} content={sec.content} font={font} />;
          case "products":
            return d.enabled("products") ? <ProductsSection key={sec.id} content={sec.content} accent={accent} font={font} products={realProducts} catalogueHref={env.catalogueHref} currency={settings?.currency || "USD"} locale={settings?.locale || "en-US"} itemLabel={d.terms.items} /> : null;
          case "gallery":
            return d.enabled("gallery") ? <GallerySection key={sec.id} content={sec.content} accent={accent} font={font} images={realImages} /> : null;
          case "about":
            return <AboutSection key={sec.id} content={sec.content} accent={accent} font={font} />;
          case "cta":
            return <CtaSection key={sec.id} content={sec.content} font={font} href={d.whatsappHref ?? d.callHref ?? "#contact"} />;
          case "contact":
            return d.enabled("enquiry") || contact.phone || contact.whatsapp || contact.address
              ? <ContactSection key={sec.id} content={sec.content} font={font} contact={contact} enquiryNode={d.enabled("enquiry") ? (env.enquiryNode as ReactNode) : undefined} />
              : null;
          case "divider":
            return <DividerSection key={sec.id} content={sec.content} />;
          default:
            return null;
        }
      })}

      <footer style={{ padding: "2.5rem", textAlign: "center", background: "#0f0f13", color: "rgba(255,255,255,0.75)" }}>
        <p>{settings?.businessName}</p>
      </footer>

      {d.whatsappHref && <WhatsAppFab href={d.whatsappHref} />}
    </div>
  );
}
