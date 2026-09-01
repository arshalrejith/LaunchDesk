import { prisma } from "@/lib/prisma";
import { requireAgencyAdmin } from "@/lib/scope";
import { buildStaticSiteHtml, renderSnapshotToHtml } from "@/lib/staticExport";
import { buildWebsiteSnapshot } from "@/lib/snapshot";
import { TEMPLATE_COMPONENTS } from "@/components/site-templates";

/** Agency-only: download the site as one portable, self-contained .html
 * file — same trick as the three static design-concept files, so it can be
 * emailed/WhatsApp'd straight to a customer with no server needed.
 *
 * Two optional query params:
 *  - ?template=<id>   preview a *different* structural template than the one
 *                      actually saved, without changing the website — this is
 *                      what "compare all 3 designs on your real content" uses.
 *  - ?draft=1          export the current draft instead of requiring a prior
 *                      publish, so the agency can compare designs before
 *                      going live at all. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAgencyAdmin();
  const { id } = await params;
  const url = new URL(req.url);
  const templateParam = url.searchParams.get("template");
  const templateIdOverride = templateParam && templateParam in TEMPLATE_COMPONENTS ? templateParam : undefined;
  const isDraft = url.searchParams.get("draft") === "1";
  const inline = url.searchParams.get("inline") === "1";

  const client = await prisma.client.findUnique({ where: { id }, include: { website: true } });
  if (!client || !client.website) {
    return new Response("Client not found.", { status: 404 });
  }

  const result = isDraft
    ? await (async () => {
        const snapshot = await buildWebsiteSnapshot(client.website!.id);
        return renderSnapshotToHtml(snapshot, client.website!.previewSlug, client.website!.lastPublishedAt, templateIdOverride);
      })()
    : await buildStaticSiteHtml(client.website.id, templateIdOverride);

  if ("error" in result) {
    return new Response(result.error, { status: 409 });
  }

  return new Response(result.html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${result.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
