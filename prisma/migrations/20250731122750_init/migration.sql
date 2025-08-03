/*
  Warnings:

  - You are about to drop the `PhoneNumberDebtorsItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PhoneNumberDebtorsItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `debtorId` to the `PhoneNumberDebters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PhoneNumberDebtorsItems" DROP CONSTRAINT "PhoneNumberDebtorsItems_debtorId_fkey";

-- DropForeignKey
ALTER TABLE "PhoneNumberDebtorsItems" DROP CONSTRAINT "PhoneNumberDebtorsItems_phoneNumberDebtersId_fkey";

-- DropForeignKey
ALTER TABLE "_PhoneNumberDebtorsItems" DROP CONSTRAINT "_PhoneNumberDebtorsItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_PhoneNumberDebtorsItems" DROP CONSTRAINT "_PhoneNumberDebtorsItems_B_fkey";

-- AlterTable
ALTER TABLE "PhoneNumberDebters" ADD COLUMN     "debtorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PhoneNumberDebtorsItems";

-- DropTable
DROP TABLE "_PhoneNumberDebtorsItems";

-- AddForeignKey
ALTER TABLE "PhoneNumberDebters" ADD CONSTRAINT "PhoneNumberDebters_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
