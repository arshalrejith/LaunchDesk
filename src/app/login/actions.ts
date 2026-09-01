"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // Login is public and reachable by anything on the internet — throttle by
  // both email and IP so a script can't hammer one account (or spray many
  // accounts from one IP) with unlimited password guesses.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited(`login-email:${email}`, 8, 5 * 60_000) || await isRateLimited(`login-ip:${ip}`, 20, 5 * 60_000)) {
    return { error: "Too many attempts — please wait a few minutes and try again." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { client: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email or password isn't right." };
  }

  if (user.role === "CLIENT" && user.client?.status === "DISABLED") {
    return { error: "This account has been disabled by the agency. Contact them for access." };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    clientId: user.clientId ?? null,
  });

  redirect(user.role === "AGENCY_ADMIN" ? "/admin" : "/dashboard");
}
