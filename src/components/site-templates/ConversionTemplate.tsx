import { Fragment, type ReactNode } from "react";
import { MapPin, Phone } from "lucide-react";
import { deriveTemplateData } from "@/lib/templateData";
import { PillarIcon, WhatsAppIcon } from "./icons";
import type { TemplateComponentProps } from "./types";

/**
 * CONVERSION — loud, action-first, local-commerce feel. Bold accent-block
 * hero (not centered/organic like Editorial, not split-image like Boutique),
 * a real-numbers stat strip, sharp borders everywhere (zero rounded corners
 * — the one deliberate rule that keeps this visually distinct at a glance),
 * horizontal step strip instead of a vertical timeline, and — the one
 * structural element unique to this template — a sticky bottom Call/WhatsApp
 * bar instead of a floating round button. Barlow Condensed/Barlow pairing.
 */
export default function ConversionTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const settings = d.settings;

  const stats: { n: string; label: string }[] = [];
  if (d.visibleProducts.length > 0) stats.push({ n: String(d.visibleProducts.length), label: d.terms.items });
  if (d.activeOffers.length > 0) stats.push({ n: String(d.activeOffers.length), label: "Offers Live" });
  if (d.visibleCategories.length > 0) stats.push({ n: String(d.visibleCategories.length), label: "Categories" });
  stats.push({ n: d.whatsappHref ? "Yes" : "Call", label: d.whatsappHref ? "WhatsApp Ready" : "Direct Line" });

  return (
    <div className="tpl-conversion">
      <style>{`
        .tpl-conversion {
          --c-ink: #17130f; font-family: var(--font-barlow), ui-sans-serif, sans-serif; color: var(--c-ink);
          padding-bottom: 4.5rem; /* clears the sticky bottom bar */
        }
        .tpl-conversion * { border-radius: 0 !important; }
        .tpl-conversion h1, .tpl-conversion h2, .tpl-conversion h3 {
          font-family: var(--font-barlow-condensed), ui-sans-serif, sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 0.01em; line-height: 0.98;
        }
        .tpl-conversion .c-topbar { background: var(--c-ink); color: #fff; font-size: 0.8rem; padding: 0.5rem clamp(1.25rem,5vw,2.5rem); display: flex; gap: 1.25rem; flex-wrap: wrap; }
        .tpl-conversion .c-topbar a { color: #fff; text-decoration: none; font-weight: 600; }

        .tpl-conversion .c-hero { background: var(--site-accent); color: #fff; border-bottom: 3px solid var(--c-ink); padding: clamp(2.5rem,7vw,4rem) clamp(1.25rem,5vw,2.5rem); }
        .tpl-conversion .c-eyebrow { display: inline-block; background: #fff; color: var(--c-ink); font-weight: 800; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.3rem 0.7rem; }
        .tpl-conversion .c-hero h1 { font-size: clamp(2.4rem, 7vw, 4.2rem); margin-top: 0.75rem; max-width: 16ch; }
        .tpl-conversion .c-hero p.lede { margin-top: 0.75rem; max-width: 44ch; font-size: 1.1rem; opacity: 0.92; font-weight: 500; }
        .tpl-conversion .c-cta-row { margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .tpl-conversion .c-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.5rem; font-weight: 700; font-size: 0.95rem; text-decoration: none; border: 2px solid transparent; }
        .tpl-conversion .c-btn-solid { background: var(--c-ink); color: #fff; }
        .tpl-conversion .c-btn-outline { border-color: #fff; color: #fff; }

        .tpl-conversion .c-stats { display: grid; grid-template-columns: repeat(2, 1fr); border-bottom: 3px solid var(--c-ink); }
        @media (min-width: 700px) { .tpl-conversion .c-stats { grid-template-columns: repeat(${Math.max(stats.length, 1)}, 1fr); } }
        .tpl-conversion .c-stat { padding: 1.4rem 1rem; text-align: center; border-right: 1px solid color-mix(in srgb, var(--c-ink) 20%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--c-ink) 20%, transparent); }
        .tpl-conversion .c-stat b { display: block; font-family: var(--font-barlow-condensed), sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--site-accent); }
        .tpl-conversion .c-stat span { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: color-mix(in srgb, var(--c-ink) 65%, transparent); }

        .tpl-conversion .c-section { padding-block: clamp(2.5rem, 6vw, 4rem); border-bottom: 1px solid color-mix(in srgb, var(--c-ink) 15%, transparent); }
        .tpl-conversion .c-section.alt { background: var(--site-cream, #f5f0e6); }
        .tpl-conversion .c-section-head h2 { font-size: clamp(1.8rem, 4.5vw, 2.6rem); }

        .tpl-conversion .c-offer-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1.5rem; }
        @media (min-width: 640px) { .tpl-conversion .c-offer-grid { grid-template-columns: repeat(2, 1fr); } }
        .tpl-conversion .c-offer-card { border: 2px solid var(--c-ink); padding: 1.25rem; position: relative; }
        .tpl-conversion .c-offer-card .tag { position: absolute; top: -0.9rem; left: 1rem; background: var(--site-accent); color: #fff; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; padding: 0.25rem 0.6rem; }
        .tpl-conversion .c-offer-card .price { font-family: var(--font-barlow-condensed), sans-serif; font-size: 1.6rem; font-weight: 800; margin-top: 0.6rem; }
        .tpl-conversion .c-offer-card .strike { font-size: 1rem; opacity: 0.5; text-decoration: line-through; margin-right: 0.4rem; font-weight: 500; }

        .tpl-conversion .c-pillars { display: grid; grid-template-columns: 1fr; gap: 1px; margin-top: 1.5rem; background: var(--c-ink); border: 1px solid var(--c-ink); }
        @media (min-width: 640px) { .tpl-conversion .c-pillars { grid-template-columns: repeat(2, 1fr); } }
        .tpl-conversion .c-pillar { background: #fff; padding: 1.5rem; }
        .tpl-conversion .c-pillar h3 { font-size: 1.05rem; text-transform: none; font-weight: 800; }
        .tpl-conversion .c-pillar p { margin: 0.35rem 0 0; font-size: 0.88rem; color: color-mix(in srgb, var(--c-ink) 65%, transparent); }

        .tpl-conversion .c-product-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1.5rem; }
        @media (min-width: 640px) { .tpl-conversion .c-product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .tpl-conversion .c-product-grid { grid-template-columns: repeat(3, 1fr); } }
        .tpl-conversion .c-product-card { border: 2px solid var(--c-ink); background: #fff; }
        .tpl-conversion .c-product-img { aspect-ratio: 4/3; background: color-mix(in srgb, var(--c-ink) 6%, transparent); overflow: hidden; }
        .tpl-conversion .c-product-img img { width: 100%; height: 100%; object-fit: cover; }
        .tpl-conversion .c-product-body { padding: 1rem; }
        .tpl-conversion .c-product-body h3 { font-size: 1.1rem; text-transform: none; }
        .tpl-conversion .c-product-body .price-badge { display: inline-block; margin-top: 0.5rem; background: var(--c-ink); color: #fff; font-weight: 700; font-size: 0.9rem; padding: 0.25rem 0.6rem; }
        .tpl-conversion .c-product-body .strike { text-decoration: line-through; opacity: 0.6; margin-right: 0.35rem; }
        .tpl-conversion .c-cat-title { grid-column: 1/-1; font-size: 1.5rem; margin-top: 1.5rem; }
        .tpl-conversion .c-cat-title:first-child { margin-top: 0; }
        .tpl-conversion .c-stock { margin-top: 0.4rem; font-size: 0.78rem; font-weight: 700; color: #b91c1c; text-transform: uppercase; }

        .tpl-conversion .c-step-row { display: flex; flex-wrap: wrap; gap: 0; margin-top: 2rem; border: 2px solid var(--c-ink); }
        .tpl-conversion .c-step { flex: 1 1 200px; padding: 1.25rem; border-right: 2px solid var(--c-ink); }
        .tpl-conversion .c-step:last-child { border-right: none; }
        .tpl-conversion .c-step .num { font-family: var(--font-barlow-condensed), sans-serif; font-size: 2rem; font-weight: 800; color: var(--site-accent); }
        .tpl-conversion .c-step h3 { font-size: 1rem; text-transform: none; margin-top: 0.3rem; }
        .tpl-conversion .c-step p { font-size: 0.85rem; margin-top: 0.3rem; color: color-mix(in srgb, var(--c-ink) 65%, transparent); }

        .tpl-conversion .c-gallery-wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 1.5rem; }
        .tpl-conversion .c-gallery-wall img { width: 100%; aspect-ratio: 1; object-fit: cover; }

        .tpl-conversion .c-info-box { border: 2px solid var(--c-ink); padding: clamp(1.5rem,4vw,2.25rem); max-width: 34rem; }

        .tpl-conversion .c-footer { background: var(--c-ink); color: #fff; text-align: center; padding-block: 2rem; font-size: 0.85rem; }

        .tpl-conversion .c-sticky-bar {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display: flex; border-top: 3px solid var(--c-ink);
        }
        .tpl-conversion .c-sticky-bar a {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; font-size: 0.85rem; text-decoration: none;
        }
        .tpl-conversion .c-sticky-bar .call { background: var(--c-ink); color: #fff; }
        .tpl-conversion .c-sticky-bar .wa { background: #25d366; color: #fff; }
      `}</style>

      <div className="c-topbar">
        {d.callHref && <a href={d.callHref}><Phone size={15} /> {settings?.phone}</a>}
        {settings?.mapsUrl && d.enabled("location") && <a href={settings.mapsUrl} target="_blank" rel="noopener"><MapPin size={15} /> Directions</a>}
        {d.enabled("catalogue") && env.catalogueHref && <a href={env.catalogueHref}>Full Catalogue</a>}
      </div>

      {d.discounts.length > 0 && (
        <div style={{ background: "#fff", borderBottom: "3px solid var(--c-ink)", textAlign: "center", padding: "0.6rem 1rem", fontWeight: 700, fontSize: "0.85rem" }}>
          {d.discounts.map((disc) => (
            <span key={disc.id} className="mr-4">
              {disc.name}: {disc.type === "percent" ? `${disc.value}% off` : `${d.money(disc.value)} off`}
              {disc.code && ` — mention code ${disc.code} when you enquire`}
            </span>
          ))}
        </div>
      )}

      <section className="c-hero">
        <div className="wrap">
          <span className="c-eyebrow">{settings?.category ?? "Local Business"}</span>
          <h1>{settings?.businessName}</h1>
          {settings?.tagline && <p className="lede">{settings.tagline}</p>}
          {(d.primaryCta?.link || d.secondaryCta?.link) && (
            <div className="c-cta-row">
              {d.primaryCta?.link && (
                <a href={d.primaryCta.link.href} target={d.primaryCta.link.external ? "_blank" : undefined} rel={d.primaryCta.link.external ? "noopener" : undefined} className="c-btn c-btn-solid">
                  {d.primaryCta.label}
                </a>
              )}
              {d.secondaryCta?.link && (
                <a href={d.secondaryCta.link.href} target={d.secondaryCta.link.external ? "_blank" : undefined} rel={d.secondaryCta.link.external ? "noopener" : undefined} className="c-btn c-btn-outline">
                  {d.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {stats.length > 1 && (
        <div className="c-stats">
          {stats.map((s) => (
            <div key={s.label} className="c-stat"><b>{s.n}</b><span>{s.label}</span></div>
          ))}
        </div>
      )}

      {d.activeOffers.length > 0 && d.enabled("offers") && (
        <section className="c-section">
          <div className="wrap">
            <div className="c-section-head"><h2>Current Offers</h2></div>
            <div className="c-offer-grid">
              {d.activeOffers.map((o) => {
                const offerLink = o.cta ? env.resolveLink(o.ctaType || "whatsapp", o.ctaValue || o.whatsappMsg || o.name) : null;
                return (
                  <div key={o.id} className="c-offer-card">
                    <span className="tag">Offer</span>
                    <p style={{ fontWeight: 700, marginTop: "0.3rem" }}>{o.name}</p>
                    {o.description && <p style={{ fontSize: "0.88rem", marginTop: "0.3rem" }}>{o.description}</p>}
                    {(o.originalPrice != null || o.offerPrice != null) && (
                      <p className="price">{o.offerPrice ? (<><span className="strike">{d.money(o.originalPrice)}</span>{d.money(o.offerPrice)}</>) : (<>{d.money(o.originalPrice)}</>)}</p>
                    )}
                    {offerLink && <a href={offerLink.href} target={offerLink.external ? "_blank" : undefined} rel={offerLink.external ? "noopener" : undefined} className="c-btn c-btn-solid" style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", fontSize: "0.8rem" }}>{o.cta}</a>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {d.showPillars && (
        <section className="c-section alt">
          <div className="wrap">
            <div className="c-section-head"><h2>Why {settings?.businessName}</h2></div>
            <div className="c-pillars">
              {d.pillars.map((p) => (
                <div key={p.title} className="c-pillar">
                  <span style={{ fontSize: "1.3rem" }}><PillarIcon name={p.icon} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.description && d.enabled("about") && (
        <section id="about" className="c-section">
          <div className="wrap">
            <div className="c-section-head"><h2>About</h2></div>
            <p style={{ marginTop: "0.75rem", maxWidth: "62ch", fontSize: "1.05rem" }}>{settings.description}</p>
          </div>
        </section>
      )}

      {d.enabled("products") && d.visibleProducts.length > 0 && (
        <section id="products" className="c-section alt">
          <div className="wrap">
            <div className="c-section-head"><h2>{d.terms.items}</h2></div>
            <div className="c-product-grid">
              {d.productGroups.map((group) => (
                <Fragment key={group.category?.id ?? "uncategorised"}>
                  {d.enabled("categories") && <h3 className="c-cat-title">{group.category?.name ?? "Other"}</h3>}
                  {group.products.map((p) => {
                    const img = env.img(p.imageAssetId);
                    return (
                      <div key={p.id} className="c-product-card">
                        <div className="c-product-img">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt={p.name} />
                          ) : null}
                        </div>
                        <div className="c-product-body">
                          <h3>{p.name} {p.featured && "★"}</h3>
                          {p.shortDesc && <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>{p.shortDesc}</p>}
                          {(p.price != null || p.offerPrice != null) && (
                            <p className="price-badge">{p.offerPrice ? (<><span className="strike">{d.money(p.price)}</span>{d.money(p.offerPrice)}</>) : (<>{d.money(p.price)}</>)}</p>
                          )}
                          {!p.available ? (
                            <p className="c-stock">Out of stock</p>
                          ) : (
                            p.stockQty !== null && p.stockQty <= 5 && (
                              <p className="c-stock">{p.stockQty === 0 ? "Out of stock" : `Only ${p.stockQty} left`}</p>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="c-section">
        <div className="wrap">
          <div className="c-section-head"><h2>How to Order</h2></div>
          <div className="c-step-row">
            {d.steps.map((s, i) => (
              <div key={s.title} className="c-step">
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.enabled("gallery") && d.galleryImages.length > 0 && (
        <section className="c-section alt">
          <div className="wrap">
            <div className="c-section-head"><h2>Gallery</h2></div>
            <div className="c-gallery-wall">
              {d.galleryImages.map((g) => {
                const url = env.img(g.assetId);
                return url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={g.id} src={url} alt="" loading="lazy" />
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}

      {(d.enabled("enquiry") || d.enabled("location")) && (
        <section id="enquire" className="c-section">
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            {d.enabled("enquiry") && (
              <div style={{ flex: "1 1 20rem" }}>
                <div className="c-section-head"><h2>Enquire</h2></div>
                <div style={{ marginTop: "1rem" }}>{env.enquiryNode as ReactNode}</div>
              </div>
            )}
            {d.enabled("location") && (settings?.address || settings?.hours) && (
              <div id="location" className="c-info-box">
                <h3 style={{ fontSize: "1.2rem" }}>Location &amp; Hours</h3>
                <p style={{ marginTop: "0.6rem" }}>{[settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ")}</p>
                {settings?.hours && <p style={{ marginTop: "0.3rem", fontWeight: 700 }}>{settings.hours}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="c-footer">{settings?.businessName}</footer>

      {(d.callHref || d.whatsappHref) && (
        <div className="c-sticky-bar">
          {d.callHref && <a href={d.callHref} className="call"><Phone size={15} /> Call Now</a>}
          {d.whatsappHref && <a href={d.whatsappHref} target="_blank" rel="noopener" className="wa"><WhatsAppIcon size={18} /> WhatsApp</a>}
        </div>
      )}
    </div>
  );
}
