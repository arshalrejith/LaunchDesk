// The structural templates wired to live content via
// @/components/site-templates. Shared between the client's Website Design page
// and the agency's admin detail page so the two never drift.
export const TEMPLATES = [
  { id: "modern-2025", label: "Modern 2025", desc: "Glass-morphism nav, gradient hero with mesh orbs, bento product grid, frosted cards. The boldest, most current look." },
  { id: "modern-boutique-01", label: "Editorial", desc: "Organic hero shapes, alternating full-bleed bands, fact-based Why Us pillars." },
  { id: "premium-boutique-01", label: "Boutique", desc: "Two-column image-led hero, lookbook product grid, magazine feel." },
  { id: "conversion-boutique-01", label: "Conversion", desc: "Bold color-blocked hero, real-numbers stat strip, sticky Call/WhatsApp bar." },
  { id: "warm-boutique-amber", label: "Warm Boutique — Amber", desc: "Pill-shaped Call/WhatsApp/Catalogue bar up top, simple card-grid sections. Warm amber accent." },
  { id: "warm-boutique-rose", label: "Warm Boutique — Rose", desc: "Same warm, contact-first layout as Amber, in a rose accent." },
  { id: "warm-boutique-teal", label: "Warm Boutique — Teal", desc: "Same warm, contact-first layout as Amber, in a teal accent." },
  { id: "custom-builder", label: "Custom (Visual Builder)", desc: "Design your own layout section-by-section in the Visual Page Builder. Products, gallery and contact details always show your real data — everything else is yours to write." },
] as const;
