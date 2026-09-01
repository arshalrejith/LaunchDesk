-- CreateTable
CREATE TABLE "CustomPage" (
    "websiteId" TEXT NOT NULL PRIMARY KEY,
    "accent" TEXT NOT NULL DEFAULT '#6366f1',
    "font" TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    "sectionsJson" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomPage_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
