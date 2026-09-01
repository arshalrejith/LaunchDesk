"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { saveUploadedImage } from "@/lib/upload";
import { logChange } from "@/lib/changelog";
import { deleteMediaAssetIfUnused } from "@/lib/media";

export async function createCategoryAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Category name is required." };

  let imageAssetId: string | null = null;
  try {
    const file = formData.get("image") as File | null;
    const url = await saveUploadedImage(file, website.id, "category");
    if (url) {
      const asset = await prisma.mediaAsset.create({ data: { websiteId: website.id, kind: "category", url } });
      imageAssetId = asset.id;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }

  const count = await prisma.category.count({ where: { websiteId: website.id } });
  await prisma.category.create({
    data: {
      websiteId: website.id,
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      imageAssetId,
      order: count,
    },
  });
  await logChange(website.id, `Added category "${name}"`);

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
}

export async function updateCategoryAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Category name is required." };

  let imageAssetId = existing.imageAssetId;
  try {
    const file = formData.get("image") as File | null;
    const url = await saveUploadedImage(file, website.id, "category");
    if (url) {
      const asset = await prisma.mediaAsset.create({ data: { websiteId: website.id, kind: "category", url } });
      imageAssetId = asset.id;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      imageAssetId,
    },
  });
  if (imageAssetId !== existing.imageAssetId) {
    await deleteMediaAssetIfUnused(existing.imageAssetId);
  }
  await logChange(website.id, `Updated category "${name}"`);

  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  const assetId = existing.imageAssetId;
  await prisma.category.delete({ where: { id } });
  await deleteMediaAssetIfUnused(assetId);
  await logChange(website.id, `Deleted category "${existing.name}"`);
  revalidatePath("/dashboard/categories");
}

export async function toggleHideCategoryAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.category.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.category.update({ where: { id }, data: { hidden: !existing.hidden } });
  await logChange(website.id, `${existing.hidden ? "Unhid" : "Hid"} category "${existing.name}"`);
  revalidatePath("/dashboard/categories");
}

export async function moveCategoryAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.category.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" } });
  const idx = all.findIndex((c) => c.id === id);
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= all.length) return;
  await prisma.$transaction([
    prisma.category.update({ where: { id: all[idx].id }, data: { order: all[swapWith].order } }),
    prisma.category.update({ where: { id: all[swapWith].id }, data: { order: all[idx].order } }),
  ]);
  revalidatePath("/dashboard/categories");
}
