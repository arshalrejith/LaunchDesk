"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { logChange } from "@/lib/changelog";
import { sectionNameFor } from "@/lib/constants";
import { ALLOWED_TEMPLATE_IDS } from "@/lib/builderValidation";

export async function setTemplateAction(formData: FormData) {
  const { website } = await requireClientSession();
  const templateId = String(formData.get("templateId") ?? "").trim();
  if (!templateId || !ALLOWED_TEMPLATE_IDS.has(templateId)) {
    throw new Error("Invalid website design selected.");
  }
  if (templateId === website.templateId) return;
  await prisma.website.update({ where: { id: website.id }, data: { templateId } });
  await logChange(website.id, `Switched active design to ${templateId}`);
  revalidatePath("/dashboard/website");
}

export async function toggleSectionAction(formData: FormData) {
  const { website } = await requireClientSession();
  const key = String(formData.get("key") ?? "");
  const enabled = formData.get("enabled") === "true";
  if (!key) return;
  await prisma.sectionToggle.upsert({
    where: { websiteId_key: { websiteId: website.id, key } },
    create: { websiteId: website.id, key, enabled },
    update: { enabled },
  });
  const label = sectionNameFor(website.settings?.category, key);
  await logChange(website.id, `${enabled ? "Enabled" : "Disabled"} section: ${label}`);
  revalidatePath("/dashboard/website");
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export async function saveBrandingAction(_prevState: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();

  const accentColor = String(formData.get("accentColor") ?? "").trim() || null;
  const backgroundColor = String(formData.get("backgroundColor") ?? "").trim() || null;

  if (accentColor && !HEX_COLOR.test(accentColor)) return { error: "Accent color must be a hex code like #0F766E." };
  if (backgroundColor && !HEX_COLOR.test(backgroundColor)) return { error: "Background color must be a hex code like #FFFFFF." };

  await prisma.brandSettings.upsert({
    where: { websiteId: website.id },
    create: { websiteId: website.id, primaryColor: accentColor, backgroundColor },
    update: { primaryColor: accentColor, backgroundColor },
  });

  await logChange(website.id, "Updated site colors");
  revalidatePath("/dashboard/website");
  return { ok: true };
}

export async function saveHeroCtasAction(_prevState: { ok?: boolean } | undefined, formData: FormData) {
  const { website } = await requireClientSession();

  const data = {
    primaryCta: String(formData.get("primaryCtaLabel") ?? "").trim() || null,
    primaryCtaType: String(formData.get("primaryCtaType") ?? "").trim() || null,
    primaryCtaValue: String(formData.get("primaryCtaValue") ?? "").trim() || null,
    secondaryCta: String(formData.get("secondaryCtaLabel") ?? "").trim() || null,
    secondaryCtaType: String(formData.get("secondaryCtaType") ?? "").trim() || null,
    secondaryCtaValue: String(formData.get("secondaryCtaValue") ?? "").trim() || null,
  };

  await prisma.homepageContent.upsert({
    where: { websiteId: website.id },
    create: { websiteId: website.id, ...data },
    update: data,
  });

  await logChange(website.id, "Updated homepage buttons");
  revalidatePath("/dashboard/website");
  return { ok: true };
}
