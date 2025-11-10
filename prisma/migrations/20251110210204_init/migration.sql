-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "source" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "code" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsItem_url_key" ON "NewsItem"("url");

-- CreateIndex
CREATE INDEX "NewsItem_source_publishedAt_idx" ON "NewsItem"("source", "publishedAt");

-- CreateIndex
CREATE INDEX "NewsItem_code_idx" ON "NewsItem"("code");
