"use server";

import { prisma } from "@/lib/prisma";
import { isHoneypotTripped, isRateLimited } from "@/lib/enquirySpam";

/**
 * Public-facing — no session required. This writes against the live Website
 * row (enquiries aren't part of the published snapshot; they're inbound
 * messages, not site content), but only after confirming the site is
 * actually published and the client account isn't disabled, so a disabled
 * or unpublished site can't quietly collect enquiries either.
 */
export async function submitEnquiryAction(slug: string, _prevState: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  const website = await prisma.website.findUnique({
    where: { previewSlug: slug },
    include: { client: true },
  });

  if (!website || website.client.status === "DISABLED" || website.publishStatus !== "PUBLISHED") {
    return { error: "This website can't accept enquiries right now." };
  }

  // Honeypot: real visitors never see or fill this field. Report success
  // without writing anything, so a bot gets no signal that it was caught.
  if (isHoneypotTripped(formData.get("website"))) {
    return { ok: true };
  }

  if (await isRateLimited(website.id)) {
    return { error: "Too many enquiries right now — please try again in a minute." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!phone && !message) {
    return { error: "Add a phone number or a message so they can get back to you." };
  }

  await prisma.enquiry.create({
    data: { websiteId: website.id, name: name || null, phone: phone || null, message: message || null },
  });

  return { ok: true };
}
