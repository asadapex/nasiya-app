/*
  Warnings:

  - You are about to drop the `_DebtorToPhoneNumberDebters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DebtorToPhoneNumberDebters" DROP CONSTRAINT "_DebtorToPhoneNumberDebters_A_fkey";

-- DropForeignKey
ALTER TABLE "_DebtorToPhoneNumberDebters" DROP CONSTRAINT "_DebtorToPhoneNumberDebters_B_fkey";

-- DropTable
DROP TABLE "_DebtorToPhoneNumberDebters";

-- CreateTable
CREATE TABLE "PhoneNumberDebtorsItems" (
    "id" SERIAL NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "phoneNumberDebtersId" INTEGER NOT NULL,

    CONSTRAINT "PhoneNumberDebtorsItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhoneNumberDebtorsItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PhoneNumberDebtorsItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PhoneNumberDebtorsItems_B_index" ON "_PhoneNumberDebtorsItems"("B");

-- AddForeignKey
ALTER TABLE "PhoneNumberDebtorsItems" ADD CONSTRAINT "PhoneNumberDebtorsItems_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumberDebtorsItems" ADD CONSTRAINT "PhoneNumberDebtorsItems_phoneNumberDebtersId_fkey" FOREIGN KEY ("phoneNumberDebtersId") REFERENCES "PhoneNumberDebters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhoneNumberDebtorsItems" ADD CONSTRAINT "_PhoneNumberDebtorsItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhoneNumberDebtorsItems" ADD CONSTRAINT "_PhoneNumberDebtorsItems_B_fkey" FOREIGN KEY ("B") REFERENCES "PhoneNumberDebters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
