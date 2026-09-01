import "server-only";

import { prisma } from "@/lib/prisma";
import { deleteFromSupabaseStorage, supabaseObjectPathFromUrl } from "@/lib/storage";

/**
 * Removes a media asset's object only when no other database record still
 * references that asset. This prevents duplicate products or shared assets
 * from accidentally deleting an image still in use.
 */
export async function deleteMediaAssetIfUnused(assetId: string | null | undefined): Promise<void> {
  if (!assetId) return;

  const [product, category, offer, gallery, brand, catalogue] = await Promise.all([
    prisma.product.findFirst({ where: { imageAssetId: assetId }, select: { id: true } }),
    prisma.category.findFirst({ where: { imageAssetId: assetId }, select: { id: true } }),
    prisma.offer.findFirst({ where: { imageAssetId: assetId }, select: { id: true } }),
    prisma.galleryImage.findFirst({ where: { assetId }, select: { id: true } }),
    prisma.brandSettings.findFirst({
      where: { OR: [{ logoAssetId: assetId }, { faviconAssetId: assetId }] },
      select: { websiteId: true },
    }),
    prisma.catalogue.findFirst({ where: { coverImageAssetId: assetId }, select: { id: true } }),
  ]);

  if (product || category || offer || gallery || brand || catalogue) return;

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId },
    select: { id: true, url: true },
  });
  if (!asset) return;

  // Delete the storage object first when this is a Supabase URL. Local URLs
  // are left alone; local cleanup is intentionally outside the production
  // storage path and is safe to handle separately during development.
  const objectPath = supabaseObjectPathFromUrl(asset.url);
  if (objectPath) {
    try {
      await deleteFromSupabaseStorage(objectPath);
    } catch {
      // Do not make a successful content deletion fail because storage cleanup
      // is temporarily unavailable. The database record is still removed below.
    }
  }

  await prisma.mediaAsset.delete({ where: { id: asset.id } });
}
