/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropIndex
DROP INDEX "Comment_authorId_idx";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- DropIndex
DROP INDEX "Post_authorId_idx";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "postCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_postId_postCreatedAt_createdAt_idx" ON "Comment"("postId", "postCreatedAt", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Comment_authorId_createdAt_idx" ON "Comment"("authorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_authorId_createdAt_idx" ON "Post"("authorId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_postCreatedAt_fkey" FOREIGN KEY ("postId", "postCreatedAt") REFERENCES "Post"("id", "createdAt") ON DELETE CASCADE ON UPDATE CASCADE;
