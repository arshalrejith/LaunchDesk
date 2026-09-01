import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed LaunchDesk.");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SECTION_KEYS = [
  "products", "categories", "catalogue", "gallery", "offers", "about",
  "contact", "location", "whatsapp", "instagram",
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development seed is disabled in production. Create production accounts through a controlled setup flow.");
  }
  const agency = await prisma.agency.upsert({
    where: { id: "agency_default" },
    update: {},
    create: { id: "agency_default", name: "Default Agency" },
  });

  const client = await prisma.client.upsert({
    where: { slug: "ambika-sarees" },
    update: {},
    create: {
      slug: "ambika-sarees",
      agencyId: agency.id,
      status: "ACTIVE",
    },
  });

  const website = await prisma.website.upsert({
    where: { clientId: client.id },
    update: {},
    create: {
      clientId: client.id,
      templateId: "premium-boutique-01",
      publishStatus: "DRAFT",
      previewSlug: "ambika-sarees",
    },
  });

  await prisma.settings.upsert({
    where: { websiteId: website.id },
    update: {},
    create: {
      websiteId: website.id,
      businessName: "Ambika Sarees",
      tagline: "New trending sarees, every week",
      category: "Saree Sales / Boutique",
      description:
        "A neighbourhood saree shop in Medavakkam, known for restocking new trending styles and delivering orders placed by phone or WhatsApp.",
      phone: "7467876778",
      whatsapp: "7467876778",
      hours: "10 AM – 10 PM, daily",
      area: "Medavakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      mapsUrl:
        "https://www.google.com/maps?vet=10CAAQoqAOahcKEwiY-rPopbaWAxUAAAAAHQAAAAAQBg..i&pvq=CgsvZy8xdGY3a3p4NyITCg1hbWJpa2Egc2FyZWVzEAIYAw&lqi=Cg1hbWJpa2Egc2FyZWVzSIf349PlgICACFoVEAAQARgAIg1hbWJpa2Egc2FyZWVzaAGSAQ5jbG90aGluZ19zdG9yZaEBYsyEfMLoASKhAYs0Rso9yh-zoQHWIaS_79xPFaEBUHiUnJWGfNmhAUx6cAUrIZcs&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWvbS0LrY1I6MVoQnk99sZIX&daddr=333,+Chennai+-+Tiruvallur+High+Rd,+near+Railway+Over+Bridge,+Venkatapuram,+Ambattur,+Chennai,+Greater+Chennai,+Tamil+Nadu+600053",
      instagram: "https://www.instagram.com/ambika_sarees",
      countryCode: "IN",
      currency: "INR",
      locale: "en-IN",
      phoneCountryCode: "+91",
    },
  });

  for (const key of SECTION_KEYS) {
    await prisma.sectionToggle.upsert({
      where: { websiteId_key: { websiteId: website.id, key } },
      update: {},
      create: { websiteId: website.id, key, enabled: true },
    });
  }

  const clientPassword = process.env.SEED_CLIENT_PASSWORD || randomBytes(12).toString("base64url");
  const clientPasswordHash = await bcrypt.hash(clientPassword, 12);
  await prisma.user.upsert({
    where: { email: "owner@ambikasarees.example" },
    update: { passwordHash: clientPasswordHash },
    create: {
      email: "owner@ambikasarees.example",
      passwordHash: clientPasswordHash,
      role: "CLIENT",
      clientId: client.id,
    },
  });

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || randomBytes(12).toString("base64url");
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: "admin@agency.example" },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: "admin@agency.example",
      passwordHash: adminPasswordHash,
      role: "AGENCY_ADMIN",
      clientId: null,
    },
  });

  console.log("Seeded: Ambika Sarees (client) + agency admin.");
  console.log(`  Client login: owner@ambikasarees.example / ${clientPassword}`);
  console.log(`  Agency login: admin@agency.example / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
