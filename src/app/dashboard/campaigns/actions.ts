"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { logChange } from "@/lib/changelog";

export async function createCampaignAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!title || !message) return { error: "Give the campaign a title and a message." };

  await prisma.campaign.create({ data: { websiteId: website.id, title, message } });
  await logChange(website.id, `Created campaign "${title}"`);
  revalidatePath("/dashboard/campaigns");
  return {};
}

export async function markCampaignSentAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.campaign.findUniqueOrThrow({ where: { id } });
  if (existing.websiteId !== website.id) throw new Error("Forbidden");
  await prisma.campaign.update({ where: { id }, data: { status: "sent" } });
  revalidatePath("/dashboard/campaigns");
}
