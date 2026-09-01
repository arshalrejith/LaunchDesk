"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { saveUploadedImage } from "@/lib/upload";
import { logChange } from "@/lib/changelog";
import { deleteMediaAssetIfUnused } from "@/lib/media";

export async function addGalleryImagesAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Choose at least one image." };

  let count = await prisma.galleryImage.count({ where: { websiteId: website.id } });
  let added = 0;

  for (const file of files) {
    let url: string | null;
    try {
      url = await saveUploadedImage(file, website.id, "gallery");
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Could not upload one of those images." };
    }
    if (!url) continue;
    const asset = await prisma.mediaAsset.create({ data: { websiteId: website.id, kind: "gallery", url } });
    await prisma.galleryImage.create({
      data: { websiteId: website.id, assetId: asset.id, order: count, isCover: count === 0 },
    });
    count += 1;
    added += 1;
  }

  if (added > 0) {
    await logChange(website.id, `Added ${added} gallery image${added === 1 ? "" : "s"}`);
    revalidatePath("/dashboard/gallery");
  }
  return { ok: true };
}

export async function deleteGalleryImageAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.galleryImage.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  const assetId = existing.assetId;
  await prisma.galleryImage.delete({ where: { id } });
  await deleteMediaAssetIfUnused(assetId);
  await logChange(website.id, "Removed a gallery image");
  revalidatePath("/dashboard/gallery");
}

export async function toggleHideGalleryImageAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.galleryImage.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.galleryImage.update({ where: { id }, data: { hidden: !existing.hidden } });
  await logChange(website.id, `${existing.hidden ? "Unhid" : "Hid"} a gallery image`);
  revalidatePath("/dashboard/gallery");
}

export async function setCoverGalleryImageAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.galleryImage.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.$transaction([
    prisma.galleryImage.updateMany({ where: { websiteId: website.id }, data: { isCover: false } }),
    prisma.galleryImage.update({ where: { id }, data: { isCover: true } }),
  ]);
  await logChange(website.id, "Changed the gallery cover image");
  revalidatePath("/dashboard/gallery");
}

export async function moveGalleryImageAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.galleryImage.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" } });
  const idx = all.findIndex((g) => g.id === id);
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= all.length) return;
  await prisma.$transaction([
    prisma.galleryImage.update({ where: { id: all[idx].id }, data: { order: all[swapWith].order } }),
    prisma.galleryImage.update({ where: { id: all[swapWith].id }, data: { order: all[idx].order } }),
  ]);
  revalidatePath("/dashboard/gallery");
}
