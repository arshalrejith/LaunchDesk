export const SECTION_DEFS = [
  { key: "products", name: "Products / New Arrivals", core: true },
  { key: "categories", name: "Categories", core: true },
  { key: "catalogue", name: "Product Catalogue", core: false },
  { key: "gallery", name: "Gallery", core: false },
  { key: "offers", name: "Offers", core: false },
  { key: "about", name: "About Us / Our Story", core: false },
  { key: "services", name: "Services", core: false },
  { key: "testimonials", name: "Testimonials", core: false },
  { key: "faq", name: "FAQ", core: false },
  { key: "whyus", name: "Why Choose Us", core: false },
  { key: "contact", name: "Contact", core: true },
  { key: "location", name: "Location / Directions", core: true },
  { key: "googlemap", name: "Google Map Embed", core: false },
  { key: "instagram", name: "Instagram Feed", core: false },
  { key: "facebook", name: "Facebook", core: false },
  { key: "whatsapp", name: "WhatsApp Order Button", core: true },
  { key: "booking", name: "Appointment Booking", core: false },
  { key: "enquiry", name: "Enquiry Form", core: false },
  { key: "reviews", name: "Reviews", core: false },
] as const;

export const CATEGORY_OPTIONS = [
  "Saree Sales / Boutique",
  "Clothing / Fashion",
  "Restaurant / Café",
  "Bakery",
  "Grocery / General Retail",
  "Jewellery",
  "Electronics",
  "Furniture / Home Decor",
  "Pharmacy",
  "Dental / Healthcare Clinic",
  "Salon / Beauty",
  "Gym / Fitness",
  "Education / Coaching",
  "Hotel / Hospitality",
  "Professional Services",
  "Photography",
  "Travel / Tours",
  "Automobile / Repair",
  "Home Services / Construction",
  "Other",
] as const;

export const CATEGORY_RECOMMENDATIONS: Record<string, string[]> = {
  "Saree Sales / Boutique": ["products", "categories", "catalogue", "gallery", "offers", "about", "contact", "location", "whatsapp", "instagram"],
  "Clothing / Fashion": ["products", "categories", "catalogue", "gallery", "offers", "about", "contact", "location", "whatsapp", "instagram"],
  "Restaurant / Café": ["products", "categories", "gallery", "about", "contact", "location", "googlemap", "whatsapp", "reviews"],
  "Dental / Healthcare Clinic": ["services", "about", "faq", "testimonials", "booking", "contact", "location", "enquiry"],
  "Salon / Beauty": ["services", "gallery", "offers", "booking", "testimonials", "contact", "location", "whatsapp"],
  "Gym / Fitness": ["services", "gallery", "offers", "whyus", "testimonials", "contact", "location", "enquiry"],
  "Bakery": ["products", "categories", "gallery", "offers", "about", "contact", "location", "whatsapp"],
  "Electronics": ["products", "categories", "catalogue", "offers", "about", "contact", "location", "whatsapp"],
  "Furniture / Home Decor": ["products", "categories", "gallery", "offers", "about", "contact", "location", "whatsapp"],
  "Pharmacy": ["products", "categories", "about", "contact", "location", "enquiry"],
  "Education / Coaching": ["services", "about", "testimonials", "faq", "gallery", "enquiry", "contact", "location"],
  "Hotel / Hospitality": ["services", "gallery", "offers", "about", "reviews", "contact", "location", "booking", "enquiry"],
  "Professional Services": ["services", "about", "testimonials", "faq", "contact", "location", "enquiry"],
  "Photography": ["services", "gallery", "offers", "about", "testimonials", "contact", "location", "enquiry"],
  "Travel / Tours": ["services", "gallery", "offers", "about", "reviews", "faq", "booking", "contact", "location", "enquiry"],
  "Automobile / Repair": ["services", "gallery", "offers", "about", "contact", "location", "booking", "enquiry"],
  "Home Services / Construction": ["services", "gallery", "about", "testimonials", "contact", "location", "enquiry"],
  "Grocery / General Retail": ["products", "categories", "catalogue", "offers", "contact", "location", "whatsapp"],
  "Jewellery": ["products", "categories", "gallery", "about", "testimonials", "contact", "location", "enquiry"],
  "Other": ["about", "products", "services", "contact", "location", "whatsapp"],
};

export function recommendedSectionsFor(category: string | null | undefined): string[] {
  return CATEGORY_RECOMMENDATIONS[category ?? ""] ?? CATEGORY_RECOMMENDATIONS["Other"];
}

export function sectionNameFor(category: string | null | undefined, key: string): string {
  const t = {
    products: "Products",
    categories: "Categories",
    catalogue: "Product Catalogue",
  } as Record<string, string>;
  if (["Dental / Healthcare Clinic", "Pharmacy", "Gym / Fitness", "Salon / Beauty", "Education / Coaching", "Professional Services", "Photography", "Travel / Tours", "Automobile / Repair", "Home Services / Construction"].includes(category || "")) {
    t.products = "Services"; t.categories = "Service categories"; t.catalogue = "Service catalogue";
  } else if (category === "Restaurant / Café") {
    t.products = "Menu"; t.categories = "Menu categories"; t.catalogue = "Menu catalogue";
  } else if (category === "Hotel / Hospitality") {
    t.products = "Offerings"; t.categories = "Offering categories"; t.catalogue = "Offering catalogue";
  }
  return t[key] || ({
    gallery: "Gallery", offers: "Offers", about: "About Us / Our Story", services: "Services",
    testimonials: "Testimonials", faq: "FAQ", whyus: "Why Choose Us", contact: "Contact",
    location: "Location / Directions", googlemap: "Google Map Embed", instagram: "Instagram Feed",
    facebook: "Facebook", whatsapp: "WhatsApp Order Button", booking: "Appointment Booking",
    enquiry: "Enquiry Form", reviews: "Reviews",
  } as Record<string,string>)[key] || key;
}
