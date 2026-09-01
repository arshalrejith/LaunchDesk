import { Fragment } from "react";
import { deriveTemplateData } from "@/lib/templateData";
import { WhatsAppFab } from "./icons";
import type { TemplateComponentProps } from "./types";

/**
 * WARM BOUTIQUE — pill-shaped contact bar up top (Call / WhatsApp /
 * Catalogue, each its own colored pill), a plain single-column hero instead
 * of Editorial's shapes or Boutique's split image, and a straightforward
 * card-grid for products/offers/gallery rather than a lookbook or stat
 * strip. The simplest, most contact-forward of the four — closest in spirit
 * to a shop counter than a magazine spread. Registered three times (amber /
 * rose / teal) via TEMPLATE_COMPONENTS, each just a different default accent
 * — the component itself is one shared implementation.
 */
export default function WarmBoutiqueTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const settings = d.settings;

  return (
    <div className="tpl-warm">
      <style>{`
        .tpl-warm { font-family: var(--font-inter), ui-sans-serif, sans-serif; }
        .tpl-warm h1, .tpl-warm h2, .tpl-warm h3 { font-family: var(--font-fraunces), Georgia, serif; }
        .tpl-warm .w-hero { padding-block: clamp(2.5rem,7vw,4rem) 1.5rem; background: var(--site-bg); }
        .tpl-warm .w-hero h1 { font-size: clamp(2rem, 5vw, 3rem); margin-top: 0.6rem; max-width: 18ch; }
        .tpl-warm .w-cta-row { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }

        .tpl-warm .w-contact-bar { display: flex; flex-wrap: wrap; gap: 0.6rem; padding-block: 1rem; border-block: 1px solid color-mix(in srgb, var(--site-ink) 10%, transparent); }
        .tpl-warm .w-pill { border-radius: 999px; padding: 0.55rem 1.15rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; }
        .tpl-warm .w-pill-dark { background: var(--site-ink); color: #fff; }
        .tpl-warm .w-pill-green { background: #25d366; color: #fff; }
        .tpl-warm .w-pill-line { border: 1px solid color-mix(in srgb, var(--site-ink) 25%, transparent); color: var(--site-ink); }

        .tpl-warm section.band .eyebrow { margin-bottom: 0; }
        .tpl-warm section.band h2 { margin-top: 0.5rem; font-size: clamp(1.6rem, 4vw, 2.1rem); }

        .tpl-warm .w-visit dl { margin: 1.25rem 0 0; display: grid; gap: 0.65rem; }
        .tpl-warm .w-visit dt { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: color-mix(in srgb, var(--site-ink) 55%, transparent); }
        .tpl-warm .w-visit dd { margin: 0.15rem 0 0; }

        .tpl-warm .w-footer { padding-block: 2.5rem; text-align: center; background: var(--site-ink); color: color-mix(in srgb, #fff 75%, transparent); }
      `}</style>

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

      <header className="w-hero">
        <div className="wrap">
          <p className="eyebrow">{settings?.category ?? "Boutique"}</p>
          <h1>{settings?.businessName}</h1>
          {settings?.tagline && <p className="lede">{settings.tagline}</p>}
          {(d.primaryCta?.link || d.secondaryCta?.link) && (
            <div className="w-cta-row">
              {d.primaryCta?.link && (
                <a href={d.primaryCta.link.href} target={d.primaryCta.link.external ? "_blank" : undefined} rel={d.primaryCta.link.external ? "noopener" : undefined} className="btn btn-solid">
                  {d.primaryCta.label}
                </a>
              )}
              {d.secondaryCta?.link && (
                <a href={d.secondaryCta.link.href} target={d.secondaryCta.link.external ? "_blank" : undefined} rel={d.secondaryCta.link.external ? "noopener" : undefined} className="btn btn-outline">
                  {d.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="wrap w-contact-bar">
        {d.callHref && <a className="w-pill w-pill-dark" href={d.callHref}>Call{settings?.phone ? ` ${settings.phone}` : ""}</a>}
        {d.whatsappHref && <a className="w-pill w-pill-green" href={d.whatsappHref} target="_blank" rel="noopener">WhatsApp</a>}
        {d.enabled("catalogue") && env.catalogueHref && <a className="w-pill w-pill-line" href={env.catalogueHref}>View Catalogue</a>}
      </div>

      {d.activeOffers.length > 0 && d.enabled("offers") && (
        <section className="band cream">
          <div className="wrap">
            <p className="eyebrow">Right Now</p>
            <h2>Current Offers</h2>
            <div className="card-grid">
              {d.activeOffers.map((o) => {
                const img = env.img(o.imageAssetId);
                const offerLink = o.cta ? env.resolveLink(o.ctaType || "whatsapp", o.ctaValue || o.whatsappMsg || o.name) : null;
                return (
                  <div key={o.id} className="card">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={o.name} />
                    ) : null}
                    <div className="card-body">
                      <p className="card-title">{o.name}</p>
                      {o.description && <p className="card-desc">{o.description}</p>}
                      {(o.originalPrice != null || o.offerPrice != null) && (
                        <p className="card-price">{o.offerPrice ? (<><span className="strike">{d.money(o.originalPrice)}</span>{d.money(o.offerPrice)}</>) : (<>{d.money(o.originalPrice)}</>)}</p>
                      )}
                      {offerLink && (
                        <a href={offerLink.href} target={offerLink.external ? "_blank" : undefined} rel={offerLink.external ? "noopener" : undefined} className="btn btn-solid" style={{ marginTop: "0.75rem" }}>
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

      {settings?.description && d.enabled("about") && (
        <section id="about" className="band light">
          <div className="wrap" style={{ maxWidth: "48rem" }}>
            <p className="eyebrow">About</p>
            <h2>{settings.businessName}</h2>
            <p className="lede">{settings.description}</p>
          </div>
        </section>
      )}

      {d.enabled("products") && d.visibleProducts.length > 0 && (
        <section id="products" className="band cream">
          <div className="wrap">
            <p className="eyebrow">Shop</p>
            <h2>{d.terms.items}</h2>
            {d.productGroups.map((group) => (
              <Fragment key={group.category?.id ?? "uncategorised"}>
                {d.enabled("categories") && <h3 className="cat-title">{group.category?.name ?? "Other"}</h3>}
                <div className="card-grid">
                  {group.products.map((p) => {
                    const img = env.img(p.imageAssetId);
                    return (
                      <div key={p.id} className="card">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={p.name} />
                        ) : null}
                        <div className="card-body">
                          <p className="card-title">{p.name}</p>
                          {p.shortDesc && <p className="card-desc">{p.shortDesc}</p>}
                          {(p.price != null || p.offerPrice != null) && (
                            <p className="card-price">{p.offerPrice ? (<><span className="strike">{d.money(p.price)}</span>{d.money(p.offerPrice)}</>) : (<>{d.money(p.price)}</>)}</p>
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
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      {d.enabled("gallery") && d.galleryImages.length > 0 && (
        <section className="band light">
          <div className="wrap">
            <p className="eyebrow">Inside</p>
            <h2>Gallery</h2>
            <div className="card-grid">
              {d.galleryImages.map((g) => {
                const url = env.img(g.assetId);
                return url ? (
                  <div key={g.id} className="card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" loading="lazy" />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}

      {(d.enabled("enquiry") || d.enabled("location")) && (
        <section id="enquire" className="band cream">
          <div className="wrap" style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "1fr" }}>
            {d.enabled("enquiry") && (
              <div style={{ maxWidth: "28rem" }}>
                <p className="eyebrow">Get in Touch</p>
                <h2>Enquire</h2>
                <div style={{ marginTop: "1.25rem" }}>{env.enquiryNode as import("react").ReactNode}</div>
              </div>
            )}
            {d.enabled("location") && (settings?.address || settings?.area || settings?.hours) && (
              <div id="location" className="w-visit">
                <p className="eyebrow">Visit</p>
                <h2>{settings?.businessName}</h2>
                <dl>
                  <div><dt>Address</dt><dd>{[settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ")}</dd></div>
                  {settings?.hours && <div><dt>Hours</dt><dd>{settings.hours}</dd></div>}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="w-footer">
        <p>{settings?.businessName}</p>
      </footer>

      {d.whatsappHref && <WhatsAppFab href={d.whatsappHref} />}
    </div>
  );
}
