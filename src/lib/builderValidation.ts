import { z } from "zod";
import {
  GOOGLE_FONTS_POPULAR,
  SECTION_TYPES,
  defaultSections,
  type BuilderSection,
  type BuilderSectionType,
} from "@/components/builder/sections";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const LOCAL_IMAGE = /^\/uploads\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/;
const SUPABASE_PUBLIC_IMAGE = /^https:\/\/[A-Za-z0-9.-]+\.supabase\.co\/storage\/v1\/object\/public\/[A-Za-z0-9._-]+\/[A-Za-z0-9._\/-]+$/;
const FONT_SET = new Set(GOOGLE_FONTS_POPULAR);
const SECTION_TYPE_SET = new Set(SECTION_TYPES.map((item) => item.type));

const shortText = z.string().trim().max(500);
const longText = z.string().trim().max(2000);
const color = z.string().regex(HEX_COLOR);
const image = z.string().max(500).refine((value) => LOCAL_IMAGE.test(value) || SUPABASE_PUBLIC_IMAGE.test(value), "Unsupported image URL.");

const styleFields = {
  bgColor: color.optional(),
  textColor: color.optional(),
};

const contentSchemas: Record<BuilderSectionType, z.ZodTypeAny> = {
  hero: z.object({
    headline: shortText.optional(), subline: longText.optional(), cta: shortText.optional(), cta2: shortText.optional(), image: image.nullable().optional(), ...styleFields,
  }).strict(),
  stats: z.object({
    stats: z.array(z.object({ number: shortText, label: shortText }).strict()).max(12).optional(), ...styleFields,
  }).strict(),
  features: z.object({
    heading: shortText.optional(),
    items: z.array(z.object({ icon: z.string().max(50), title: shortText, desc: longText }).strict()).max(12).optional(),
    ...styleFields,
  }).strict(),
  products: z.object({ heading: shortText.optional(), ...styleFields }).strict(),
  gallery: z.object({ heading: shortText.optional(), ...styleFields }).strict(),
  about: z.object({ heading: shortText.optional(), text: longText.optional(), image: image.nullable().optional(), ...styleFields }).strict(),
  cta: z.object({ heading: shortText.optional(), subline: longText.optional(), cta: shortText.optional(), ...styleFields }).strict(),
  contact: z.object({ heading: shortText.optional(), ...styleFields }).strict(),
  divider: z.object({ label: shortText.optional(), bgColor: color.optional() }).strict(),
};

const baseSectionSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
  type: z.string(),
  locked: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()),
}).strict();

export const builderPayloadSchema = z.object({
  sections: z.array(z.unknown()).max(50),
  accent: color,
  font: z.string().min(1).max(80).refine((value) => FONT_SET.has(value), "Unsupported font."),
}).strict();

export const ALLOWED_TEMPLATE_IDS = new Set([
  "modern-2025",
  "modern-boutique-01",
  "premium-boutique-01",
  "conversion-boutique-01",
  "warm-boutique-amber",
  "warm-boutique-rose",
  "warm-boutique-teal",
  "custom-builder",
]);

export function normalizeBuilderAccent(value: string | null | undefined): string {
  return value && HEX_COLOR.test(value) ? value : "#6366f1";
}

export function normalizeBuilderFont(value: string | null | undefined): string {
  return value && FONT_SET.has(value) ? value : "Plus Jakarta Sans";
}

export function parseBuilderSections(raw: unknown, accent: string, fallbackToDefaults = true): BuilderSection[] {
  const parsed = z.array(z.unknown()).max(50).safeParse(raw);
  if (!parsed.success) return fallbackToDefaults ? defaultSections(accent) : [];

  const sections: BuilderSection[] = [];
  for (const candidate of parsed.data) {
    const base = baseSectionSchema.safeParse(candidate);
    if (!base.success || !SECTION_TYPE_SET.has(base.data.type as BuilderSectionType)) continue;

    const type = base.data.type as BuilderSectionType;
    const contentResult = contentSchemas[type].safeParse(base.data.content);
    if (!contentResult.success) continue;

    sections.push({
      id: base.data.id,
      type,
      locked: base.data.locked ?? false,
      content: contentResult.data as Record<string, unknown>,
    });
  }

  return sections.length > 0 || parsed.data.length === 0 ? sections : (fallbackToDefaults ? defaultSections(accent) : []);
}
