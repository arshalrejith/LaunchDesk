/**
 * The CSS "atoms" every template (Editorial / Boutique / Conversion) and
 * both render paths (the live /sites/[slug] route, and the downloadable
 * static file) rely on: buttons, cards, the section-band system, inputs,
 * eyebrow labels. A single exported string so the live site's
 * sites/layout.tsx and the static exporter can never quietly drift apart —
 * edit this once, both places pick it up.
 *
 * Template-specific layout (hero shapes, product grids, steps, stat strips)
 * lives inside each template component instead, scoped under its own
 * .tpl-editorial / .tpl-boutique / .tpl-conversion class.
 */
export const SITE_SHARED_CSS = `
  .site-page {
    --site-ink: #1c1f1b;
    --site-dark: #16211c;
    --site-cream: #f4eee1;
    --site-ring: color-mix(in srgb, var(--site-accent) 70%, black);
    --site-soft: color-mix(in srgb, var(--site-accent) 16%, white);
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    background: var(--site-bg);
    color: var(--site-ink);
    line-height: 1.6;
  }
  .site-page h1, .site-page h2, .site-page h3 {
    font-family: var(--font-fraunces), Georgia, serif;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.08;
    margin: 0;
  }
  .site-page .wrap { max-width: 1080px; margin: 0 auto; padding-inline: clamp(1.25rem, 5vw, 2.5rem); }
  .site-page .lede { margin-top: 1rem; max-width: 56ch; color: color-mix(in srgb, var(--site-ink) 70%, transparent); font-size: 1.08rem; }
  .site-page .eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.72rem; font-weight: 600;
    color: var(--site-accent);
  }
  .site-page .eyebrow::before { content: ""; width: 1.25rem; height: 2px; background: currentColor; display: inline-block; }
  .site-page .eyebrow.on-dark { color: var(--site-accent); }

  .site-page .btn {
    display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;
    padding: 0.8rem 1.5rem; border-radius: 999px; font-weight: 600; font-size: 0.92rem;
  }
  .site-page .btn-solid { background: var(--site-accent); color: #fff; }
  .site-page .btn-outline { border: 1.5px solid currentColor; }
  .site-page .btn-dark { background: var(--site-ink); color: #fff; }
  .site-page .btn-wa { background: #25d366; color: #fff; }
  .site-page .btn-line { border-radius: 999px; padding: 0.6rem 1.15rem; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: 1px solid color-mix(in srgb, var(--site-ink) 25%, transparent); }

  .site-page section.band { padding-block: clamp(3rem, 8vw, 5rem); position: relative; overflow: hidden; }
  .site-page section.band.light { background: var(--site-bg); }
  .site-page section.band.cream { background: var(--site-cream); }
  .site-page section.band.dark { background: var(--site-dark); color: #f3efe6; }
  .site-page section.band.dark .eyebrow { color: var(--site-accent); }
  .site-page section.band.tight { padding-block: clamp(1.75rem, 4vw, 2.5rem); }

  .site-page .discount-banner { background: var(--site-accent); color: #fff; text-align: center; padding: 0.65rem 1rem; font-size: 0.85rem; font-weight: 600; }

  .site-page .card-grid { display: grid; grid-template-columns: 1fr; gap: 1.1rem; margin-top: 1.75rem; }
  @media (min-width: 640px) { .site-page .card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .site-page .card-grid { grid-template-columns: repeat(3, 1fr); } }
  .site-page .card { border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid color-mix(in srgb, var(--site-ink) 10%, transparent); transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .site-page .card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -12px rgba(0,0,0,0.18); }
  .site-page .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
  .site-page .card-body { padding: 1rem 1.1rem; }
  .site-page .card-title { font-weight: 600; margin: 0; font-size: 1rem; }
  .site-page .card-desc { margin: 0.4rem 0 0; font-size: 0.87rem; color: color-mix(in srgb, var(--site-ink) 65%, transparent); }
  .site-page .card-price { margin: 0.55rem 0 0; font-weight: 700; font-variant-numeric: tabular-nums; }
  .site-page .strike { color: color-mix(in srgb, var(--site-ink) 40%, transparent); text-decoration: line-through; font-weight: 400; margin-right: 0.35rem; }
  .site-page .stock { margin: 0.35rem 0 0; font-size: 0.75rem; font-weight: 700; color: #c0392b; }
  .site-page .cat-title { font-size: 1.25rem; margin-top: 2rem; }
  .site-page .cat-title:first-child { margin-top: 0; }

  .site-page .back-link { text-decoration: none; font-weight: 600; font-size: 0.88rem; color: var(--site-accent); }
  .site-page input, .site-page textarea {
    border-radius: 10px; border: 1px solid color-mix(in srgb, var(--site-ink) 20%, transparent);
    padding: 0.65rem 0.85rem; font-size: 0.92rem; font-family: inherit; background: #fff; color: var(--site-ink);
  }
  .site-page input:focus, .site-page textarea:focus { outline: 2px solid var(--site-accent); outline-offset: 1px; }

  /* Scroll-reveal for every top-level section (all four templates render
     their content as sibling <section> elements). Purely opt-in via the
     "sr-ready" class the tiny script below adds to <html> once it's running
     — if JS never runs (blocked, slow static host, etc.) sections stay at
     their default full opacity, so nothing ever looks broken or hidden. */
  html.sr-ready .site-page > section,
  html.sr-ready .site-page section[id] {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  html.sr-ready .site-page > section.sr-in,
  html.sr-ready .site-page section[id].sr-in {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    html.sr-ready .site-page > section,
    html.sr-ready .site-page section[id] {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
`;

/** Tiny (no dependency) scroll-reveal script — safe to inline in both the
 * live Next.js route and the downloadable static export. Adds "sr-ready" to
 * <html> only once it has actually attached an observer, and reveals each
 * top-level section the moment it enters the viewport. Runs once; a couple
 * hundred bytes, no framework, nothing to slow the page down. */
export const SITE_REVEAL_SCRIPT = `
(function () {
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('sr-ready');
  var run = function () {
    var els = document.querySelectorAll('.site-page > section, .site-page section[id]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
`;

/** One <link> pulling all three template font pairings — simple and safe
 * for a downloadable file (small extra weight, but it guarantees whichever
 * of the three templates is active always has its real type, offline). */
export const SITE_FONT_LINK_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Karla:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap";
