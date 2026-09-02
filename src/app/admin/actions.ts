"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAgencyAdmin } from "@/lib/scope";
import { publishWebsite } from "@/lib/publish";
import { hashPassword } from "@/lib/auth";
import { ALLOWED_TEMPLATE_IDS } from "@/lib/builderValidation";

function randomPassword() {
  return randomBytes(9).toString("base64url");
}

export async function toggleClientStatusAction(formData: FormData) {
  await requireAgencyAdmin();

  const id = String(formData.get("id") ?? "");
  const client = await prisma.client.findUniqueOrThrow({ where: { id } });

  await prisma.client.update({
    where: { id },
    data: {
      status: client.status === "DISABLED" ? "ACTIVE" : "DISABLED",
    },
  });

  revalidatePath("/admin");
}

export async function setCustomDomainAction(formData: FormData) {
  await requireAgencyAdmin();

  const websiteId = String(formData.get("websiteId") ?? "");
  const domain =
    String(formData.get("domain") ?? "").trim().toLowerCase() || null;

  await prisma.website.update({
    where: { id: websiteId },
    data: { customDomain: domain },
  });

  revalidatePath("/admin");
}

/** The agency's own Publish — never gated by clientPublishEnabled. */
export async function adminPublishAction(formData: FormData) {
  await requireAgencyAdmin();

  const websiteId = String(formData.get("websiteId") ?? "");
  await publishWebsite(websiteId);
}

export async function createClientLoginAction(
  _prevState:
    | { error?: string; created?: { email: string; password: string } }
    | undefined,
  formData: FormData
) {
  await requireAgencyAdmin();

  const clientId = String(formData.get("clientId") ?? "");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Enter the email they'll log in with." };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "That email is already in use by another login." };
  }

  const password = randomPassword();

  await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: "CLIENT",
      clientId,
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);

  return {
    created: {
      email,
      password,
    },
  };
}

/** Lets the agency pick the client's active design before the client has any login. */
export async function setTemplateAdminAction(formData: FormData) {
  await requireAgencyAdmin();

  const websiteId = String(formData.get("websiteId") ?? "");
  const templateId = String(formData.get("templateId") ?? "").trim();

  if (!templateId || !ALLOWED_TEMPLATE_IDS.has(templateId)) {
    throw new Error("Invalid website design selected.");
  }

  const website = await prisma.website.update({
    where: { id: websiteId },
    data: { templateId },
  });

  await prisma.changeLogEntry.create({
    data: {
      websiteId,
      text: `Switched active design to ${templateId}`,
    },
  });

  revalidatePath(`/admin/clients/${website.clientId}`);
}

export async function setClientPublishEnabledAction(formData: FormData) {
  await requireAgencyAdmin();

  const websiteId = String(formData.get("websiteId") ?? "");

  const website = await prisma.website.findUniqueOrThrow({
    where: { id: websiteId },
  });

  await prisma.website.update({
    where: { id: websiteId },
    data: {
      clientPublishEnabled: !website.clientPublishEnabled,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${website.clientId}`);
}

/**
 * Permanently deletes one client and all of the data belonging to their website.
 *
 * This is intentionally separate from Disable:
 * - Disable preserves everything.
 * - Delete permanently removes the client and website data.
 *
 * Only an authenticated agency admin can call this action.
 */
export async function deleteClientAction(formData: FormData) {
  await requireAgencyAdmin();

  const clientId = String(formData.get("id") ?? "").trim();

  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      website: {
        select: { id: true },
      },
    },
  });

  if (!client) {
    throw new Error("Client not found.");
  }

  await prisma.$transaction(async (tx) => {
    // Remove client login accounts first.
    await tx.user.deleteMany({
      where: { clientId },
    });

    const websiteId = client.website?.id;

    if (websiteId) {
      // Delete records that belong directly to the website.
      await tx.sectionToggle.deleteMany({
        where: { websiteId },
      });

      await tx.settings.deleteMany({
        where: { websiteId },
      });

      await tx.brandSettings.deleteMany({
        where: { websiteId },
      });

      await tx.homepageContent.deleteMany({
        where: { websiteId },
      });

      await tx.seoSettings.deleteMany({
        where: { websiteId },
      });

      await tx.catalogue.deleteMany({
        where: { websiteId },
      });

      await tx.customPage.deleteMany({
        where: { websiteId },
      });

      await tx.galleryImage.deleteMany({
        where: { websiteId },
      });

      await tx.offer.deleteMany({
        where: { websiteId },
      });

      await tx.discount.deleteMany({
        where: { websiteId },
      });

      await tx.campaign.deleteMany({
        where: { websiteId },
      });

      await tx.enquiry.deleteMany({
        where: { websiteId },
      });

      await tx.changeLogEntry.deleteMany({
        where: { websiteId },
      });

      await tx.versionSnapshot.deleteMany({
        where: { websiteId },
      });

      await tx.product.deleteMany({
        where: { websiteId },
      });

      await tx.category.deleteMany({
        where: { websiteId },
      });

      await tx.mediaAsset.deleteMany({
        where: { websiteId },
      });

      // Finally remove the website itself.
      await tx.website.delete({
        where: { id: websiteId },
      });
    }

    // Finally remove the client.
    await tx.client.delete({
      where: { id: clientId },
    });
  });

  revalidatePath("/admin");
}