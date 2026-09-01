import { notFound } from "next/navigation";
import { Globe2, Clock3 } from "lucide-react";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getPublishedWebsite } from "@/lib/publicSite";
import { makeLiveEnv } from "@/lib/templateData";
import { getTemplateComponent } from "@/components/site-templates";
import { defaultSiteColors } from "@/lib/templateColors";
import EnquiryForm from "./enquiry-form";

// This is the actual render(template, content, products, media, settings) -> HTML
// pipeline from the architecture doc. It reads ONLY from the last published
// VersionSnapshot.contentJson — never the live tables — so in-progress
// dashboard edits never leak onto the live site.
//
// This route is a thin dispatcher: fetch the published snapshot, pick the
// structural template by snapshot.templateId, hand it the data. All actual
// layout — hero shape, product grid, section order, typography — lives in
// ./templates/*, three genuinely different components sharing one data
// pipeline (@/lib/templateData) so none of them can drift on what counts as
// "the real facts" about this business.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedWebsite(slug);
  if (!result.found || !result.live) return { title: result.found ? result.businessName ?? "Not live yet" : "Not found" };
  const { snapshot } = result;
  const title = snapshot.seo?.title || snapshot.settings?.businessName || "Website";
  const description = snapshot.seo?.metaDesc || snapshot.settings?.description || undefined;
  return { title, description, keywords: snapshot.seo?.keywords || undefined };
}

export default async function PublicSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedWebsite(slug);

  if (!result.found) notFound();

  if (!result.live) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)] px-6 py-16 text-center">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)]">
            <Globe2 size={22} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gray-400)]">Website coming soon</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--gray-900)]">{result.businessName ?? "This website"}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--gray-500)]">This website is being prepared and has not been published yet. Please check back soon.</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--gray-100)] px-3 py-1.5 text-xs font-medium text-[var(--gray-600)]"><Clock3 size={13} /> Publishing in progress</div>
        </div>
      </main>
    );
  }

  const { snapshot, previewSlug, templateId } = result;
  const defaults = defaultSiteColors(templateId);
  const brandVars = {
    "--site-bg": snapshot.brand?.backgroundColor || defaults.bg,
    "--site-accent": snapshot.brand?.primaryColor || defaults.accent,
  } as CSSProperties;

  // getTemplateComponent always returns one of three stable, module-level
  // component references from a lookup table — never a freshly created
  // component — so the JSX usage below is safe despite the lint rule's
  // static analysis limits (it can't see through the Record lookup).
  const Template = getTemplateComponent(templateId);
  const env = makeLiveEnv(snapshot, previewSlug, <EnquiryForm slug={previewSlug} />);

  return (
    <main className="site-page" style={brandVars}>
      {/* eslint-disable-next-line react-hooks/static-components -- Template is a stable lookup-table reference, not created here */}
      <Template snapshot={snapshot} previewSlug={previewSlug} env={env} />
    </main>
  );
}
