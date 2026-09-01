-- AlterTable
ALTER TABLE "HomepageContent" ADD COLUMN "primaryCtaType" TEXT;
ALTER TABLE "HomepageContent" ADD COLUMN "primaryCtaValue" TEXT;
ALTER TABLE "HomepageContent" ADD COLUMN "secondaryCtaType" TEXT;
ALTER TABLE "HomepageContent" ADD COLUMN "secondaryCtaValue" TEXT;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN "ctaType" TEXT;
ALTER TABLE "Offer" ADD COLUMN "ctaValue" TEXT;
