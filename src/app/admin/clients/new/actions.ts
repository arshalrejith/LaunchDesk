"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAgencyAdmin } from "@/lib/scope";
import { hashPassword } from "@/lib/auth";
import { recommendedSectionsFor } from "@/lib/constants";
import { randomBytes } from "crypto";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/lib/businessConfig";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomPassword() {
  return randomBytes(12).toString("base64url").slice(0, 16);
}

export async function createClientAction(
  _prevState: { error?: string; created?: { email: string | null; password: string | null; slug: string; clientId: string } } | undefined,
  formData: FormData
) {
  await requireAgencyAdmin();

  const businessName = String(formData.get("businessName") ?? "").trim();
  const loginEmail = String(formData.get("loginEmail") ?? "").trim().toLowerCase();
  if (!businessName) return { error: "Business name is required." };

  if (loginEmail) {
    const existingUser = await prisma.user.findUnique({ where: { email: loginEmail } });
    if (existingUser) return { error: "That login email is already in use." };
  }

  let slug = slugify(businessName);
  let suffix = 1;
  while (await prisma.client.findUnique({ where: { slug } })) {
    slug = `${slugify(businessName)}-${++suffix}`;
  }

  const agency = await prisma.agency.findFirstOrThrow();
  const category = String(formData.get("category") ?? "").trim();
  const countryCode = String(formData.get("countryCode") ?? "IN").trim() || "IN";
  const currency = String(formData.get("currency") ?? "INR").trim() || "INR";
  const locale = String(formData.get("locale") ?? "en-IN").trim() || "en-IN";
  const phoneCountryCode = String(formData.get("phoneCountryCode") ?? "+91").trim() || "+91";
  if (!COUNTRY_OPTIONS.some((c) => c.code === countryCode)) return { error: "Please select a supported country." };
  if (!CURRENCY_OPTIONS.some(([code]) => code === currency)) return { error: "Please select a supported currency." };
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale)) return { error: "Locale must look like en-US or en-GB." };
  if (!/^\+?[0-9]{1,4}$/.test(phoneCountryCode)) return { error: "Phone country code must look like +1, +44, or another valid international code." };
  const password = loginEmail ? randomPassword() : null;

  const clientId = await prisma.$transaction(async (tx) => {
    const client = await tx.client.create({ data: { slug, agencyId: agency.id, status: "ACTIVE" } });

    const website = await tx.website.create({
      data: { clientId: client.id, previewSlug: slug, templateId: "modern-boutique-01", publishStatus: "DRAFT" },
    });

    await tx.settings.create({
      data: {
        websiteId: website.id,
        businessName,
        category: category || null,
        tagline: String(formData.get("tagline") ?? "").trim() || null,
        description: String(formData.get("description") ?? "").trim() || null,
        phone: String(formData.get("phone") ?? "").trim() || null,
        whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
        area: String(formData.get("area") ?? "").trim() || null,
        city: String(formData.get("city") ?? "").trim() || null,
        mapsUrl: String(formData.get("mapsUrl") ?? "").trim() || null,
        hours: String(formData.get("hours") ?? "").trim() || null,
        instagram: String(formData.get("instagram") ?? "").trim() || null,
        countryCode,
        currency,
        locale,
        phoneCountryCode,
      },
    });

    for (const key of recommendedSectionsFor(category)) {
      await tx.sectionToggle.create({ data: { websiteId: website.id, key, enabled: true } });
    }

    // Login is optional at this stage — you usually don't have their email
    // until after they've picked a design. Create it now only if given;
    // otherwise add it later from the client's Manage page.
    if (loginEmail && password) {
      await tx.user.create({
        data: { email: loginEmail, passwordHash: await hashPassword(password), role: "CLIENT", clientId: client.id },
      });
    }

    return client.id;
  });

  return { created: { email: loginEmail || null, password, slug, clientId } };
}
