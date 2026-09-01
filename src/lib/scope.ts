import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Every dashboard route must call one of these instead of trusting a
 * clientId/websiteId that arrives from the client (form field, query param).
 * The session is the only source of truth for "which client am I".
 */

export async function requireClientSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "AGENCY_ADMIN") redirect("/admin?from=dashboard");
  if (!session.clientId) redirect("/login");
  const client = await prisma.client.findUnique({
    where: { id: session.clientId },
    include: { website: { include: { settings: true } } },
  });
  if (!client || client.status === "DISABLED") {
    redirect("/login?disabled=1");
  }
  if (!client.website) {
    // Should not happen once seeding/onboarding always creates a Website row.
    throw new Error(`Client ${client.id} has no website record`);
  }
  return { session, client, website: client.website };
}

export async function requireAgencyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "AGENCY_ADMIN") {
    redirect("/login");
  }
  return { session };
}

/** Scopes any websiteId-owning query to the caller's own website — never trust an id from a form. */
export function assertOwnsWebsite(websiteId: string, ownWebsiteId: string) {
  if (websiteId !== ownWebsiteId) {
    throw new Error("Forbidden: resource does not belong to this client");
  }
}
