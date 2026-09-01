/**
 * Fallback --site-bg / --site-accent for a template when the client hasn't
 * set a custom color under BrandSettings. Keyed by Website.templateId so
 * each of the three warm-boutique color presets actually looks different
 * out of the box — otherwise every template would render the same global
 * default (teal-on-white) until someone visited the Colors tab, and there'd
 * be no visible difference between "warm-boutique-amber/rose/teal" at pitch
 * time, when a prospect has no login yet to change it themselves.
 *
 * A client's own BrandSettings.backgroundColor/primaryColor, once set,
 * always wins over this map — see the three call sites that read it
 * (src/app/sites/[slug]/page.tsx, .../catalogue/page.tsx, staticExport.tsx).
 */
export const TEMPLATE_DEFAULT_COLORS: Record<string, { bg: string; accent: string }> = {
  "warm-boutique-amber": { bg: "#FFF8E7", accent: "#D9A404" },
  "warm-boutique-rose": { bg: "#FFF5F3", accent: "#C2185B" },
  "warm-boutique-teal": { bg: "#F0FBF9", accent: "#00897B" },
};

export const GLOBAL_DEFAULT_BG = "#ffffff";
export const GLOBAL_DEFAULT_ACCENT = "#0f766e";

export function defaultSiteColors(templateId: string | null | undefined): { bg: string; accent: string } {
  const preset = templateId ? TEMPLATE_DEFAULT_COLORS[templateId] : undefined;
  return { bg: preset?.bg ?? GLOBAL_DEFAULT_BG, accent: preset?.accent ?? GLOBAL_DEFAULT_ACCENT };
}
