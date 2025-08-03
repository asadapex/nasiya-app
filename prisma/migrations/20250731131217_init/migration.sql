/*
  Warnings:

  - A unique constraint covering the columns `[creditsId,due_date]` on the table `PaymentSchedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentSchedules_creditsId_due_date_key" ON "PaymentSchedules"("creditsId", "due_date");
