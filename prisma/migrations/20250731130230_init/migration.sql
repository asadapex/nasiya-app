/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Credits` table. All the data in the column will be lost.
  - Added the required column `debtorId` to the `Credits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credits" DROP CONSTRAINT "Credits_sellerId_fkey";

-- AlterTable
ALTER TABLE "Credits" DROP COLUMN "sellerId",
ADD COLUMN     "debtorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
