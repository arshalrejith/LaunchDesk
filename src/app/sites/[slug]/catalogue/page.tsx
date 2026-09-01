import { notFound } from "next/navigation";
import Link from "next/link";
import { Globe2, Clock3 } from "lucide-react";
import type { CSSProperties } from "react";
import { getPublishedWebsite } from "@/lib/publicSite";
import { formatMoney } from "@/lib/businessConfig";
import { resolveLinkTarget } from "@/lib/linkTargets";
import { defaultSiteColors } from "@/lib/templateColors";
import EnquireButton from "../enquire-button";

export default async function PublicCataloguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedWebsite(slug);

  if (!result.found) notFound();
  if (!result.live) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)] px-6 py-16 text-center">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)]"><Globe2 size={22} /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gray-400)]">Catalogue coming soon</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--gray-900)]">{result.businessName ?? "This catalogue"}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--gray-500)]">The catalogue is being prepared and has not been published yet.</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--gray-100)] px-3 py-1.5 text-xs font-medium text-[var(--gray-600)]"><Clock3 size={13} /> Publishing in progress</div>
        </div>
      </main>
    );
  }

  const { snapshot, previewSlug, templateId } = result;
  const catalogue = snapshot.catalogue;
  const defaults = defaultSiteColors(templateId);
  const brandVars = {
    "--site-bg": snapshot.brand?.backgroundColor || defaults.bg,
    "--site-accent": snapshot.brand?.primaryColor || defaults.accent,
  } as CSSProperties;

  if (!catalogue) {
    return (
      <main className="site-page" style={brandVars}>
        <section className="band light" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
          <div className="wrap"><p>No catalogue has been set up yet.</p></div>
        </section>
      </main>
    );
  }

  let includedIds: string[] = [];
  try {
    includedIds = catalogue.categoryIds ? JSON.parse(catalogue.categoryIds) : [];
  } catch {
    includedIds = [];
  }

  const categories = snapshot.categories.filter((c) => includedIds.includes(c.id) && !c.hidden);
  const settings = snapshot.settings;

  return (
    <main className="site-page" style={brandVars}>
      <section className="band light tight">
        <div className="wrap">
          <Link href={`/sites/${previewSlug}`} className="back-link">← {settings?.businessName}</Link>
          <p className="eyebrow" style={{ marginTop: "1.25rem" }}>Full Range</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)", marginTop: "0.4rem" }}>{catalogue.title || `${settings?.businessName} — Catalogue`}</h1>
          {catalogue.description && <p className="lede" style={{ marginTop: "0.6rem" }}>{catalogue.description}</p>}
        </div>
      </section>

      <section className="band cream">
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {categories.length === 0 && <p style={{ color: "color-mix(in srgb, var(--site-ink) 65%, transparent)" }}>No categories are included in this catalogue yet.</p>}
          {categories.map((cat) => {
            const products = snapshot.products.filter((p) => p.categoryId === cat.id && !p.hidden);
            if (products.length === 0) return null;
            return (
              <div key={cat.id}>
                <h2 className="cat-title" style={{ marginTop: 0 }}>{cat.name}</h2>
                <div className="card-grid">
                  {products.map((p) => (
                    <div key={p.id} className="card">
                      <div className="card-body">
                        <p className="card-title">{p.name}</p>
                        {catalogue.showDescriptions && p.shortDesc && <p className="card-desc">{p.shortDesc}</p>}
                        {catalogue.showPrices && (p.price != null || p.offerPrice != null) && (
                          <p className="card-price">
                            {p.offerPrice ? (<><span className="strike">{formatMoney(p.price, result.snapshot.settings)}</span>{formatMoney(p.offerPrice, result.snapshot.settings)}</>) : (<>{formatMoney(p.price, result.snapshot.settings)}</>)}
                          </p>
                        )}
                        {!p.available ? (
                          <p className="card-desc" style={{ color: "#b45309", fontWeight: 600 }}>Out of stock</p>
                        ) : (
                          p.stockQty !== null && p.stockQty <= 5 && (
                            <p className="card-desc" style={{ color: "#b45309", fontWeight: 600 }}>{p.stockQty === 0 ? "Out of stock" : `Only ${p.stockQty} left`}</p>
                          )
                        )}
                        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                          {catalogue.showWhatsapp && settings?.whatsapp && (
                            <a
                              href={resolveLinkTarget({ type: "whatsapp", value: `Hi, I'd like to ask about ${p.name}`, phone: settings.phone, whatsapp: settings.whatsapp, phoneCountryCode: settings.phoneCountryCode, mapsUrl: settings.mapsUrl, previewSlug })?.href ?? "#"}
                              target="_blank"
                              rel="noopener"
                              className="btn-wa"
                              style={{ borderRadius: 999, padding: "0.5rem 0.9rem", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}
                            >
                              WhatsApp
                            </a>
                          )}
                          {catalogue.showEnquiry && <EnquireButton slug={previewSlug} productName={p.name} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
