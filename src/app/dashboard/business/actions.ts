"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { recommendedSectionsFor } from "@/lib/constants";
import { logChange } from "@/lib/changelog";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/lib/businessConfig";

const FIELDS = [
  "businessName",
  "tagline",
  "category",
  "description",
  "address",
  "area",
  "city",
  "state",
  "pincode",
  "phone",
  "whatsapp",
  "email",
  "mapsUrl",
  "hours",
  "instagram",
  "facebook",
  "countryCode",
  "currency",
  "locale",
  "phoneCountryCode",
] as const;

export async function updateBusinessAction(_prevState: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();

  const businessName = String(formData.get("businessName") ?? "").trim();
  if (!businessName) {
    return { error: "Business name is required." };
  }

  const data: Record<string, string> = {};
  for (const field of FIELDS) {
    data[field] = String(formData.get(field) ?? "").trim();
  }
  const country = COUNTRY_OPTIONS.find((c) => c.code === data.countryCode);
  if (!country) return { error: "Please select a supported country." };
  if (!CURRENCY_OPTIONS.some(([code]) => code === data.currency)) return { error: "Please select a supported currency." };
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(data.locale)) return { error: "Locale must look like en-US or en-GB." };
  if (!/^\+?[0-9]{1,4}$/.test(data.phoneCountryCode)) return { error: "Phone country code must look like +1, +44, or another valid international code." };

  await prisma.settings.upsert({
    where: { websiteId: website.id },
    create: { websiteId: website.id, ...data, businessName },
    update: { ...data, businessName },
  });

  // Section 5: refresh recommended sections whenever the category changes,
  // without clobbering any section the client already toggled themselves.
  const recommended = recommendedSectionsFor(data.category);
  for (const key of recommended) {
    await prisma.sectionToggle.upsert({
      where: { websiteId_key: { websiteId: website.id, key } },
      create: { websiteId: website.id, key, enabled: true },
      update: {},
    });
  }

  await prisma.website.update({ where: { id: website.id }, data: { updatedAt: new Date() } });
  await logChange(website.id, "Updated business details");

  revalidatePath("/dashboard/business");
  revalidatePath("/dashboard");
  return { ok: true };
}
