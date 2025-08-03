/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_login_key" ON "Seller"("login");
