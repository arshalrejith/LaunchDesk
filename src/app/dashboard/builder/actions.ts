"use server";

import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { logChange } from "@/lib/changelog";
import { saveUploadedImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { builderPayloadSchema, parseBuilderSections } from "@/lib/builderValidation";

/** Persists the merchant's layout. Called directly from the client editor
 * (not a <form action>) since the payload is structured JSON, not form
 * fields — Server Actions can be invoked either way. */
export async function saveBuilderPage(payload: unknown) {
  const { website } = await requireClientSession();
  const parsed = builderPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid page builder data. Please reload the builder and try again.");
  }
  const validatedSections = parseBuilderSections(parsed.data.sections, parsed.data.accent, false);
  if (validatedSections.length !== parsed.data.sections.length || new Set(validatedSections.map((section) => section.id)).size !== validatedSections.length) {
    throw new Error("Invalid page sections. Please reload the builder and try again.");
  }

  await prisma.customPage.upsert({
    where: { websiteId: website.id },
    create: { websiteId: website.id, accent: parsed.data.accent, font: parsed.data.font, sectionsJson: JSON.stringify(validatedSections) },
    update: { accent: parsed.data.accent, font: parsed.data.font, sectionsJson: JSON.stringify(validatedSections) },
  });
  await logChange(website.id, "Updated the custom page layout");
  revalidatePath("/dashboard/builder");
  revalidatePath("/dashboard/export");

  return { ok: true as const };
}

/** Same magic-byte-validated pipeline the rest of the dashboard uses for
 * product/category/gallery photos — the builder never trusts an external
 * image URL or an unvalidated file. */
export async function uploadBuilderImageAction(formData: FormData) {
  const { website } = await requireClientSession();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file received." };

  try {
    const url = await saveUploadedImage(file, website.id, "builder");
    if (!url) return { error: "No file received." };
    return { url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
