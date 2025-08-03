-- CreateEnum
CREATE TYPE "SmsStatus" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debtor" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credits" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "remaining_amount" DOUBLE PRECISION NOT NULL,
    "monthly_payment_amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "creditsId" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSchedules" (
    "id" SERIAL NOT NULL,
    "creditsId" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "expected_amount" DOUBLE PRECISION NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSchedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSTemplates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "template_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMSTemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationsLog" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message_text" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "status" "SmsStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneNumberDebters" (
    "id" SERIAL NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneNumberDebters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagesDebtors" (
    "id" SERIAL NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagesDebtors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debtor" ADD CONSTRAINT "Debtor_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credits" ADD CONSTRAINT "Credits_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_creditsId_fkey" FOREIGN KEY ("creditsId") REFERENCES "Credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSchedules" ADD CONSTRAINT "PaymentSchedules_creditsId_fkey" FOREIGN KEY ("creditsId") REFERENCES "Credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationsLog" ADD CONSTRAINT "NotificationsLog_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumberDebters" ADD CONSTRAINT "PhoneNumberDebters_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagesDebtors" ADD CONSTRAINT "ImagesDebtors_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
