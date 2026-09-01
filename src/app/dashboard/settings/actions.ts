"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { publishWebsite } from "@/lib/publish";

export async function publishAction(_prevState: { error?: string } | undefined) {
  const { website } = await requireClientSession();

  // Server-side gate — the button being visible/enabled in the UI is not
  // what stops an unpaid client from publishing; this check is.
  if (!website.clientPublishEnabled) {
    return { error: "Publishing is locked on your account right now. Contact your agency to enable it." };
  }

  await publishWebsite(website.id);
  return {};
}

export async function unpublishAction() {
  const { website } = await requireClientSession();
  await prisma.website.update({ where: { id: website.id }, data: { publishStatus: "UNPUBLISHED" } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/sites/${website.previewSlug}`);
}
