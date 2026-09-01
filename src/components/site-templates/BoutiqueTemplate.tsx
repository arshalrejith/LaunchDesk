import { Fragment, type ReactNode } from "react";
import { deriveTemplateData } from "@/lib/templateData";
import { PillarIcon, WhatsAppFab } from "./icons";
import type { TemplateComponentProps } from "./types";

/**
 * BOUTIQUE — elegant, image-led, magazine feel. Two-column split hero
 * instead of Editorial's centered hero with organic shapes. A "lookbook"
 * product grid (image-dominant, minimal text) instead of Editorial's
 * info-dense cards. A horizontal filmstrip gallery instead of a 4-up grid.
 * No numbered process section — a single "Visit" card instead. Cormorant
 * Garamond/Karla pairing, distinct from Editorial's Fraunces/Inter.
 */
export default function BoutiqueTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const settings = d.settings;

  return (
    <div className="tpl-boutique">
      <style>{`
        .tpl-boutique {
          --b-ink: #2a2420; --b-dark: #241b1e; --b-cream: #f3ece0;
          font-family: var(--font-karla), ui-sans-serif, sans-serif;
          color: var(--b-ink);
        }
        .tpl-boutique h1, .tpl-boutique h2, .tpl-boutique h3 {
          font-family: var(--font-cormorant), Georgia, serif; font-weight: 500; letter-spacing: 0; line-height: 1.1;
        }
        .tpl-boutique em { font-style: italic; color: var(--site-accent); }
        .tpl-boutique .b-topbar { display: flex; align-items: center; justify-content: space-between; padding: 1rem clamp(1.25rem,5vw,2.5rem); border-bottom: 1px solid color-mix(in srgb, var(--b-ink) 12%, transparent); }
        .tpl-boutique .b-wordmark { font-family: var(--font-cormorant), serif; font-size: 1.3rem; letter-spacing: 0.04em; }
        .tpl-boutique .b-topbar-links { display: flex; gap: 0.6rem; font-size: 0.78rem; }
        .tpl-boutique .b-topbar-links a { text-decoration: none; color: var(--b-ink); border-bottom: 1px solid currentColor; padding-bottom: 1px; }

        .tpl-boutique .b-hero { display: grid; grid-template-columns: 1fr; gap: 2.5rem; padding: clamp(2.5rem,7vw,4.5rem) clamp(1.25rem,5vw,2.5rem); background: var(--site-bg); }
        @media (min-width: 860px) { .tpl-boutique .b-hero { grid-template-columns: 0.9fr 1.1fr; align-items: center; } }
        .tpl-boutique .b-hero-frame { aspect-ratio: 4/5; border-radius: 4px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--b-ink) 15%, transparent); background: var(--b-cream); }
        .tpl-boutique .b-hero-frame img { width: 100%; height: 100%; object-fit: cover; }
        .tpl-boutique .b-eyebrow { text-transform: uppercase; letter-spacing: 0.22em; font-size: 0.68rem; font-weight: 600; color: var(--site-accent); }
        .tpl-boutique .b-hero h1 { font-size: clamp(2.1rem, 5.5vw, 3.4rem); margin-top: 0.75rem; max-width: 14ch; }
        .tpl-boutique .b-hero p.lede { margin-top: 1rem; max-width: 46ch; font-size: 1.05rem; color: color-mix(in srgb, var(--b-ink) 70%, transparent); }
        .tpl-boutique .b-cta-row { margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .tpl-boutique .b-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border: 1px solid var(--site-accent); }
        .tpl-boutique .b-btn-solid { background: var(--site-accent); color: #fff; }
        .tpl-boutique .b-btn-line { color: var(--b-ink); border-color: color-mix(in srgb, var(--b-ink) 30%, transparent); }

        .tpl-boutique .b-panel { padding-block: clamp(3rem, 7vw, 5rem); }
        .tpl-boutique .b-panel.alt { background: var(--b-cream); }
        .tpl-boutique .b-panel-head { text-align: center; margin-bottom: 2.5rem; }
        .tpl-boutique .b-panel-head h2 { font-size: clamp(1.8rem, 4vw, 2.4rem); margin-top: 0.5rem; }

        .tpl-boutique .b-offer-strip { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; scroll-snap-type: x mandatory; }
        .tpl-boutique .b-offer-card { scroll-snap-align: start; flex: 0 0 auto; min-width: 240px; border: 1px solid color-mix(in srgb, var(--b-ink) 15%, transparent); padding: 1.25rem; background: var(--site-bg); }
        .tpl-boutique .b-offer-card .price { font-weight: 600; margin-top: 0.5rem; }

        .tpl-boutique .b-checklist { max-width: 42rem; margin: 0 auto; display: flex; flex-direction: column; }
        .tpl-boutique .b-check-item { display: flex; gap: 1rem; padding-block: 1.1rem; border-bottom: 1px solid color-mix(in srgb, var(--b-ink) 12%, transparent); align-items: flex-start; }
        .tpl-boutique .b-check-item .icon { font-size: 1.2rem; }
        .tpl-boutique .b-check-item h3 { font-size: 1.05rem; font-family: var(--font-karla), sans-serif; font-weight: 700; }
        .tpl-boutique .b-check-item p { margin: 0.2rem 0 0; font-size: 0.9rem; color: color-mix(in srgb, var(--b-ink) 65%, transparent); }

        .tpl-boutique .b-pullquote { max-width: 46rem; margin: 0 auto; text-align: center; }
        .tpl-boutique .b-pullquote .mark { font-family: var(--font-cormorant), serif; font-size: 3.5rem; color: var(--site-accent); line-height: 1; }
        .tpl-boutique .b-pullquote p { font-family: var(--font-cormorant), serif; font-size: clamp(1.15rem, 2.5vw, 1.5rem); font-style: italic; line-height: 1.5; margin-top: -1rem; }

        .tpl-boutique .b-lookbook { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: color-mix(in srgb, var(--b-ink) 12%, transparent); border: 1px solid color-mix(in srgb, var(--b-ink) 12%, transparent); }
        @media (min-width: 720px) { .tpl-boutique .b-lookbook { grid-template-columns: repeat(3, 1fr); } }
        .tpl-boutique .b-piece { background: var(--site-bg); display: flex; flex-direction: column; }
        .tpl-boutique .b-piece-img { aspect-ratio: 3/4; background: var(--b-cream); overflow: hidden; }
        .tpl-boutique .b-piece-img img { width: 100%; height: 100%; object-fit: cover; }
        .tpl-boutique .b-piece-body { padding: 1rem 1.1rem; }
        .tpl-boutique .b-piece-body .cat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.14em; color: color-mix(in srgb, var(--b-ink) 55%, transparent); }
        .tpl-boutique .b-piece-body h3 { font-size: 1.15rem; margin-top: 0.3rem; }
        .tpl-boutique .b-piece-body .price { margin-top: 0.4rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--site-accent); }
        .tpl-boutique .b-piece-body .strike { color: color-mix(in srgb, var(--b-ink) 40%, transparent); text-decoration: line-through; font-weight: 400; margin-right: 0.35rem; }
        .tpl-boutique .b-piece-body .stock { margin-top: 0.35rem; font-size: 0.78rem; font-weight: 600; color: #b45309; }
        .tpl-boutique .b-cat-heading { grid-column: 1 / -1; padding: 1rem 1.1rem 0; font-family: var(--font-cormorant), serif; font-size: 1.4rem; background: var(--site-bg); }

        .tpl-boutique .b-filmstrip { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; }
        .tpl-boutique .b-filmstrip img { flex: 0 0 auto; width: 220px; height: 280px; object-fit: cover; border-radius: 2px; }

        .tpl-boutique .b-visit-card { max-width: 34rem; margin: 0 auto; border: 1px solid color-mix(in srgb, var(--b-ink) 15%, transparent); padding: clamp(1.75rem, 4vw, 2.5rem); text-align: center; }
        .tpl-boutique .b-visit-card dl { margin: 1.25rem 0 0; display: grid; gap: 0.65rem; text-align: left; }
        .tpl-boutique .b-visit-card dt { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: color-mix(in srgb, var(--b-ink) 55%, transparent); }
        .tpl-boutique .b-visit-card dd { margin: 0.15rem 0 0; font-size: 0.95rem; }

        .tpl-boutique .b-footer { padding-block: 2.5rem; text-align: center; background: var(--b-dark); color: color-mix(in srgb, #fff 75%, transparent); }
        .tpl-boutique .b-footer .wordmark { font-family: var(--font-cormorant), serif; font-size: 1.2rem; color: #fff; }
      `}</style>

      {d.discounts.length > 0 && (
        <div className="discount-banner" style={{ background: "var(--site-accent)", color: "#fff", textAlign: "center", padding: "0.6rem 1rem", fontSize: "0.82rem", fontWeight: 600 }}>
          {d.discounts.map((disc) => (
            <span key={disc.id} className="mr-4">
              {disc.name}: {disc.type === "percent" ? `${disc.value}% off` : `${d.money(disc.value)} off`}
              {disc.code && ` — mention code ${disc.code} when you enquire`}
            </span>
          ))}
        </div>
      )}

      <div className="b-topbar">
        <span className="b-wordmark">{settings?.businessName}</span>
        <div className="b-topbar-links">
          {d.callHref && <a href={d.callHref}>Call</a>}
          {d.whatsappHref && <a href={d.whatsappHref} target="_blank" rel="noopener">WhatsApp</a>}
          {d.enabled("catalogue") && env.catalogueHref && <a href={env.catalogueHref}>Catalogue</a>}
        </div>
      </div>

      <section className="b-hero">
        <div className="b-hero-frame">
          {d.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.coverImage} alt={settings?.businessName ?? ""} />
          ) : null}
        </div>
        <div>
          <p className="b-eyebrow">{settings?.category ?? "Boutique"}</p>
          <h1>{settings?.businessName}</h1>
          {settings?.tagline && <p className="lede">{settings.tagline}</p>}
          {(d.primaryCta?.link || d.secondaryCta?.link) && (
            <div className="b-cta-row">
              {d.primaryCta?.link && (
                <a href={d.primaryCta.link.href} target={d.primaryCta.link.external ? "_blank" : undefined} rel={d.primaryCta.link.external ? "noopener" : undefined} className="b-btn b-btn-solid">
                  {d.primaryCta.label}
                </a>
              )}
              {d.secondaryCta?.link && (
                <a href={d.secondaryCta.link.href} target={d.secondaryCta.link.external ? "_blank" : undefined} rel={d.secondaryCta.link.external ? "noopener" : undefined} className="b-btn b-btn-line">
                  {d.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {d.activeOffers.length > 0 && d.enabled("offers") && (
        <section className="b-panel alt">
          <div className="wrap">
            <div className="b-panel-head"><p className="b-eyebrow">Right Now</p><h2>Current Offers</h2></div>
            <div className="b-offer-strip">
              {d.activeOffers.map((o) => {
                const offerLink = o.cta ? env.resolveLink(o.ctaType || "whatsapp", o.ctaValue || o.whatsappMsg || o.name) : null;
                return (
                  <div key={o.id} className="b-offer-card">
                    <p style={{ fontWeight: 600 }}>{o.name}</p>
                    {o.description && <p style={{ fontSize: "0.88rem", marginTop: "0.3rem", color: "color-mix(in srgb, var(--b-ink) 65%, transparent)" }}>{o.description}</p>}
                    {(o.originalPrice != null || o.offerPrice != null) && (
                      <p className="price">{o.offerPrice ? (<><span style={{ textDecoration: "line-through", opacity: 0.5, marginRight: "0.3rem" }}>{d.money(o.originalPrice)}</span>{d.money(o.offerPrice)}</>) : (<>{d.money(o.originalPrice)}</>)}</p>
                    )}
                    {offerLink && <a href={offerLink.href} target={offerLink.external ? "_blank" : undefined} rel={offerLink.external ? "noopener" : undefined} className="b-btn b-btn-solid" style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", fontSize: "0.72rem" }}>{o.cta}</a>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {d.showPillars && (
        <section className="b-panel">
          <div className="wrap">
            <div className="b-panel-head"><p className="b-eyebrow">Why {settings?.businessName}</p><h2>What you get</h2></div>
            <div className="b-checklist">
              {d.pillars.map((p) => (
                <div key={p.title} className="b-check-item">
                  <span className="icon"><PillarIcon name={p.icon} /></span>
                  <div><h3>{p.title}</h3><p>{p.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.description && d.enabled("about") && (
        <section id="about" className="b-panel alt">
          <div className="wrap b-pullquote">
            <p className="mark">&ldquo;</p>
            <p>{settings.description}</p>
          </div>
        </section>
      )}

      {d.enabled("products") && d.visibleProducts.length > 0 && (
        <section id="products" className="b-panel">
          <div className="wrap">
            <div className="b-panel-head"><p className="b-eyebrow">The Edit</p><h2>{d.terms.items}</h2></div>
            <div className="b-lookbook">
              {d.productGroups.map((group) => (
                <Fragment key={group.category?.id ?? "uncategorised"}>
                  {d.enabled("categories") && <div className="b-cat-heading">{group.category?.name ?? "Other"}</div>}
                  {group.products.map((p) => {
                    const img = env.img(p.imageAssetId);
                    return (
                      <div key={p.id} className="b-piece">
                        <div className="b-piece-img">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt={p.name} />
                          ) : null}
                        </div>
                        <div className="b-piece-body">
                          <p className="cat-label">{p.featured ? "Featured" : (group.category?.name ?? "")}</p>
                          <h3>{p.name}</h3>
                          {(p.price != null || p.offerPrice != null) && (
                            <p className="price">{p.offerPrice ? (<><span className="strike">{d.money(p.price)}</span>{d.money(p.offerPrice)}</>) : (<>{d.money(p.price)}</>)}</p>
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
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      )}

      {d.enabled("gallery") && d.galleryImages.length > 0 && (
        <section className="b-panel alt">
          <div className="wrap">
            <div className="b-panel-head"><p className="b-eyebrow">Inside</p><h2>Gallery</h2></div>
            <div className="b-filmstrip">
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
        <section id="enquire" className="b-panel">
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "center" }}>
            {d.enabled("enquiry") && (
              <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
                <p className="b-eyebrow">Get in Touch</p>
                <h2 style={{ marginTop: "0.5rem" }}>Enquire</h2>
                <div style={{ marginTop: "1.25rem", textAlign: "left" }}>{env.enquiryNode as ReactNode}</div>
              </div>
            )}
            {d.enabled("location") && (settings?.address || settings?.area || settings?.hours) && (
              <div id="location" className="b-visit-card">
                <p className="b-eyebrow">Visit</p>
                <h2 style={{ marginTop: "0.4rem" }}>{settings?.businessName}</h2>
                <dl>
                  <div><dt>Address</dt><dd>{[settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ")}</dd></div>
                  {settings?.hours && <div><dt>Hours</dt><dd>{settings.hours}</dd></div>}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="b-footer">
        <p className="wordmark">{settings?.businessName}</p>
      </footer>

      {d.whatsappHref && <WhatsAppFab href={d.whatsappHref} />}
    </div>
  );
}
