import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { PayCreditByAmountDto } from 'src/common/dto/service-dtos/pay-credit-byamount.dto';
import { PayCreditByMonthDto } from 'src/common/dto/service-dtos/pay-credit-bymonths.dto';
import { TopUpBalanceDto } from 'src/common/dto/service-dtos/topup-balance.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async topup(data: TopUpBalanceDto) {
    try {
      const one = await this.prisma.seller.findUnique({
        where: { id: data.id },
      });

      if (!one) {
        throw new NotFoundException({ message: 'Seller not found' });
      }

      await this.prisma.seller.update({
        where: { id: data.id },
        data: { balance: { increment: data.amount } },
      });

      return { message: 'Balance updated' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async payCreditByMonth(data: PayCreditByMonthDto, req: Request) {
    try {
      const one = await this.prisma.credits.findUnique({
        where: { id: data.creditId, sellerId: req['user-id'] },
      });

      if (!one) {
        throw new NotFoundException({ message: 'Credit not found' });
      }

      const schedulesToDelete = await this.prisma.paymentSchedules.findMany({
        where: { creditsId: data.creditId },
        orderBy: { due_date: 'asc' },
        take: data.months,
      });

      const scheduleIds = schedulesToDelete.map((s) => s.id);

      await this.prisma.$transaction([
        this.prisma.credits.update({
          where: { id: data.creditId },
          data: {
            duration: { decrement: data.months },
            remaining_amount: {
              decrement: one.monthly_payment_amount * data.months,
            },
          },
        }),

        this.prisma.paymentSchedules.updateMany({
          where: {
            id: { in: scheduleIds },
          },
          data: {
            status: PaymentStatus.PAID,
          },
        }),
      ]);

      return { message: `Credit paid for ${data.months} month(s)` };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async payCreditByAmount(data: PayCreditByAmountDto, req: Request) {
    try {
      const credit = await this.prisma.credits.findUnique({
        where: { id: data.creditId, sellerId: req['user-id'] },
      });

      if (!credit) {
        throw new NotFoundException({ message: 'Credit not found' });
      }

      const monthlyAmount = credit.monthly_payment_amount;

      if (data.amount < monthlyAmount) {
        const nextSchedule = await this.prisma.paymentSchedules.findFirst({
          where: {
            creditsId: data.creditId,
            status: PaymentStatus.PENDING,
          },
          orderBy: { due_date: 'asc' },
        });

        if (nextSchedule) {
          await this.prisma.$transaction([
            this.prisma.credits.update({
              where: { id: data.creditId },
              data: {
                remaining_amount: {
                  decrement: data.amount,
                },
              },
            }),
            this.prisma.paymentSchedules.update({
              where: { id: nextSchedule.id },
              data: {
                status: PaymentStatus.BARELY_PAID,
                expected_amount: {
                  decrement: data.amount,
                },
              },
            }),
          ]);
        }

        return {
          message: 'Qisman tolov amalga oshirildi',
          paidAmount: data.amount,
          monthsPaid: 0,
        };
      }

      const fullMonths = Math.floor(data.amount / monthlyAmount);
      const totalToDecrement = fullMonths * monthlyAmount;

      const schedulesToDelete = await this.prisma.paymentSchedules.findMany({
        where: { creditsId: data.creditId },
        orderBy: { due_date: 'asc' },
        take: fullMonths,
      });

      const scheduleIds = schedulesToDelete.map((s) => s.id);

      await this.prisma.$transaction([
        this.prisma.credits.update({
          where: { id: data.creditId },
          data: {
            duration: { decrement: fullMonths },
            remaining_amount: {
              decrement: totalToDecrement,
            },
          },
        }),
        this.prisma.paymentSchedules.updateMany({
          where: { id: { in: scheduleIds } },
          data: {
            status: PaymentStatus.PAID,
          },
        }),
      ]);

      return {
        message: 'Tolov muvaffaqiyatli amalga oshirildi',
        paidAmount: totalToDecrement,
        monthsPaid: fullMonths,
        remainder: data.amount - totalToDecrement,
      };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
