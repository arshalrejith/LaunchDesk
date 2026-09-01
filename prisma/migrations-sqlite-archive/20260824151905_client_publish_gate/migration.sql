-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Website" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL DEFAULT 'premium-boutique-01',
    "publishStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "previewSlug" TEXT NOT NULL,
    "customDomain" TEXT,
    "lastPublishedAt" DATETIME,
    "currentVersionId" TEXT,
    "clientPublishEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Website_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Website" ("clientId", "createdAt", "currentVersionId", "customDomain", "id", "lastPublishedAt", "previewSlug", "publishStatus", "templateId", "updatedAt") SELECT "clientId", "createdAt", "currentVersionId", "customDomain", "id", "lastPublishedAt", "previewSlug", "publishStatus", "templateId", "updatedAt" FROM "Website";
DROP TABLE "Website";
ALTER TABLE "new_Website" RENAME TO "Website";
CREATE UNIQUE INDEX "Website_clientId_key" ON "Website"("clientId");
CREATE UNIQUE INDEX "Website_previewSlug_key" ON "Website"("previewSlug");
CREATE UNIQUE INDEX "Website_customDomain_key" ON "Website"("customDomain");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
