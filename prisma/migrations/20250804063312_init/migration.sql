/*
  Warnings:

  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'BARELY_PAID');

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_creditsId_fkey";

-- AlterTable
ALTER TABLE "PaymentSchedules" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "Payments";
