import { prisma } from "@/lib/prisma";

/**
 * Persistent sliding-window limiter backed by the application's database.
 * This works across server instances and survives restarts, unlike an
 * in-memory Map. The same model works on the hosted PostgreSQL database.
 */
export async function isRateLimited(key: string, maxHits: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing || now - Number(existing.windowStart) >= windowMs) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, hits: 1, windowStart: BigInt(now) },
      update: { hits: 1, windowStart: BigInt(now) },
    });
    return false;
  }

  if (existing.hits >= maxHits) return true;

  await prisma.rateLimit.update({
    where: { key },
    data: { hits: { increment: 1 } },
  });
  return false;
}
