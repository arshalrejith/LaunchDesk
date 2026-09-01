"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { saveUploadedImage } from "@/lib/upload";
import { logChange } from "@/lib/changelog";
import { deleteMediaAssetIfUnused } from "@/lib/media";

function tagsToJson(raw: string) {
  const tags = raw.split(",").map((t) => t.trim()).filter(Boolean);
  return JSON.stringify(tags);
}

async function readCommonFields(formData: FormData, websiteId: string, existingImageAssetId: string | null) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Product name is required." } as const;

  let imageAssetId = existingImageAssetId;

  const priceRaw = String(formData.get("price") ?? "").trim();
  const offerPriceRaw = String(formData.get("offerPrice") ?? "").trim();
  const stockRaw = String(formData.get("stockQty") ?? "").trim();
  const price = priceRaw ? Number(priceRaw) : null;
  const offerPrice = offerPriceRaw ? Number(offerPriceRaw) : null;
  const stockQty = stockRaw ? Number(stockRaw) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: "Price must be a valid non-negative number." } as const;
  if (offerPrice !== null && (!Number.isFinite(offerPrice) || offerPrice < 0)) return { error: "Offer price must be a valid non-negative number." } as const;
  if (offerPrice !== null && price === null) return { error: "Add a regular price before setting an offer price." } as const;
  if (offerPrice !== null && price !== null && offerPrice > price) return { error: "Offer price cannot be higher than the regular price." } as const;
  if (stockQty !== null && (!Number.isInteger(stockQty) || stockQty < 0)) return { error: "Stock quantity must be a whole number of 0 or more." } as const;

  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { websiteId: true } });
    if (!category || category.websiteId !== websiteId) return { error: "Selected category is invalid." } as const;
  }

  const file = formData.get("image") as File | null;
  const url = await saveUploadedImage(file, websiteId, "product");
  if (url) {
    const asset = await prisma.mediaAsset.create({ data: { websiteId, kind: "product", url } });
    imageAssetId = asset.id;
  }

  return {
    data: {
      name,
      categoryId,
      shortDesc: String(formData.get("shortDesc") ?? "").trim() || null,
      fullDesc: String(formData.get("fullDesc") ?? "").trim() || null,
      price,
      offerPrice,
      unit: String(formData.get("unit") ?? "").trim() || null,
      sku: String(formData.get("sku") ?? "").trim() || null,
      tags: tagsToJson(String(formData.get("tags") ?? "")),
      stockQty,
      available: formData.get("available") === "on",
      featured: formData.get("featured") === "on",
      imageAssetId,
    },
  } as const;
}

export async function createProductAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  let result;
  try {
    result = await readCommonFields(formData, website.id, null);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }
  if ("error" in result) return result;

  const count = await prisma.product.count({ where: { websiteId: website.id } });
  await prisma.product.create({ data: { websiteId: website.id, order: count, ...result.data } });
  await logChange(website.id, `Added product "${result.data.name}"`);

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProductAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);

  let result;
  try {
    result = await readCommonFields(formData, website.id, existing.imageAssetId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not upload that image." };
  }
  if ("error" in result) return result;

  await prisma.product.update({ where: { id }, data: result.data });
  if (result.data.imageAssetId !== existing.imageAssetId) {
    await deleteMediaAssetIfUnused(existing.imageAssetId);
  }
  await logChange(website.id, `Updated product "${result.data.name}"`);

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProductAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  const assetId = existing.imageAssetId;
  await prisma.product.delete({ where: { id } });
  await deleteMediaAssetIfUnused(assetId);
  await logChange(website.id, `Deleted product "${existing.name}"`);
  revalidatePath("/dashboard/products");
}

export async function duplicateProductAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  const count = await prisma.product.count({ where: { websiteId: website.id } });
  await prisma.product.create({
    data: {
      websiteId: website.id,
      categoryId: existing.categoryId,
      name: `${existing.name} (Copy)`,
      shortDesc: existing.shortDesc,
      fullDesc: existing.fullDesc,
      price: existing.price,
      offerPrice: existing.offerPrice,
      unit: existing.unit,
      sku: existing.sku,
      imageAssetId: existing.imageAssetId,
      tags: existing.tags,
      stockQty: existing.stockQty,
      available: existing.available,
      featured: false,
      order: count,
    },
  });
  await logChange(website.id, `Duplicated product "${existing.name}"`);
  revalidatePath("/dashboard/products");
}

export async function toggleHideProductAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.product.update({ where: { id }, data: { hidden: !existing.hidden } });
  await logChange(website.id, `${existing.hidden ? "Unhid" : "Hid"} product "${existing.name}"`);
  revalidatePath("/dashboard/products");
}

export async function moveProductAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const all = await prisma.product.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" } });
  const idx = all.findIndex((p) => p.id === id);
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapWith < 0 || swapWith >= all.length) return;
  await prisma.$transaction([
    prisma.product.update({ where: { id: all[idx].id }, data: { order: all[swapWith].order } }),
    prisma.product.update({ where: { id: all[swapWith].id }, data: { order: all[idx].order } }),
  ]);
  revalidatePath("/dashboard/products");
}
