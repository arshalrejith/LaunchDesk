import { prisma } from "@/lib/prisma";
import type { WebsiteSnapshot } from "@/lib/snapshot";

export type PublishedLookup =
  | { found: false }
  | { found: true; businessName: string | null; live: false }
  | { found: true; businessName: string | null; live: true; snapshot: WebsiteSnapshot; templateId: string; previewSlug: string };

/**
 * The single place both /sites/[slug] and /sites/[slug]/catalogue read from.
 * Never touches live Category/Product/etc. tables — only the snapshot that
 * was frozen at the last Publish (or Restore), so in-progress dashboard edits
 * never leak onto the live site.
 */
export async function getPublishedWebsite(slug: string): Promise<PublishedLookup> {
  const website = await prisma.website.findUnique({
    where: { previewSlug: slug },
    include: { client: true, settings: true },
  });

  if (!website || website.client.status === "DISABLED") return { found: false };

  if (website.publishStatus !== "PUBLISHED" || !website.currentVersionId) {
    return { found: true, businessName: website.settings?.businessName ?? null, live: false };
  }

  const version = await prisma.versionSnapshot.findUnique({ where: { id: website.currentVersionId } });
  if (!version) {
    return { found: true, businessName: website.settings?.businessName ?? null, live: false };
  }

  const snapshot = JSON.parse(version.contentJson) as WebsiteSnapshot;
  return { found: true, businessName: snapshot.settings?.businessName ?? null, live: true, snapshot, templateId: snapshot.templateId, previewSlug: website.previewSlug };
}

export function assetUrl(snapshot: WebsiteSnapshot, assetId: string | null | undefined) {
  if (!assetId) return null;
  return snapshot.mediaAssets.find((a) => a.id === assetId)?.url ?? null;
}

export function sectionEnabled(snapshot: WebsiteSnapshot, key: string) {
  return snapshot.sections.find((s) => s.key === key)?.enabled ?? false;
}
