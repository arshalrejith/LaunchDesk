"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAgencyAdmin } from "@/lib/scope";
import { publishWebsite } from "@/lib/publish";
import { hashPassword } from "@/lib/auth";
import { ALLOWED_TEMPLATE_IDS } from "@/lib/builderValidation";

function randomPassword() {
  return randomBytes(9).toString("base64url"); // 12 chars, URL-safe
}

export async function toggleClientStatusAction(formData: FormData) {
  await requireAgencyAdmin();
  const id = String(formData.get("id") ?? "");
  const client = await prisma.client.findUniqueOrThrow({ where: { id } });
  await prisma.client.update({
    where: { id },
    data: { status: client.status === "DISABLED" ? "ACTIVE" : "DISABLED" },
  });
  revalidatePath("/admin");
}

export async function setCustomDomainAction(formData: FormData) {
  await requireAgencyAdmin();
  const websiteId = String(formData.get("websiteId") ?? "");
  const domain = String(formData.get("domain") ?? "").trim().toLowerCase() || null;
  await prisma.website.update({ where: { id: websiteId }, data: { customDomain: domain } });
  revalidatePath("/admin");
}

/** The agency's own Publish — never gated by clientPublishEnabled, that flag only ever restricts the client. */
export async function adminPublishAction(formData: FormData) {
  await requireAgencyAdmin();
  const websiteId = String(formData.get("websiteId") ?? "");
  await publishWebsite(websiteId);
}

export async function createClientLoginAction(
  _prevState: { error?: string; created?: { email: string; password: string } } | undefined,
  formData: FormData
) {
  await requireAgencyAdmin();
  const clientId = String(formData.get("clientId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter the email they'll log in with." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "That email is already in use by another login." };

  const password = randomPassword();
  await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password), role: "CLIENT", clientId },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  return { created: { email, password } };
}

/** Lets the agency pick the client's active design before the client has any login at all. */
export async function setTemplateAdminAction(formData: FormData) {
  await requireAgencyAdmin();
  const websiteId = String(formData.get("websiteId") ?? "");
  const templateId = String(formData.get("templateId") ?? "").trim();
  if (!templateId || !ALLOWED_TEMPLATE_IDS.has(templateId)) {
    throw new Error("Invalid website design selected.");
  }
  const website = await prisma.website.update({ where: { id: websiteId }, data: { templateId } });
  await prisma.changeLogEntry.create({ data: { websiteId, text: `Switched active design to ${templateId}` } });
  revalidatePath(`/admin/clients/${website.clientId}`);
}

export async function setClientPublishEnabledAction(formData: FormData) {
  await requireAgencyAdmin();
  const websiteId = String(formData.get("websiteId") ?? "");
  const website = await prisma.website.findUniqueOrThrow({ where: { id: websiteId } });
  await prisma.website.update({ where: { id: websiteId }, data: { clientPublishEnabled: !website.clientPublishEnabled } });
  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${website.clientId}`);
}
