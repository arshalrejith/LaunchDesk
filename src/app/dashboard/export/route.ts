import { requireClientSession } from "@/lib/scope";
import { buildStaticSiteHtml, renderSnapshotToHtml } from "@/lib/staticExport";
import { buildWebsiteSnapshot } from "@/lib/snapshot";
import { TEMPLATE_COMPONENTS } from "@/components/site-templates";

/** Client-side counterpart to the agency's export route — same file, scoped
 * to the signed-in client's own website via requireClientSession(). Same
 * ?template= and ?draft=1 options, so a client can compare all 3 designs on
 * their own real content, published or not, before deciding. */
export async function GET(req: Request) {
  const { website } = await requireClientSession();
  const url = new URL(req.url);
  const templateParam = url.searchParams.get("template");
  const templateIdOverride = templateParam && templateParam in TEMPLATE_COMPONENTS ? templateParam : undefined;
  const isDraft = url.searchParams.get("draft") === "1";
  const inline = url.searchParams.get("inline") === "1";

  const result = isDraft
    ? await (async () => {
        const snapshot = await buildWebsiteSnapshot(website.id);
        return renderSnapshotToHtml(snapshot, website.previewSlug, website.lastPublishedAt, templateIdOverride);
      })()
    : await buildStaticSiteHtml(website.id, templateIdOverride);

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
