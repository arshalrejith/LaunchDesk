-- LaunchDesk Phase 2 baseline for Supabase PostgreSQL.
-- This is a fresh production database baseline; the previous SQLite migration
-- chain is retained outside prisma/migrations for local history/reference.

CREATE TYPE "Role" AS ENUM ('CLIENT', 'AGENCY_ADMIN');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'DISABLED');
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED');
CREATE TYPE "OfferStatus" AS ENUM ('ACTIVE', 'SCHEDULED', 'EXPIRED');

CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL DEFAULT 'premium-boutique-01',
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "previewSlug" TEXT NOT NULL,
    "customDomain" TEXT,
    "lastPublishedAt" TIMESTAMP(3),
    "currentVersionId" TEXT,
    "clientPublishEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Settings" (
    "websiteId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "tagline" TEXT,
    "category" TEXT,
    "description" TEXT,
    "address" TEXT,
    "area" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "mapsUrl" TEXT,
    "hours" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "gbpUrl" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "phoneCountryCode" TEXT NOT NULL DEFAULT '+91',
    CONSTRAINT "Settings_pkey" PRIMARY KEY ("websiteId")
);

CREATE TABLE "BrandSettings" (
    "websiteId" TEXT NOT NULL,
    "logoAssetId" TEXT,
    "faviconAssetId" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "backgroundColor" TEXT,
    "font" TEXT,
    "themeMode" TEXT,
    "slogan" TEXT,
    "style" TEXT,
    "feel" TEXT,
    CONSTRAINT "BrandSettings_pkey" PRIMARY KEY ("websiteId")
);

CREATE TABLE "HomepageContent" (
    "websiteId" TEXT NOT NULL,
    "heroLayout" TEXT,
    "heroHeadline" TEXT,
    "heroSubtitle" TEXT,
    "primaryCta" TEXT,
    "primaryCtaType" TEXT,
    "primaryCtaValue" TEXT,
    "secondaryCta" TEXT,
    "secondaryCtaType" TEXT,
    "secondaryCtaValue" TEXT,
    "heroImageId" TEXT,
    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("websiteId")
);

CREATE TABLE "SectionToggle" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SectionToggle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageAssetId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT,
    "fullDesc" TEXT,
    "price" DOUBLE PRECISION,
    "offerPrice" DOUBLE PRECISION,
    "unit" TEXT,
    "sku" TEXT,
    "imageAssetId" TEXT,
    "additionalImageIds" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "stockQty" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Catalogue" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "coverImageAssetId" TEXT,
    "showPrices" BOOLEAN NOT NULL DEFAULT true,
    "showDescriptions" BOOLEAN NOT NULL DEFAULT true,
    "showWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "showEnquiry" BOOLEAN NOT NULL DEFAULT true,
    "categoryIds" TEXT,
    CONSTRAINT "Catalogue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "originalPrice" DOUBLE PRECISION,
    "offerPrice" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "imageAssetId" TEXT,
    "cta" TEXT,
    "ctaType" TEXT,
    "ctaValue" TEXT,
    "whatsappMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeoSettings" (
    "websiteId" TEXT NOT NULL,
    "title" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "serviceAreas" TEXT,
    "gbpUrl" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "locale" TEXT NOT NULL DEFAULT 'en-IN',
    "phoneCountryCode" TEXT NOT NULL DEFAULT '+91',
    CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("websiteId")
);

CREATE TABLE "VersionSnapshot" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    CONSTRAINT "VersionSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChangeLogEntry" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChangeLogEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "code" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "productId" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomPage" (
    "websiteId" TEXT NOT NULL,
    "accent" TEXT NOT NULL DEFAULT '#6366f1',
    "font" TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    "sectionsJson" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomPage_pkey" PRIMARY KEY ("websiteId")
);

CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "windowStart" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Website_clientId_key" ON "Website"("clientId");
CREATE UNIQUE INDEX "Website_previewSlug_key" ON "Website"("previewSlug");
CREATE UNIQUE INDEX "Website_customDomain_key" ON "Website"("customDomain");
CREATE UNIQUE INDEX "SectionToggle_websiteId_key_key" ON "SectionToggle"("websiteId", "key");
CREATE UNIQUE INDEX "Catalogue_websiteId_key" ON "Catalogue"("websiteId");
CREATE INDEX "Client_agencyId_idx" ON "Client"("agencyId");
CREATE INDEX "User_clientId_idx" ON "User"("clientId");
CREATE INDEX "Website_publishStatus_idx" ON "Website"("publishStatus");
CREATE INDEX "Category_websiteId_idx" ON "Category"("websiteId");
CREATE INDEX "Product_websiteId_idx" ON "Product"("websiteId");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "MediaAsset_websiteId_idx" ON "MediaAsset"("websiteId");
CREATE INDEX "GalleryImage_websiteId_order_idx" ON "GalleryImage"("websiteId", "order");
CREATE INDEX "Offer_websiteId_startDate_idx" ON "Offer"("websiteId", "startDate");
CREATE INDEX "VersionSnapshot_websiteId_number_idx" ON "VersionSnapshot"("websiteId", "number");
CREATE INDEX "ChangeLogEntry_websiteId_createdAt_idx" ON "ChangeLogEntry"("websiteId", "createdAt");
CREATE INDEX "Discount_websiteId_idx" ON "Discount"("websiteId");
CREATE INDEX "Campaign_websiteId_idx" ON "Campaign"("websiteId");
CREATE INDEX "Enquiry_websiteId_createdAt_idx" ON "Enquiry"("websiteId", "createdAt");

ALTER TABLE "Client" ADD CONSTRAINT "Client_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Website" ADD CONSTRAINT "Website_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BrandSettings" ADD CONSTRAINT "BrandSettings_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HomepageContent" ADD CONSTRAINT "HomepageContent_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SectionToggle" ADD CONSTRAINT "SectionToggle_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Catalogue" ADD CONSTRAINT "Catalogue_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeoSettings" ADD CONSTRAINT "SeoSettings_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VersionSnapshot" ADD CONSTRAINT "VersionSnapshot_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChangeLogEntry" ADD CONSTRAINT "ChangeLogEntry_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomPage" ADD CONSTRAINT "CustomPage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
