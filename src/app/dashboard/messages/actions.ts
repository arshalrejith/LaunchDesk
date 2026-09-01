"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";

export async function toggleHandledAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.enquiry.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.enquiry.update({ where: { id }, data: { handled: !existing.handled } });
  revalidatePath("/dashboard/messages");
}
