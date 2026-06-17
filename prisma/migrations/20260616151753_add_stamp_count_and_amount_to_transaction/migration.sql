-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amount" DECIMAL(10,2),
ADD COLUMN     "stampCount" INTEGER NOT NULL DEFAULT 1;
