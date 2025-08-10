/*
  Warnings:

  - You are about to drop the column `pin` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "pin";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "pin";
