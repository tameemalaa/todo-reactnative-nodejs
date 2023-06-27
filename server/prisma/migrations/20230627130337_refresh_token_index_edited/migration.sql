-- DropIndex
DROP INDEX "idx_userId_RefreshToken";

-- CreateIndex
CREATE INDEX "idx_refreshToken" ON "RefreshToken" USING HASH ("token");
