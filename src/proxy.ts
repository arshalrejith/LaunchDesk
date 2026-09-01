import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js 16 renamed Middleware to Proxy (same mechanism). This is the custom
// domain piece from the architecture doc: a client's own domain, once an
// agency admin sets Website.customDomain, transparently serves /sites/[slug]
// without the visitor ever seeing that path. Needs the Node.js runtime (not
// Edge) because Prisma's PostgreSQL driver adapter requires Node.js.
export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
};

const KNOWN_HOSTS = new Set(["localhost:3000", "127.0.0.1:3000"]);

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Only look up a custom domain when the host isn't our own app's host —
  // avoids a DB hit on every single request during normal use.
  if (KNOWN_HOSTS.has(host) || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  const bareHost = host.split(":")[0];
  const website = await prisma.website.findUnique({
    where: { customDomain: bareHost },
    select: { previewSlug: true, publishStatus: true },
  });

  if (!website || website.publishStatus !== "PUBLISHED") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/sites/${website.previewSlug}${suffix}`;
  return NextResponse.rewrite(url);
}
