export type BusinessConfig = {
  countryCode?: string | null;
  currency?: string | null;
  locale?: string | null;
  phoneCountryCode?: string | null;
};

export const COUNTRY_OPTIONS = [
  { code: "IN", name: "India", currency: "INR", locale: "en-IN", phone: "+91" },
  { code: "US", name: "United States", currency: "USD", locale: "en-US", phone: "+1" },
  { code: "GB", name: "United Kingdom", currency: "GBP", locale: "en-GB", phone: "+44" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", locale: "en-AE", phone: "+971" },
  { code: "AU", name: "Australia", currency: "AUD", locale: "en-AU", phone: "+61" },
  { code: "CA", name: "Canada", currency: "CAD", locale: "en-CA", phone: "+1" },
  { code: "SG", name: "Singapore", currency: "SGD", locale: "en-SG", phone: "+65" },
  { code: "MY", name: "Malaysia", currency: "MYR", locale: "en-MY", phone: "+60" },
  { code: "NZ", name: "New Zealand", currency: "NZD", locale: "en-NZ", phone: "+64" },
  { code: "DE", name: "Germany", currency: "EUR", locale: "de-DE", phone: "+49" },
  { code: "FR", name: "France", currency: "EUR", locale: "fr-FR", phone: "+33" },
  { code: "JP", name: "Japan", currency: "JPY", locale: "ja-JP", phone: "+81" },
] as const;

export const CURRENCY_OPTIONS = [
  ["INR", "Indian Rupee (INR)"], ["USD", "US Dollar (USD)"], ["EUR", "Euro (EUR)"],
  ["GBP", "British Pound (GBP)"], ["AED", "UAE Dirham (AED)"], ["AUD", "Australian Dollar (AUD)"],
  ["CAD", "Canadian Dollar (CAD)"], ["SGD", "Singapore Dollar (SGD)"], ["MYR", "Malaysian Ringgit (MYR)"],
  ["NZD", "New Zealand Dollar (NZD)"], ["JPY", "Japanese Yen (JPY)"], ["CHF", "Swiss Franc (CHF)"],
] as const;

export function currencySymbol(currency: string | null | undefined, locale = "en-US") {
  try {
    const parts = new Intl.NumberFormat(locale, { style: "currency", currency: currency || "USD", currencyDisplay: "narrowSymbol" }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value || currency || "";
  } catch {
    return currency || "";
  }
}

export function formatMoney(value: number | null | undefined, config: BusinessConfig | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "";
  const currency = config?.currency || "USD";
  const locale = config?.locale || "en-US";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: currency === "JPY" ? 0 : 2 }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function normalizePhone(raw: string | null | undefined, countryCode: string | null | undefined) {
  const input = String(raw || "").trim();
  if (!input) return null;
  if (input.startsWith("+")) return `+${input.slice(1).replace(/\D/g, "")}`;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (!digits) return null;
  const cc = String(countryCode || "").replace(/\D/g, "");
  if (cc && digits.startsWith(cc)) return `+${digits}`;
  return cc ? `+${cc}${digits}` : `+${digits}`;
}

export function getBusinessConfig(settings: BusinessConfig | null | undefined) {
  return {
    countryCode: settings?.countryCode || "IN",
    currency: settings?.currency || "INR",
    locale: settings?.locale || "en-IN",
    phoneCountryCode: settings?.phoneCountryCode || "+91",
  };
}

export function terminology(category: string | null | undefined) {
  const c = category || "Other";
  if (["Dental / Healthcare Clinic", "Pharmacy"].includes(c)) return { item: "Service", items: "Services", category: "Service categories", add: "Add service", empty: "Add your first service", emptyHint: "Add a service with a name and price to get started." };
  if (["Gym / Fitness", "Salon / Beauty", "Education / Coaching", "Professional Services", "Photography", "Travel / Tours", "Automobile / Repair", "Home Services / Construction"].includes(c)) return { item: "Service", items: "Services", category: "Service categories", add: "Add service", empty: "Add your first service", emptyHint: "Add a service with a name and price to get started." };
  if (c === "Restaurant / Café") return { item: "Menu item", items: "Menu", category: "Menu categories", add: "Add menu item", empty: "Add your first menu item", emptyHint: "Add a menu item with a name and price to get started." };
  if (c === "Hotel / Hospitality") return { item: "Offering", items: "Offerings", category: "Offering categories", add: "Add offering", empty: "Add your first offering", emptyHint: "Add an offering with a name and price to get started." };
  return { item: "Product", items: "Products", category: "Categories", add: "Add product", empty: "Add your first product", emptyHint: "Add a product with a name and price to get started." };
}
