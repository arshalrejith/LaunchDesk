"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { saveUploadedImage } from "@/lib/upload";
import { logChange } from "@/lib/changelog";
import { deleteMediaAssetIfUnused } from "@/lib/media";

function readFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Offer name is required." } as const;

  const startDate = String(formData.get("startDate") ?? "").trim();
  const endDate = String(formData.get("endDate") ?? "").trim();
  const originalRaw = String(formData.get("originalPrice") ?? "").trim();
  const offerRaw = String(formData.get("offerPrice") ?? "").trim();
  const originalPrice = originalRaw ? Number(originalRaw) : null;
  const offerPrice = offerRaw ? Number(offerRaw) : null;
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < 0)) return { error: "Original price must be a valid non-negative number." } as const;
  if (offerPrice !== null && (!Number.isFinite(offerPrice) || offerPrice < 0)) return { error: "Offer price must be a valid non-negative number." } as const;
  if (offerPrice !== null && originalPrice === null) return { error: "Add an original price before setting an offer price." } as const;
  if (offerPrice !== null && originalPrice !== null && offerPrice > originalPrice) return { error: "Offer price cannot be higher than the original price." } as const;
  if (startDate && Number.isNaN(new Date(startDate).getTime())) return { error: "Start date is invalid." } as const;
  if (endDate && Number.isNaN(new Date(endDate).getTime())) return { error: "End date is invalid." } as const;
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) return { error: "End date cannot be before the start date." } as const;

  return {
    data: {
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      originalPrice,
      offerPrice,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      cta: String(formData.get("ctaLabel") ?? "").trim() || null,
      ctaType: String(formData.get("ctaType") ?? "").trim() || null,
      ctaValue: String(formData.get("ctaValue") ?? "").trim() || null,
    },
  } as const;
}

export async function createOfferAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const result = readFields(formData);
  if ("error" in result) return result;

  let imageAssetId: string | null = null;
  try {
    const file = formData.get("image") as File | null;
    const url = await saveUploadedImage(file, website.id, "offer");
    if (url) {
      const asset = await prisma.mediaAsset.create({ data: { websiteId: website.id, kind: "offer", url } });
      imageAssetId = asset.id;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }

  await prisma.offer.create({ data: { websiteId: website.id, imageAssetId, ...result.data } });
  await logChange(website.id, `Added offer "${result.data.name}"`);

  revalidatePath("/dashboard/offers");
  redirect("/dashboard/offers");
}

export async function updateOfferAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.offer.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);

  const result = readFields(formData);
  if ("error" in result) return result;

  let imageAssetId = existing.imageAssetId;
  try {
    const file = formData.get("image") as File | null;
    const url = await saveUploadedImage(file, website.id, "offer");
    if (url) {
      const asset = await prisma.mediaAsset.create({ data: { websiteId: website.id, kind: "offer", url } });
      imageAssetId = asset.id;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }

  await prisma.offer.update({ where: { id }, data: { imageAssetId, ...result.data } });
  if (imageAssetId !== existing.imageAssetId) {
    await deleteMediaAssetIfUnused(existing.imageAssetId);
  }
  await logChange(website.id, `Updated offer "${result.data.name}"`);

  revalidatePath("/dashboard/offers");
  redirect("/dashboard/offers");
}

export async function deleteOfferAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.offer.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  const assetId = existing.imageAssetId;
  await prisma.offer.delete({ where: { id } });
  await deleteMediaAssetIfUnused(assetId);
  await logChange(website.id, `Deleted offer "${existing.name}"`);
  revalidatePath("/dashboard/offers");
}
