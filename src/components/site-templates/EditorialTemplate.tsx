import type { ReactNode } from "react";
import { deriveTemplateData } from "@/lib/templateData";
import { PillarIcon, WhatsAppFab } from "./icons";
import type { TemplateComponentProps } from "./types";

/**
 * EDITORIAL — organic hero shapes, alternating full-bleed bands, a numbered
 * "How to reach us" timeline and fact-based "Why Us" pillars on dark bands.
 * Fraunces/Inter pairing. This was the first template built; the other two
 * (Boutique, Conversion) are deliberately structured differently — different
 * hero shape, different product presentation, different section order —
 * not just different colors.
 */
export default function EditorialTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const settings = d.settings;

  return (
    <div className="tpl-editorial">
      <style>{`
        .tpl-editorial section.band { padding-block: clamp(3rem, 8vw, 5rem); position: relative; overflow: hidden; }
        .tpl-editorial section.band.light { background: var(--site-bg); }
        .tpl-editorial section.band.cream { background: var(--site-cream); }
        .tpl-editorial section.band.dark { background: var(--site-dark); color: #f3efe6; }
        .tpl-editorial section.band.dark .eyebrow { color: var(--site-accent); }

        .tpl-editorial .hero { padding-block: clamp(3rem, 9vw, 6rem) clamp(2rem, 6vw, 3.5rem); }
        .tpl-editorial .hero-shape-fill {
          position: absolute; top: -6rem; right: -6rem; width: 22rem; height: 22rem; border-radius: 50%;
          background: var(--site-soft); z-index: 0;
        }
        .tpl-editorial .hero-shape-ring {
          position: absolute; top: -3rem; right: 6rem; width: 14rem; height: 14rem; border-radius: 50%;
          border: 3px solid var(--site-ring); opacity: 0.35; z-index: 0;
        }
        .tpl-editorial .hero-inner { position: relative; z-index: 1; }
        .tpl-editorial .hero h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); max-width: 18ch; margin-top: 0.6rem; }
        .tpl-editorial .hero p.lede { margin-top: 1rem; max-width: 56ch; color: color-mix(in srgb, var(--site-ink) 70%, transparent); font-size: 1.08rem; }
        .tpl-editorial .cta-row { margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }

        .tpl-editorial .contact-bar { display: flex; flex-wrap: wrap; gap: 0.6rem; border-top: 1px solid color-mix(in srgb, var(--site-ink) 12%, transparent); padding-block: 1.1rem; }

        .tpl-editorial .pillar-grid { display: grid; grid-template-columns: 1fr; gap: 1px; margin-top: 2rem; background: color-mix(in srgb, #fff 12%, transparent); border-radius: 20px; overflow: hidden; }
        @media (min-width: 640px) { .tpl-editorial .pillar-grid { grid-template-columns: repeat(2, 1fr); } }
        .tpl-editorial .pillar { background: var(--site-dark); padding: 1.75rem; }
        .tpl-editorial .pillar:nth-child(4n+1) { background: color-mix(in srgb, var(--site-dark) 60%, black); }
        .tpl-editorial .pillar:nth-child(4n+2) { background: var(--site-accent); color: #fff; }
        .tpl-editorial .pillar:nth-child(4n+3) { background: color-mix(in srgb, var(--site-dark) 82%, var(--site-accent)); }
        .tpl-editorial .pillar-icon { font-size: 1.5rem; }
        .tpl-editorial .pillar h3 { font-size: 1.15rem; margin-top: 0.6rem; color: #fff; }
        .tpl-editorial .pillar p { margin: 0.4rem 0 0; font-size: 0.88rem; color: color-mix(in srgb, #fff 78%, transparent); }

        .tpl-editorial .steps { margin-top: 2.5rem; display: flex; flex-direction: column; gap: 0; max-width: 42rem; }
        .tpl-editorial .step { display: grid; grid-template-columns: 2.75rem 1fr; gap: 1rem; padding-bottom: 2rem; position: relative; }
        .tpl-editorial .step:not(:last-child)::before {
          content: ""; position: absolute; left: 1.35rem; top: 2.75rem; bottom: 0; width: 2px;
          background: color-mix(in srgb, var(--site-accent) 40%, transparent);
        }
        .tpl-editorial .step-num {
          width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--site-accent); color: #fff;
          display: flex; align-items: center; justify-content: center; font-family: var(--font-fraunces), serif; font-weight: 700; font-size: 1.1rem;
          z-index: 1;
        }
        .tpl-editorial .step h3 { font-size: 1.05rem; color: #fff; }
        .tpl-editorial .step p { margin: 0.3rem 0 0; font-size: 0.88rem; color: color-mix(in srgb, #fff 75%, transparent); }

        .tpl-editorial .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.85rem; margin-top: 1.75rem; }
        @media (min-width: 640px) { .tpl-editorial .gallery-grid { grid-template-columns: repeat(4, 1fr); } }
        .tpl-editorial .gallery-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }

        .tpl-editorial .cat-title { font-size: 1.25rem; margin-top: 2rem; }
        .tpl-editorial .cat-title:first-child { margin-top: 0; }
      `}</style>

      {d.discounts.length > 0 && (
        <div className="discount-banner">
          {d.discounts.map((disc) => (
            <span key={disc.id} className="mr-4">
              {disc.name}: {disc.type === "percent" ? `${disc.value}% off` : `${d.money(disc.value)} off`}
              {disc.code && ` — mention code ${disc.code} when you enquire`}
            </span>
          ))}
        </div>
      )}

      <section className="band light hero">
        <div className="hero-shape-fill" aria-hidden="true" />
        <div className="hero-shape-ring" aria-hidden="true" />
        <div className="wrap hero-inner">
          <p className="eyebrow">{settings?.category ?? "Local Business"}</p>
          <h1>{settings?.businessName}</h1>
          {settings?.tagline && <p className="lede">{settings.tagline}</p>}
          {(d.primaryCta?.link || d.secondaryCta?.link) && (
            <div className="cta-row">
              {d.primaryCta?.link && (
                <a href={d.primaryCta.link.href} target={d.primaryCta.link.external ? "_blank" : undefined} rel={d.primaryCta.link.external ? "noopener" : undefined} className="btn btn-solid">
                  {d.primaryCta.label}
                </a>
              )}
              {d.secondaryCta?.link && (
                <a href={d.secondaryCta.link.href} target={d.secondaryCta.link.external ? "_blank" : undefined} rel={d.secondaryCta.link.external ? "noopener" : undefined} className="btn btn-outline" style={{ color: "var(--site-ink)" }}>
                  {d.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="wrap contact-bar">
        {d.callHref && <a href={d.callHref} className="btn-dark" style={{ borderRadius: 999, padding: "0.6rem 1.15rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>Call {settings?.phone}</a>}
        {d.whatsappHref && <a href={d.whatsappHref} target="_blank" rel="noopener" className="btn-wa" style={{ borderRadius: 999, padding: "0.6rem 1.15rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>WhatsApp</a>}
        {settings?.mapsUrl && d.enabled("location") && (
          <a href={settings.mapsUrl} target="_blank" rel="noopener" className="btn-line">Get Directions</a>
        )}
        {d.enabled("catalogue") && env.catalogueHref && (
          <a href={env.catalogueHref} className="btn-line">View Catalogue</a>
        )}
      </div>

      {d.activeOffers.length > 0 && d.enabled("offers") && (
        <section className="band cream">
          <div className="wrap">
            <p className="eyebrow">Right Now</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem" }}>Current Offers</h2>
            <div className="card-grid">
              {d.activeOffers.map((o) => {
                const offerLink = o.cta ? env.resolveLink(o.ctaType || "whatsapp", o.ctaValue || o.whatsappMsg || o.name) : null;
                return (
                  <div key={o.id} className="card">
                    <div className="card-body">
                      <p className="card-title">{o.name}</p>
                      {o.description && <p className="card-desc">{o.description}</p>}
                      {(o.originalPrice != null || o.offerPrice != null) && (
                        <p className="card-price">
                          {o.offerPrice ? (<><span className="strike">{d.money(o.originalPrice)}</span>{d.money(o.offerPrice)}</>) : (<>{d.money(o.originalPrice)}</>)}
                        </p>
                      )}
                      {offerLink && (
                        <a href={offerLink.href} target={offerLink.external ? "_blank" : undefined} rel={offerLink.external ? "noopener" : undefined} className="btn btn-solid" style={{ marginTop: "0.75rem", padding: "0.55rem 1.1rem", fontSize: "0.8rem" }}>
                          {o.cta}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {d.showPillars && (
        <section className="band dark">
          <div className="wrap">
            <p className="eyebrow on-dark">Why {settings?.businessName}</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem", color: "#fff" }}>What you actually get</h2>
            <div className="pillar-grid">
              {d.pillars.map((p) => (
                <div key={p.title} className="pillar">
                  <span className="pillar-icon"><PillarIcon name={p.icon} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.description && d.enabled("about") && (
        <section id="about" className="band light">
          <div className="wrap">
            <p className="eyebrow">About</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", marginTop: "0.5rem", maxWidth: "36ch" }}>{settings.businessName}</h2>
            <p style={{ marginTop: "0.75rem", maxWidth: "62ch", fontSize: "1.02rem", color: "color-mix(in srgb, var(--site-ink) 75%, transparent)" }}>{settings.description}</p>
          </div>
        </section>
      )}

      {d.enabled("products") && d.visibleProducts.length > 0 && (
        <section id="products" className="band cream">
          <div className="wrap">
            <p className="eyebrow">In Stock</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem" }}>{d.terms.items}</h2>
            {d.productGroups.map((group) => (
              <div key={group.category?.id ?? "uncategorised"}>
                {d.enabled("categories") && <h3 className="cat-title">{group.category?.name ?? "Other"}</h3>}
                <div className="card-grid">
                  {group.products.map((p) => (
                    <div key={p.id} className="card">
                      <div className="card-body">
                        <p className="card-title">{p.name} {p.featured && <span style={{ color: "#d69e2e" }}>★</span>}</p>
                        {p.shortDesc && <p className="card-desc">{p.shortDesc}</p>}
                        {(p.price != null || p.offerPrice != null) && (
                          <p className="card-price">
                            {p.offerPrice ? (<><span className="strike">{d.money(p.price)}</span>{d.money(p.offerPrice)}</>) : (<>{d.money(p.price)}</>)}
                          </p>
                        )}
                        {!p.available ? (
                          <p className="stock">Out of stock</p>
                        ) : (
                          p.stockQty !== null && p.stockQty <= 5 && (
                            <p className="stock">{p.stockQty === 0 ? "Out of stock" : `Only ${p.stockQty} left`}</p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="band dark">
        <div className="wrap">
          <p className="eyebrow on-dark">The Process</p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem", color: "#fff", maxWidth: "18ch" }}>How to reach us</h2>
          <div className="steps">
            {d.steps.map((s, i) => (
              <div key={s.title} className="step">
                <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.enabled("gallery") && d.galleryImages.length > 0 && (
        <section className="band light">
          <div className="wrap">
            <p className="eyebrow">Gallery</p>
            <div className="gallery-grid">
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

      {d.enabled("enquiry") && (
        <section id="enquire" className="band cream">
          <div className="wrap">
            <p className="eyebrow">Get in Touch</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem" }}>Enquire</h2>
            <p style={{ marginTop: "0.5rem", marginBottom: "1.25rem", color: "color-mix(in srgb, var(--site-ink) 70%, transparent)" }}>Tell us what you&rsquo;re looking for and we&rsquo;ll get back to you.</p>
            {env.enquiryNode as ReactNode}
          </div>
        </section>
      )}

      {d.enabled("location") && (settings?.address || settings?.area || settings?.hours) && (
        <section id="location" className="band light">
          <div className="wrap">
            <p className="eyebrow">Find Us</p>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", marginTop: "0.5rem" }}>Location &amp; Hours</h2>
            <p style={{ marginTop: "0.5rem" }}>{[settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ")}</p>
            {settings?.hours && <p style={{ color: "color-mix(in srgb, var(--site-ink) 65%, transparent)" }}>{settings.hours}</p>}
          </div>
        </section>
      )}

      <footer className="site-footer band dark">{settings?.businessName}</footer>

      {d.whatsappHref && <WhatsAppFab href={d.whatsappHref} />}
    </div>
  );
}
