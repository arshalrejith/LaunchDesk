import EditorialTemplate from "./EditorialTemplate";
import BoutiqueTemplate from "./BoutiqueTemplate";
import ConversionTemplate from "./ConversionTemplate";
import WarmBoutiqueTemplate from "./WarmBoutiqueTemplate";
import ModernTemplate from "./ModernTemplate";
import CustomBuilderTemplate from "./CustomBuilderTemplate";
import type { TemplateComponent } from "./types";

export const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  "modern-boutique-01": EditorialTemplate,
  "premium-boutique-01": BoutiqueTemplate,
  "conversion-boutique-01": ConversionTemplate,
  "warm-boutique-amber": WarmBoutiqueTemplate,
  "warm-boutique-rose": WarmBoutiqueTemplate,
  "warm-boutique-teal": WarmBoutiqueTemplate,
  // New modern template
  "modern-2025": ModernTemplate,
  "custom-builder": CustomBuilderTemplate,
};

export function getTemplateComponent(templateId: string | null | undefined): TemplateComponent {
  return TEMPLATE_COMPONENTS[templateId ?? ""] ?? ModernTemplate;
}

export { EditorialTemplate, BoutiqueTemplate, ConversionTemplate, WarmBoutiqueTemplate, ModernTemplate, CustomBuilderTemplate };
