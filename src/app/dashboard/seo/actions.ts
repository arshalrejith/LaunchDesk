"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { logChange } from "@/lib/changelog";

export async function saveSeoAction(_prevState: { ok?: boolean } | undefined, formData: FormData) {
  const { website } = await requireClientSession();

  const data = {
    title: String(formData.get("title") ?? "").trim() || null,
    metaDesc: String(formData.get("metaDesc") ?? "").trim() || null,
    keywords: String(formData.get("keywords") ?? "").trim() || null,
    serviceAreas: String(formData.get("serviceAreas") ?? "").trim() || null,
    gbpUrl: String(formData.get("gbpUrl") ?? "").trim() || null,
  };

  await prisma.seoSettings.upsert({
    where: { websiteId: website.id },
    create: { websiteId: website.id, ...data },
    update: data,
  });

  await logChange(website.id, "Updated SEO settings");
  revalidatePath("/dashboard/seo");
  return { ok: true };
}
