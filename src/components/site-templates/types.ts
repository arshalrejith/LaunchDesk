import type { ReactNode } from "react";
import type { WebsiteSnapshot } from "@/lib/snapshot";
import type { TemplateEnv } from "@/lib/templateData";

/** Every template component has exactly this shape — pure presentation,
 * zero data-fetching, zero knowledge of whether it's being rendered live
 * (Next.js route) or exported to a static file (ReactDOMServer). That's
 * what lets the same component power both without duplication. */
export type TemplateComponentProps = {
  snapshot: WebsiteSnapshot;
  previewSlug: string;
  env: TemplateEnv;
};

export type TemplateComponent = (props: TemplateComponentProps) => ReactNode;
