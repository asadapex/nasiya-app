/*
  Warnings:

  - You are about to drop the column `debtorId` on the `PhoneNumberDebters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhoneNumberDebters" DROP CONSTRAINT "PhoneNumberDebters_debtorId_fkey";

-- AlterTable
ALTER TABLE "PhoneNumberDebters" DROP COLUMN "debtorId";

-- CreateTable
CREATE TABLE "_DebtorToPhoneNumberDebters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtorToPhoneNumberDebters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DebtorToPhoneNumberDebters_B_index" ON "_DebtorToPhoneNumberDebters"("B");

-- AddForeignKey
ALTER TABLE "_DebtorToPhoneNumberDebters" ADD CONSTRAINT "_DebtorToPhoneNumberDebters_A_fkey" FOREIGN KEY ("A") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtorToPhoneNumberDebters" ADD CONSTRAINT "_DebtorToPhoneNumberDebters_B_fkey" FOREIGN KEY ("B") REFERENCES "PhoneNumberDebters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
