import { prisma } from "@/lib/prisma";
import { buildWebsiteSnapshot } from "@/lib/snapshot";
import { revalidatePath } from "next/cache";

/**
 * The one real publish routine — freezes the current draft into a numbered
 * VersionSnapshot, clears the pending change log, and points the site at it.
 * Called from two places: the client's own Publish button (gated by
 * Website.clientPublishEnabled) and the agency's direct Publish from
 * /admin/clients/[id] (never gated — the agency can always publish).
 */
export async function publishWebsite(websiteId: string) {
  const pending = await prisma.changeLogEntry.findMany({
    where: { websiteId },
    orderBy: { createdAt: "asc" },
  });
  const summary = pending.length ? pending.map((c) => c.text) : ["No content changes since last publish"];

  const lastVersion = await prisma.versionSnapshot.findFirst({
    where: { websiteId },
    orderBy: { number: "desc" },
  });
  const number = (lastVersion?.number ?? 0) + 1;
  const snapshot = await buildWebsiteSnapshot(websiteId);

  const website = await prisma.$transaction(async (tx) => {
    const version = await tx.versionSnapshot.create({
      data: {
        websiteId,
        number,
        label: `Version ${number}`,
        summary: JSON.stringify(summary),
        contentJson: JSON.stringify(snapshot),
      },
    });
    await tx.changeLogEntry.deleteMany({ where: { websiteId } });
    return tx.website.update({
      where: { id: websiteId },
      data: { publishStatus: "PUBLISHED", lastPublishedAt: new Date(), currentVersionId: version.id },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/history");
  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${website.clientId}`);
  revalidatePath(`/sites/${website.previewSlug}`);
  revalidatePath(`/sites/${website.previewSlug}/catalogue`);

  return { number };
}
