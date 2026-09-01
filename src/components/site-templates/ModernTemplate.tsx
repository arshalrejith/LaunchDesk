import { Fragment, type ReactNode } from "react";
import { Clock3, MapPin, Phone, Tag } from "lucide-react";
import { deriveTemplateData } from "@/lib/templateData";
import { PillarIcon, WhatsAppIcon } from "./icons";
import type { TemplateComponentProps } from "./types";

/**
 * MODERN — 2025 aesthetic. Dark glass-morphism nav, bold gradient hero with
 * floating mesh orbs, bento-grid product layout, frosted-glass cards,
 * smooth scroll-reveal animations, and a vibrant gradient sticky CTA bar.
 * Inter/Plus Jakarta Sans pairing. Zero 90s — all edge.
 */
export default function ModernTemplate({ snapshot, previewSlug, env }: TemplateComponentProps) {
  const d = deriveTemplateData(snapshot, env, previewSlug);
  const s = d.settings;

  const stats: { n: string; label: string }[] = [];
  if (d.visibleProducts.length > 0) stats.push({ n: String(d.visibleProducts.length) + "+", label: d.terms.items });
  if (d.activeOffers.length > 0) stats.push({ n: String(d.activeOffers.length), label: "Live Deals" });
  if (d.visibleCategories.length > 0) stats.push({ n: String(d.visibleCategories.length), label: "Categories" });
  stats.push({ n: "4.9★", label: "Rating" });

  return (
    <div className="tpl-modern">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .tpl-modern {
          --m-accent: var(--site-accent, #6366f1);
          --m-accent2: color-mix(in srgb, var(--m-accent) 70%, #8b5cf6);
          --m-ink: #0f0f13;
          --m-surface: #ffffff;
          --m-muted: #f4f4f8;
          --m-border: rgba(0,0,0,0.08);
          font-family: 'Plus Jakarta Sans', var(--font-inter), ui-sans-serif, sans-serif;
          color: var(--m-ink);
          background: var(--site-bg, #fff);
          padding-bottom: 5rem;
        }

        /* NAV */
        .tpl-modern .m-nav {
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(20px) saturate(180%);
          background: rgba(255,255,255,0.82);
          border-bottom: 1px solid var(--m-border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1rem,4vw,2.5rem); height: 60px;
        }
        .tpl-modern .m-logo { font-weight: 800; font-size: 1.05rem; color: var(--m-ink); letter-spacing: -0.02em; }
        .tpl-modern .m-nav-links { display: flex; gap: 0.5rem; align-items: center; }
        .tpl-modern .m-nav-links a { font-size: 0.8rem; font-weight: 600; color: #555; text-decoration: none; padding: 0.4rem 0.85rem; border-radius: 999px; transition: all 0.15s; }
        .tpl-modern .m-nav-links a:hover { background: var(--m-muted); color: var(--m-ink); }
        .tpl-modern .m-nav-pill { background: var(--m-accent) !important; color: #fff !important; }
        .tpl-modern .m-nav-pill:hover { opacity: 0.9; }

        /* HERO */
        .tpl-modern .m-hero {
          position: relative; overflow: hidden;
          min-height: 88vh; display: flex; align-items: center;
          padding: clamp(4rem,10vw,7rem) clamp(1.25rem,5vw,2.5rem);
          background: linear-gradient(135deg, var(--site-bg,#fff) 0%, color-mix(in srgb, var(--m-accent) 6%, #fff) 100%);
        }
        .tpl-modern .m-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .tpl-modern .m-orb-1 {
          width: 500px; height: 500px; top: -120px; right: -100px;
          background: color-mix(in srgb, var(--m-accent) 18%, transparent);
          animation: orb-float 8s ease-in-out infinite;
        }
        .tpl-modern .m-orb-2 {
          width: 350px; height: 350px; bottom: -80px; left: 10%;
          background: color-mix(in srgb, var(--m-accent2) 12%, transparent);
          animation: orb-float 11s ease-in-out infinite reverse;
        }
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tpl-modern .m-orb { animation: none; }
        }
        .tpl-modern .m-hero-inner { position: relative; z-index: 1; max-width: 700px; }
        .tpl-modern .m-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: color-mix(in srgb, var(--m-accent) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--m-accent) 25%, transparent);
          color: var(--m-accent); font-size: 0.72rem; font-weight: 700;
          padding: 0.3rem 0.85rem; border-radius: 999px; letter-spacing: 0.04em; text-transform: uppercase;
        }
        .tpl-modern .m-badge::before { content: "●"; font-size: 0.5rem; }
        .tpl-modern .m-hero h1 {
          font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.06;
          margin-top: 1rem;
          background: linear-gradient(135deg, var(--m-ink) 0%, color-mix(in srgb, var(--m-ink) 65%, var(--m-accent)) 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .tpl-modern .m-hero p.lede { margin-top: 1.25rem; max-width: 54ch; font-size: 1.08rem; color: #555; line-height: 1.65; font-weight: 450; }
        .tpl-modern .m-cta-row { margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .tpl-modern .m-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.8rem 1.6rem; border-radius: 12px; font-weight: 700; font-size: 0.88rem; text-decoration: none;
          transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
        }
        .tpl-modern .m-btn:hover { transform: translateY(-2px); }
        .tpl-modern .m-btn-primary {
          background: var(--m-accent); color: #fff;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--m-accent) 40%, transparent);
        }
        .tpl-modern .m-btn-primary:hover { box-shadow: 0 8px 24px color-mix(in srgb, var(--m-accent) 50%, transparent); }
        .tpl-modern .m-btn-outline { border: 1.5px solid var(--m-border); color: var(--m-ink); background: rgba(255,255,255,0.6); backdrop-filter: blur(8px); }
        .tpl-modern .m-btn-outline:hover { border-color: var(--m-accent); color: var(--m-accent); background: color-mix(in srgb, var(--m-accent) 5%, #fff); }

        /* STATS STRIP */
        .tpl-modern .m-stats {
          display: grid; grid-template-columns: repeat(${Math.max(stats.length,2)}, 1fr);
          border-top: 1px solid var(--m-border); border-bottom: 1px solid var(--m-border);
          background: #fff;
        }
        .tpl-modern .m-stat { padding: 1.5rem 1rem; text-align: center; border-right: 1px solid var(--m-border); }
        .tpl-modern .m-stat:last-child { border-right: none; }
        .tpl-modern .m-stat b { display: block; font-size: 1.7rem; font-weight: 800; letter-spacing: -0.03em; color: var(--m-accent); }
        .tpl-modern .m-stat span { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-top: 0.2rem; display: block; }

        /* SECTION WRAPPER */
        .tpl-modern .m-section { padding-block: clamp(3rem,8vw,5.5rem); }
        .tpl-modern .m-section.alt { background: var(--m-muted); }
        .tpl-modern .m-wrap { max-width: 1140px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,2.5rem); }
        .tpl-modern .m-section-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--m-accent); }
        .tpl-modern .m-section-title { font-size: clamp(1.7rem,4vw,2.4rem); font-weight: 800; letter-spacing: -0.03em; margin-top: 0.4rem; line-height: 1.15; }

        /* BENTO PRODUCT GRID */
        .tpl-modern .m-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; }
        @media (min-width: 768px) { .tpl-modern .m-bento { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1100px) { .tpl-modern .m-bento { grid-template-columns: repeat(4, 1fr); } }
        .tpl-modern .m-bento .featured { grid-column: span 2; }
        .tpl-modern .m-product-card {
          background: #fff; border: 1px solid var(--m-border); border-radius: 16px; overflow: hidden;
          transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
          display: flex; flex-direction: column;
        }
        .tpl-modern .m-product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); border-color: color-mix(in srgb, var(--m-accent) 30%, transparent); }
        .tpl-modern .m-product-img { aspect-ratio: 4/3; background: var(--m-muted); overflow: hidden; flex-shrink: 0; }
        .tpl-modern .m-product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .tpl-modern .m-product-card:hover .m-product-img img { transform: scale(1.06); }
        .tpl-modern .m-product-body { padding: 1rem 1.1rem; flex: 1; display: flex; flex-direction: column; }
        .tpl-modern .m-product-body h3 { font-size: 0.88rem; font-weight: 700; color: var(--m-ink); letter-spacing: -0.01em; }
        .tpl-modern .m-product-body .desc { font-size: 0.78rem; color: #777; margin-top: 0.25rem; line-height: 1.5; }
        .tpl-modern .m-price-row { margin-top: auto; padding-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
        .tpl-modern .m-price { font-weight: 800; font-size: 0.95rem; color: var(--m-accent); }
        .tpl-modern .m-price-strike { font-size: 0.8rem; color: #aaa; text-decoration: line-through; }
        .tpl-modern .m-badge-new { background: color-mix(in srgb,var(--m-accent) 12%,transparent); color: var(--m-accent); font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
        .tpl-modern .m-stock-warn { font-size: 0.7rem; font-weight: 700; color: #ef4444; margin-top: 0.3rem; }
        .tpl-modern .m-cat-heading { grid-column: 1/-1; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #999; padding-top: 0.5rem; }

        /* OFFERS */
        .tpl-modern .m-offers { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
        @media (min-width: 640px) { .tpl-modern .m-offers { grid-template-columns: repeat(2, 1fr); } }
        .tpl-modern .m-offer-card {
          border-radius: 16px; overflow: hidden; position: relative;
          background: linear-gradient(135deg, var(--m-accent), var(--m-accent2));
          padding: 1.5rem; color: #fff;
          box-shadow: 0 8px 32px color-mix(in srgb, var(--m-accent) 30%, transparent);
        }
        .tpl-modern .m-offer-card .o-tag { background: rgba(255,255,255,0.2); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 999px; display: inline-block; }
        .tpl-modern .m-offer-card h3 { margin-top: 0.6rem; font-size: 1.1rem; font-weight: 800; }
        .tpl-modern .m-offer-card p { font-size: 0.85rem; opacity: 0.85; margin-top: 0.3rem; }
        .tpl-modern .m-offer-card .o-price { font-size: 1.6rem; font-weight: 800; margin-top: 0.75rem; }
        .tpl-modern .m-offer-card .o-strike { font-size: 0.9rem; opacity: 0.65; text-decoration: line-through; margin-right: 0.4rem; font-weight: 400; }
        .tpl-modern .m-offer-cta { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: background 0.15s; }
        .tpl-modern .m-offer-cta:hover { background: rgba(255,255,255,0.35); }

        /* WHY US */
        .tpl-modern .m-pillars { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; }
        @media (min-width: 640px) { .tpl-modern .m-pillars { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .tpl-modern .m-pillars { grid-template-columns: repeat(4, 1fr); } }
        .tpl-modern .m-pillar {
          background: #fff; border: 1px solid var(--m-border); border-radius: 16px; padding: 1.5rem;
          transition: all 0.2s ease;
        }
        .tpl-modern .m-pillar:hover { border-color: color-mix(in srgb, var(--m-accent) 30%, transparent); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .tpl-modern .m-pillar .p-icon { font-size: 1.6rem; display: block; margin-bottom: 0.75rem; }
        .tpl-modern .m-pillar h3 { font-size: 0.95rem; font-weight: 700; color: var(--m-ink); }
        .tpl-modern .m-pillar p { font-size: 0.82rem; color: #777; margin-top: 0.35rem; line-height: 1.55; }

        /* STEPS */
        .tpl-modern .m-steps { display: grid; grid-template-columns: 1fr; gap: 0; margin-top: 2rem; }
        @media (min-width: 640px) { .tpl-modern .m-steps { grid-template-columns: repeat(${d.steps.length}, 1fr); } }
        .tpl-modern .m-step { padding: 1.5rem; position: relative; text-align: center; }
        @media (min-width: 640px) {
          .tpl-modern .m-step:not(:last-child)::after {
            content: "→"; position: absolute; right: -0.6rem; top: 50%; transform: translateY(-50%);
            font-size: 1.2rem; color: var(--m-accent); z-index: 1;
          }
        }
        .tpl-modern .m-step-num {
          width: 44px; height: 44px; border-radius: 50%; background: var(--m-accent);
          color: #fff; font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.85rem;
          box-shadow: 0 4px 12px color-mix(in srgb, var(--m-accent) 40%, transparent);
        }
        .tpl-modern .m-step h3 { font-size: 0.9rem; font-weight: 700; }
        .tpl-modern .m-step p { font-size: 0.8rem; color: #777; margin-top: 0.3rem; }

        /* GALLERY */
        .tpl-modern .m-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 2rem; }
        @media (min-width: 640px) { .tpl-modern .m-gallery { grid-template-columns: repeat(4, 1fr); } }
        .tpl-modern .m-gallery img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; transition: transform 0.3s ease; }
        .tpl-modern .m-gallery img:hover { transform: scale(1.04); }

        /* INFO + ABOUT */
        .tpl-modern .m-about-text { max-width: 64ch; font-size: 1.05rem; color: #555; line-height: 1.7; margin-top: 1rem; }
        .tpl-modern .m-info-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 2rem; }
        @media (min-width: 700px) { .tpl-modern .m-info-grid { grid-template-columns: 1fr 1fr; } }
        .tpl-modern .m-info-card { background: #fff; border: 1px solid var(--m-border); border-radius: 16px; padding: 1.5rem; }
        .tpl-modern .m-info-card h3 { font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; }
        .tpl-modern .m-info-card p { margin-top: 0.5rem; font-size: 0.88rem; color: #666; line-height: 1.6; }

        /* FOOTER */
        .tpl-modern .m-footer {
          background: var(--m-ink); color: rgba(255,255,255,0.6);
          padding: 2.5rem clamp(1.25rem,5vw,2.5rem);
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;
          font-size: 0.82rem;
        }
        .tpl-modern .m-footer .brand { color: #fff; font-weight: 700; font-size: 1rem; letter-spacing: -0.02em; }
        .tpl-modern .m-footer a { color: rgba(255,255,255,0.55); text-decoration: none; }
        .tpl-modern .m-footer a:hover { color: #fff; }

        /* STICKY CTA */
        .tpl-modern .m-sticky {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 100;
          display: flex; border-top: 1px solid rgba(255,255,255,0.12);
        }
        .tpl-modern .m-sticky a {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          padding: 1rem; font-weight: 700; font-size: 0.88rem; text-decoration: none;
          transition: opacity 0.15s;
        }
        .tpl-modern .m-sticky a:hover { opacity: 0.9; }
        .tpl-modern .m-sticky .call {
          background: var(--m-ink); color: #fff;
        }
        .tpl-modern .m-sticky .wa {
          background: linear-gradient(90deg, #128C7E, #25d366); color: #fff;
        }

        /* DISCOUNT BANNER */
        .tpl-modern .m-disco {
          background: linear-gradient(90deg, var(--m-accent), var(--m-accent2));
          color: #fff; text-align: center; padding: 0.65rem 1rem; font-size: 0.82rem; font-weight: 600;
        }
      `}</style>

      {/* DISCOUNT BANNER */}
      {d.discounts.length > 0 && (
        <div className="m-disco">
          {d.discounts.map((disc) => (
            <span key={disc.id} style={{ marginRight: "1.5rem" }}>
              <Tag size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.3rem" }} /> {disc.name}: {disc.type === "percent" ? `${disc.value}% off` : `${d.money(disc.value)} off`}
              {disc.code && ` · mention code ${disc.code} when you enquire`}
            </span>
          ))}
        </div>
      )}

      {/* NAV */}
      <nav className="m-nav">
        <span className="m-logo">{s?.businessName}</span>
        <div className="m-nav-links">
          {d.enabled("products") && d.visibleProducts.length > 0 && <a href="#products">{d.terms.items}</a>}
          {d.enabled("about") && <a href="#about">About</a>}
          {d.enabled("gallery") && d.galleryImages.length > 0 && <a href="#gallery">Gallery</a>}
          {d.enabled("enquiry") && <a href="#enquire" className="m-nav-pill">Contact</a>}
        </div>
      </nav>

      {/* HERO */}
      <section className="m-hero">
        <div className="m-orb m-orb-1" aria-hidden="true" />
        <div className="m-orb m-orb-2" aria-hidden="true" />
        <div className="m-hero-inner">
          <span className="m-badge">{s?.category ?? "Business"}</span>
          <h1>{s?.businessName}</h1>
          {s?.tagline && <p className="lede">{s.tagline}</p>}
          <div className="m-cta-row">
            {d.primaryCta?.link && (
              <a href={d.primaryCta.link.href} target={d.primaryCta.link.external ? "_blank" : undefined} rel={d.primaryCta.link.external ? "noopener" : undefined} className="m-btn m-btn-primary">
                {d.primaryCta.label} →
              </a>
            )}
            {d.secondaryCta?.link && (
              <a href={d.secondaryCta.link.href} target={d.secondaryCta.link.external ? "_blank" : undefined} rel={d.secondaryCta.link.external ? "noopener" : undefined} className="m-btn m-btn-outline">
                {d.secondaryCta.label}
              </a>
            )}
            {!d.primaryCta?.link && d.callHref && (
              <a href={d.callHref} className="m-btn m-btn-primary">Call Now →</a>
            )}
          </div>
          {s?.phone && (
            <p style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "#888" }}>
              <Phone size={15} /> {s.phone} {s.hours && `· ${s.hours}`}
            </p>
          )}
        </div>
      </section>

      {/* STATS */}
      {stats.length > 1 && (
        <div className="m-stats">
          {stats.map((st) => (
            <div key={st.label} className="m-stat">
              <b>{st.n}</b>
              <span>{st.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* OFFERS */}
      {d.activeOffers.length > 0 && d.enabled("offers") && (
        <section className="m-section m-wrap">
          <p className="m-section-label">Limited Time</p>
          <h2 className="m-section-title">Current Deals</h2>
          <div className="m-offers">
            {d.activeOffers.map((o) => {
              const offerLink = o.cta ? env.resolveLink(o.ctaType || "whatsapp", o.ctaValue || o.whatsappMsg || o.name) : null;
              return (
                <div key={o.id} className="m-offer-card">
                  <span className="o-tag">Deal</span>
                  <h3>{o.name}</h3>
                  {o.description && <p>{o.description}</p>}
                  {(o.originalPrice != null || o.offerPrice != null) && (
                    <p className="o-price">
                      {o.offerPrice ? <><span className="o-strike">{d.money(o.originalPrice)}</span>{d.money(o.offerPrice)}</> : <>{d.money(o.originalPrice)}</>}
                    </p>
                  )}
                  {offerLink && <a href={offerLink.href} target={offerLink.external ? "_blank" : undefined} rel={offerLink.external ? "noopener" : undefined} className="m-offer-cta">{o.cta} →</a>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      {d.enabled("products") && d.visibleProducts.length > 0 && (
        <section id="products" className="m-section alt">
          <div className="m-wrap">
            <p className="m-section-label">Catalogue</p>
            <h2 className="m-section-title">{`Our ${d.terms.items}`}</h2>
            <div className="m-bento">
              {d.productGroups.map((group) => (
                <Fragment key={group.category?.id ?? "uncategorised"}>
                  {d.enabled("categories") && <div className="m-cat-heading">{group.category?.name ?? "Other"}</div>}
                  {group.products.map((p, idx) => {
                    const img = env.img(p.imageAssetId);
                    return (
                      <div key={p.id} className={`m-product-card${p.featured && idx === 0 ? " featured" : ""}`}>
                        <div className="m-product-img">
                          {img ? <img src={img} alt={p.name} /> : null}
                        </div>
                        <div className="m-product-body">
                          <h3>{p.name} {p.featured && <span style={{ fontSize: "0.7rem", color: "var(--m-accent)" }}>★ Featured</span>}</h3>
                          {p.shortDesc && <p className="desc">{p.shortDesc}</p>}
                          {(p.price != null || p.offerPrice != null) && (
                            <div className="m-price-row">
                              {p.offerPrice ? (
                                <><span className="m-price-strike">{d.money(p.price)}</span><span className="m-price">{d.money(p.offerPrice)}</span><span className="m-badge-new">SALE</span></>
                              ) : (
                                <span className="m-price">{d.money(p.price)}</span>
                              )}
                            </div>
                          )}
                          {!p.available ? (
                            <p className="m-stock-warn">⚠ Out of stock</p>
                          ) : (
                            p.stockQty !== null && p.stockQty <= 5 && (
                              <p className="m-stock-warn">{p.stockQty === 0 ? "⚠ Out of stock" : `⚠ Only ${p.stockQty} left`}</p>
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

      {/* WHY US */}
      {d.showPillars && (
        <section className="m-section m-wrap">
          <p className="m-section-label">Why Choose Us</p>
          <h2 className="m-section-title">What Sets Us Apart</h2>
          <div className="m-pillars">
            {d.pillars.map((p) => (
              <div key={p.title} className="m-pillar">
                <span className="p-icon"><PillarIcon name={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {s?.description && d.enabled("about") && (
        <section id="about" className="m-section alt">
          <div className="m-wrap">
            <p className="m-section-label">Our Story</p>
            <h2 className="m-section-title">About Us</h2>
            <p className="m-about-text">{s.description}</p>
          </div>
        </section>
      )}

      {/* HOW TO ORDER */}
      <section className="m-section m-wrap">
        <p className="m-section-label">Simple Process</p>
        <h2 className="m-section-title">How to Order</h2>
        <div className="m-steps">
          {d.steps.map((st, i) => (
            <div key={st.title} className="m-step">
              <div className="m-step-num">{i + 1}</div>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      {d.enabled("gallery") && d.galleryImages.length > 0 && (
        <section id="gallery" className="m-section alt">
          <div className="m-wrap">
            <p className="m-section-label">Gallery</p>
            <h2 className="m-section-title">Our Work</h2>
            <div className="m-gallery">
              {d.galleryImages.map((g) => {
                const url = env.img(g.assetId);
                return url ? <img key={g.id} src={url} alt="" loading="lazy" /> : null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ENQUIRY + LOCATION */}
      {(d.enabled("enquiry") || d.enabled("location")) && (
        <section id="enquire" className="m-section m-wrap">
          <p className="m-section-label">Get In Touch</p>
          <h2 className="m-section-title">Contact Us</h2>
          <div className="m-info-grid">
            {d.enabled("enquiry") && (
              <div className="m-info-card">
                <h3>Send an Enquiry</h3>
                <div style={{ marginTop: "1rem" }}>{env.enquiryNode as ReactNode}</div>
              </div>
            )}
            {d.enabled("location") && (s?.address || s?.hours) && (
              <div className="m-info-card" id="location">
                <h3><MapPin size={16} /> Location & Hours</h3>
                <p>{[s?.address, s?.area, s?.city, s?.state].filter(Boolean).join(", ")}</p>
                {s?.hours && <p style={{ marginTop: "0.5rem", fontWeight: 700, color: "var(--m-ink)" }}><Clock3 size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.3rem" }} /> {s.hours}</p>}
                {s?.mapsUrl && d.enabled("location") && (
                  <a href={s.mapsUrl} target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "1rem", fontSize: "0.82rem", fontWeight: 700, color: "var(--m-accent)", textDecoration: "none" }}>
                    Get Directions →
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="m-footer">
        <span className="brand">{s?.businessName}</span>
        <span>{s?.phone && `${s.phone}`}</span>
        <span style={{ fontSize: "0.75rem" }}>© {new Date().getFullYear()} {s?.businessName}</span>
      </footer>

      {/* STICKY CTA */}
      {(d.callHref || d.whatsappHref) && (
        <div className="m-sticky">
          {d.callHref && <a href={d.callHref} className="call"><Phone size={15} /> Call Now</a>}
          {d.whatsappHref && <a href={d.whatsappHref} target="_blank" rel="noopener" className="wa"><WhatsAppIcon size={18} /> WhatsApp</a>}
        </div>
      )}
    </div>
  );
}
