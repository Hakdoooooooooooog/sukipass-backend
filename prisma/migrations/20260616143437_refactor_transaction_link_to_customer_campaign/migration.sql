/*
  Warnings:

  - You are about to drop the column `campaignId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `customerCampaignId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_customerId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "campaignId",
DROP COLUMN "customerId",
ADD COLUMN     "customerCampaignId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerCampaignId_fkey" FOREIGN KEY ("customerCampaignId") REFERENCES "CustomerCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
