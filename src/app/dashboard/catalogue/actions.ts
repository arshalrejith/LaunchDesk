"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { logChange } from "@/lib/changelog";

export async function saveCatalogueAction(_prevState: { ok?: boolean } | undefined, formData: FormData) {
  const { website } = await requireClientSession();

  const categoryIds = formData.getAll("categoryIds").map(String);

  await prisma.catalogue.upsert({
    where: { websiteId: website.id },
    create: {
      websiteId: website.id,
      title: String(formData.get("title") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      showPrices: formData.get("showPrices") === "on",
      showDescriptions: formData.get("showDescriptions") === "on",
      showWhatsapp: formData.get("showWhatsapp") === "on",
      showEnquiry: formData.get("showEnquiry") === "on",
      categoryIds: JSON.stringify(categoryIds),
    },
    update: {
      title: String(formData.get("title") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      showPrices: formData.get("showPrices") === "on",
      showDescriptions: formData.get("showDescriptions") === "on",
      showWhatsapp: formData.get("showWhatsapp") === "on",
      showEnquiry: formData.get("showEnquiry") === "on",
      categoryIds: JSON.stringify(categoryIds),
    },
  });

  await logChange(website.id, "Updated catalogue settings");
  revalidatePath("/dashboard/catalogue");
  return { ok: true };
}
