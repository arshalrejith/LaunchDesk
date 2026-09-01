import { readFile } from "fs/promises";
import path from "path";
import type { CSSProperties } from "react";
import { renderToStaticMarkup } from "react-dom/server.edge";
import { prisma } from "@/lib/prisma";
import type { WebsiteSnapshot } from "@/lib/snapshot";
import { makeExportEnv } from "@/lib/templateData";
import { getTemplateComponent } from "@/components/site-templates";
import { SITE_SHARED_CSS, SITE_FONT_LINK_HREF, SITE_REVEAL_SCRIPT } from "@/lib/siteSharedStyles";
import { defaultSiteColors } from "@/lib/templateColors";
import { getGoogleFontHref } from "@/components/builder/sections";
import { resolveLinkTarget } from "@/lib/linkTargets";

/**
 * Turns the last PUBLISHED VersionSnapshot into one self-contained .html file
 * — rendered from the *exact same* template component the live site uses
 * (via ReactDOMServer.renderToStaticMarkup), so whichever of the three
 * structural designs is active is what gets downloaded, not a separate
 * hand-rolled layout that could drift from the real site over time.
 *
 * Two things change for the static path: every image is inlined as base64
 * (no server to fetch /uploads/* from), and the Enquiry Form — which can't
 * submit anywhere without a server — is swapped for a "Call / WhatsApp us"
 * fallback via the same enquiryNode slot the live route fills with the real
 * form. The Catalogue is a separate live route and isn't bundled in.
 */

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function escapeHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function toDataUri(localUrl: string): Promise<string | null> {
  const ext = path.extname(localUrl).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return null;
  try {
    const filePath = path.join(process.cwd(), "public", localUrl.replace(/^\//, ""));
    const buf = await readFile(filePath);
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null; // file missing on disk — skip rather than break the whole export
  }
}

export type StaticExportResult = { html: string; filename: string; businessName: string };
export type StaticExportError = { error: string };

/** The real entry point for the download-a-file feature: only ever exports
 * what's actually been published, never a draft. */
export async function buildStaticSiteHtml(
  websiteId: string,
  templateIdOverride?: string
): Promise<StaticExportResult | StaticExportError> {
  const website = await prisma.website.findUnique({ where: { id: websiteId } });
  if (!website) return { error: "Website not found." };
  if (website.publishStatus !== "PUBLISHED" || !website.currentVersionId) {
    return { error: "This site hasn't been published yet — publish it first, then download the file." };
  }

  const version = await prisma.versionSnapshot.findUnique({ where: { id: website.currentVersionId } });
  if (!version) return { error: "No published version found." };

  const snapshot = JSON.parse(version.contentJson) as WebsiteSnapshot;
  return renderSnapshotToHtml(snapshot, website.previewSlug, website.lastPublishedAt, templateIdOverride);
}

/** The pure renderer, split out so pre-publish tooling (e.g. generating a
 * few options to compare before publishing) can call it directly on an
 * in-progress snapshot without needing a real publish first. templateIdOverride
 * lets a caller preview a *different* structural template than the one
 * actually saved on the website, without touching the database — that's
 * what powers "compare all 3 designs on your real content" in the dashboard
 * and admin panel. */
export async function renderSnapshotToHtml(
  snapshot: WebsiteSnapshot,
  previewSlug: string,
  lastPublishedAt: Date | null,
  templateIdOverride?: string
): Promise<StaticExportResult> {
  const settings = snapshot.settings;
  const businessName = settings?.businessName || "Website";
  const enabled = (key: string) => snapshot.sections.find((s) => s.key === key)?.enabled ?? false;

  // Every media asset this snapshot actually references, inlined once each.
  const imgMap: Record<string, string> = {};
  await Promise.all(
    snapshot.mediaAssets.map(async (a) => {
      const uri = await toDataUri(a.url);
      if (uri) imgMap[a.id] = uri;
    })
  );

  const callHref = settings?.phone ? resolveLinkTarget({ type: "call", value: null, phone: settings.phone, whatsapp: settings.whatsapp, phoneCountryCode: settings.phoneCountryCode, mapsUrl: settings.mapsUrl, previewSlug })?.href ?? null : null;
  const whatsappHref = settings?.whatsapp && enabled("whatsapp")
    ? resolveLinkTarget({ type: "whatsapp", value: `Hi ${businessName}, I have a question.`, phone: settings.phone, whatsapp: settings.whatsapp, phoneCountryCode: settings.phoneCountryCode, mapsUrl: settings.mapsUrl, previewSlug })?.href ?? null
    : null;

  const enquiryNode = (
    <div>
      <p style={{ marginBottom: "0.75rem", color: "color-mix(in srgb, var(--site-ink) 70%, transparent)" }}>
        This is a saved copy, so the form can&rsquo;t be filled in here — reach out directly instead:
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {callHref && <a href={callHref} className="btn btn-solid">Call Us</a>}
        {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener" className="btn btn-outline">WhatsApp Us</a>}
      </div>
    </div>
  );

  const env = makeExportEnv(snapshot, previewSlug, imgMap, enquiryNode);
  const effectiveTemplateId = templateIdOverride ?? snapshot.templateId;
  const Template = getTemplateComponent(effectiveTemplateId);

  const defaults = defaultSiteColors(effectiveTemplateId);
  const brandVars = {
    "--site-bg": snapshot.brand?.backgroundColor || defaults.bg,
    "--site-accent": snapshot.brand?.primaryColor || defaults.accent,
  } as CSSProperties;

  const bodyMarkup = renderToStaticMarkup(
    <main className="site-page" style={brandVars}>
      <p style={{ background: "#fff8e1", color: "#7a5b00", fontSize: "0.8rem", textAlign: "center", padding: "0.5rem 1rem" }}>
        This is a saved snapshot from {new Date(lastPublishedAt ?? Date.now()).toLocaleDateString(snapshot.settings?.locale || "en-US")} — for the latest version, ask for a fresh copy.
      </p>
      <Template snapshot={snapshot} previewSlug={previewSlug} env={env} />
    </main>
  );

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(businessName)}${settings?.tagline ? ` — ${escapeHtml(settings.tagline)}` : ""}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${SITE_FONT_LINK_HREF}" rel="stylesheet">
${effectiveTemplateId === "custom-builder" && snapshot.customPage?.font ? `<link href="${getGoogleFontHref(snapshot.customPage.font)}" rel="stylesheet">` : ""}
<style>${SITE_SHARED_CSS}</style>
</head>
<body>${bodyMarkup}</body>
<script>${SITE_REVEAL_SCRIPT}</script>
</html>`;

  return { html, filename: `${previewSlug}.html`, businessName };
}
