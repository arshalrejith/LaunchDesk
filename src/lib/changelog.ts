import { prisma } from "@/lib/prisma";

/** Records one human-readable line of "what changed since the last publish". */
export async function logChange(websiteId: string, text: string) {
  await prisma.changeLogEntry.create({ data: { websiteId, text } });
}
