"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { restoreWebsiteSnapshot, type WebsiteSnapshot } from "@/lib/snapshot";

export async function restoreVersionAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const version = await prisma.versionSnapshot.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(version.websiteId, website.id);

  const snapshot = JSON.parse(version.contentJson) as WebsiteSnapshot;
  await restoreWebsiteSnapshot(website.id, snapshot);

  // Restoring re-points the live site at this older version and syncs the
  // live tables to match it, so future edits diff from that baseline rather
  // than from whatever was live a moment ago. It does not delete anything
  // newer — those versions still exist in History if you change your mind.
  await prisma.changeLogEntry.deleteMany({ where: { websiteId: website.id } });

  // Same paywall gate as a normal Publish (see publishAction in
  // ../settings/actions.ts). Without this check, Restore is a back door
  // around an agency locking a client's Publish button on an unpaid account:
  // the content still restores either way, but the site only flips back to
  // PUBLISHED if the client is actually allowed to publish right now.
  await prisma.website.update({
    where: { id: website.id },
    data: website.clientPublishEnabled
      ? { publishStatus: "PUBLISHED", lastPublishedAt: new Date(), currentVersionId: version.id }
      : { currentVersionId: version.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/history");
  revalidatePath(`/sites/${website.previewSlug}`);
  revalidatePath(`/sites/${website.previewSlug}/catalogue`);
}
