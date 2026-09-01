"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { logChange } from "@/lib/changelog";

export async function createDiscountAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const name = String(formData.get("name") ?? "").trim();
  const value = Number(formData.get("value"));
  const type = String(formData.get("type") ?? "percent");
  if (!name) return { error: "Discount name is required." };
  if (!Number.isFinite(value) || value <= 0) return { error: "Enter a value greater than 0." };
  if (type === "percent" && value > 100) return { error: "A percentage discount can't be more than 100." };

  await prisma.discount.create({
    data: {
      websiteId: website.id,
      name,
      type,
      value,
      code: String(formData.get("code") ?? "").trim().toUpperCase() || null,
    },
  });
  await logChange(website.id, `Added discount "${name}"`);
  revalidatePath("/dashboard/discounts");
  return {};
}

export async function toggleDiscountAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.discount.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.discount.update({ where: { id }, data: { active: !existing.active } });
  await logChange(website.id, `${existing.active ? "Deactivated" : "Activated"} discount "${existing.name}"`);
  revalidatePath("/dashboard/discounts");
}

export async function deleteDiscountAction(formData: FormData) {
  const { website } = await requireClientSession();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.discount.findUniqueOrThrow({ where: { id } });
  assertOwnsWebsite(existing.websiteId, website.id);
  await prisma.discount.delete({ where: { id } });
  await logChange(website.id, `Deleted discount "${existing.name}"`);
  revalidatePath("/dashboard/discounts");
}
