-- AlterEnum
ALTER TYPE "public"."ActivityType" ADD VALUE 'ISSUE_ASSIGNED';

-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX "Issue_assignedToId_idx" ON "public"."Issue"("assignedToId");

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
