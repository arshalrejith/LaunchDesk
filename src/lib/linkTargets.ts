import { normalizePhone } from "@/lib/businessConfig";

export const LINK_TYPES = [
  { value: "call", label: "Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "directions", label: "Get Directions" },
  { value: "catalogue", label: "View Catalogue" },
  { value: "scroll", label: "Scroll to Section" },
  { value: "enquiry", label: "Enquiry Form" },
  { value: "url", label: "Custom Link" },
] as const;

export type LinkType = (typeof LINK_TYPES)[number]["value"];

export const SCROLL_SECTIONS = [
  { value: "products", label: "Products / Services" },
  { value: "about", label: "About" },
  { value: "enquire", label: "Enquiry Form" },
  { value: "location", label: "Location" },
] as const;

type ResolveInput = {
  type: string | null | undefined;
  value: string | null | undefined;
  phone: string | null | undefined;
  whatsapp: string | null | undefined;
  phoneCountryCode?: string | null | undefined;
  mapsUrl: string | null | undefined;
  previewSlug: string;
};

export type ResolvedLink = { href: string; external: boolean } | null;

export function resolveLinkTarget({ type, value, phone, whatsapp, phoneCountryCode, mapsUrl, previewSlug }: ResolveInput): ResolvedLink {
  switch (type) {
    case "call": {
      const normalized = normalizePhone(phone, phoneCountryCode);
      return normalized ? { href: `tel:${normalized}`, external: false } : null;
    }
    case "whatsapp": {
      const normalized = normalizePhone(whatsapp, phoneCountryCode);
      return normalized
        ? { href: `https://wa.me/${normalized.slice(1)}${value ? `?text=${encodeURIComponent(value)}` : ""}`, external: true }
        : null;
    }
    case "directions": return mapsUrl ? { href: mapsUrl, external: true } : null;
    case "catalogue": return { href: `/sites/${previewSlug}/catalogue`, external: false };
    case "scroll": return value ? { href: `/sites/${previewSlug}#${value}`, external: false } : null;
    case "enquiry": return { href: `/sites/${previewSlug}#enquire`, external: false };
    case "url": return value ? { href: value, external: true } : null;
    default: return null;
  }
}
