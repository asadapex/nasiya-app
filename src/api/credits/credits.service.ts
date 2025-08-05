import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { Request } from 'express';
import { UserRole } from 'src/common/enums/user-roles';
import { CreateCreditDto } from 'src/common/dto/credit-dtos/create-credit.dto';
import { UpdateCreditDto } from 'src/common/dto/credit-dtos/update-credit.dto';

@Injectable()
export class CreditsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCreditDto, req: Request) {
    try {
      const newCredit = await this.prisma.credits.create({
        data: {
          sellerId: req['user-id'],
          debtorId: data.debtorId,
          product_name: data.product_name,
          duration: data.duration,
          total_amount: data.total_amount,
          notes: data.notes,
          issue_date: new Date(),
          monthly_payment_amount: data.total_amount / data.duration,
          remaining_amount: data.total_amount,
        },
        include: {
          debtor: true,
        },
      });

      for (let i = 0; i < data.duration; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);

        await this.prisma.paymentSchedules.create({
          data: {
            creditsId: newCredit.id,
            expected_amount: newCredit.monthly_payment_amount,
            due_date: dueDate,
          },
        });
      }

      return newCredit;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(req: Request) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'desc',
        product_name,
        debtorId,
      } = req.query as any;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (req['user-role'] !== UserRole.ADMIN) {
        where.sellerId = req['user-id'];
      }

      if (product_name) {
        where.product_name = { contains: product_name, mode: 'insensitive' };
      }

      if (debtorId) {
        where.debtorId = Number(debtorId);
      }

      const [data, total] = await Promise.all([
        this.prisma.credits.findMany({
          where,
          skip: Number(skip),
          take: Number(limit),
          orderBy: {
            [sortBy]: sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc',
          },
          include: {
            debtor: true,
            PaymentSchedules: true,
          },
        }),
        this.prisma.credits.count({ where }),
      ]);

      return {
        data,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number, req: Request) {
    try {
      if (req['user-role'] !== UserRole.ADMIN) {
        const credit = await this.prisma.credits.findUnique({
          where: { id, sellerId: req['user-id'] },
          include: { debtor: true },
        });

        if (!credit) {
          throw new NotFoundException({ message: 'Credit not found' });
        }

        return credit;
      }

      const credit = await this.prisma.credits.findUnique({
        where: { id },
        include: { debtor: true },
      });

      if (!credit) {
        throw new NotFoundException({ message: 'Credit not found' });
      }

      return credit;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateCreditDto: UpdateCreditDto, req: Request) {
    try {
      if (req['user-role'] !== UserRole.ADMIN) {
        const existing = await this.prisma.credits.findUnique({
          where: { id, sellerId: req['user-id'] },
        });

        if (!existing) {
          throw new NotFoundException({ message: 'Credit not found' });
        }

        const updated = await this.prisma.credits.update({
          where: { id },
          data: updateCreditDto,
          include: { debtor: true },
        });
        return updated;
      }

      const existing = await this.prisma.credits.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException({ message: 'Credit not found' });
      }

      const updated = await this.prisma.credits.update({
        where: { id },
        data: updateCreditDto,
        include: { debtor: true },
      });

      return updated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, req: Request) {
    try {
      if (req['user-role'] !== UserRole.ADMIN) {
        const existing = await this.prisma.credits.findUnique({
          where: { sellerId: req['user-id'], id },
        });
        if (!existing) {
          throw new NotFoundException({ message: 'Credit not found' });
        }
        await this.prisma.credits.delete({ where: { id } });
        return { message: 'Credit successfully deleted' };
      }

      const existing = await this.prisma.credits.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException({ message: 'Credit not found' });
      }

      await this.prisma.credits.delete({ where: { id } });
      return { message: 'Credit successfully deleted' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
