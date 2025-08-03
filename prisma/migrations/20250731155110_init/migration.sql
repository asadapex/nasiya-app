/*
  Warnings:

  - Added the required column `sellerId` to the `Credits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credits" ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
