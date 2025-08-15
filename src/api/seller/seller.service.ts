import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { BcryptEncryption } from 'src/infrastructure/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CreateDebtorDto } from 'src/common/dto/seller-dtos/create-debtor.dto';
import { UpdateDebtorDto } from 'src/common/dto/seller-dtos/update-debtor.dto';
import { SellerLoginDto } from 'src/common/dto/seller-dtos/seller-login';
import { UserRole } from 'src/common/enums/user-roles';
import { TokenGeneratorService } from 'src/config/TokenGenerate/token-generator';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly tokenGenerator: TokenGeneratorService,
  ) {}

  async loginSeller(data: SellerLoginDto) {
    try {
      const one = await this.prisma.seller.findUnique({
        where: { login: data.login },
      });
      if (!one) {
        throw new NotFoundException({ message: 'Seller not found' });
      }
      const isPasswordCorrect = await BcryptEncryption.compare(
        data.password,
        one.password,
      );
      if (!isPasswordCorrect) {
        throw new BadRequestException({ message: 'Wrong credentials' });
      }

      const token = this.tokenGenerator.generateToken(one.id, UserRole.SELLER);
      return { token };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createDebtor(data: CreateDebtorDto, req: Request) {
    try {
      const newDebtor = await this.prisma.debtor.create({
        data: {
          ImagesDebtors: {
            create: data.images?.map((img) => ({ image: img })),
          },
          name: data.name,
          address: data.address,
          info: data.info,
          sellerId: req['user-id'],
          PhoneNumberDebters: {
            create: data.phone_number.map((num) => ({ phone_number: num })),
          },
        },
        include: {
          PhoneNumberDebters: true,
        },
      });

      return newDebtor;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getMyDebtors(req: Request, query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
      } = query;
  
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);
  
      const where: any = {
        sellerId: req['user-id'],
      };
  
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { info: { contains: search, mode: 'insensitive' } },
        ];
      }
  
      const [total, debtors] = await this.prisma.$transaction([
        this.prisma.debtor.count({ where }),
        this.prisma.debtor.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            PhoneNumberDebters: {
              select: {
                id: true,
                phone_number: true,
              },
            },
            Credits: {
              select: {
                remaining_amount: true,
              },
            },
          },
        }),
      ]);
  
      const debtorsWithTotal = debtors.map(debtor => ({
        ...debtor,
        totalDebt: debtor.Credits.reduce(
          (sum, credit) => sum + credit.remaining_amount,
          0
        ),
      }));
  
      return {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        data: debtorsWithTotal,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getMyDebtor(req: Request, id: number) {
    try {
      const debtor = await this.prisma.debtor.findFirst({
        where: { id, sellerId: Number(req['user-id']) },
        include: {
          PhoneNumberDebters: true,
          ImagesDebtors: true,
          seller: true,
          Credits: {
            include: {
              PaymentSchedules: true,
            },
          },
        },
      });
  
      if (!debtor) {
        throw new NotFoundException({ message: 'Debtor not found' });
      }
  
      const result = {
        id: debtor.id.toString(),
        name: debtor.name,
        address: debtor.address,
        sellerId: debtor.sellerId.toString(),
        note: debtor.info || null,
        star: false, // Prisma modelda star yo‘q, default false
        createdAt: debtor.createdAt.toISOString(),
        updatedAt: debtor.updatedAt.toISOString(),
        Debt: debtor.Credits.map((credit) => ({
          id: credit.id.toString(),
          productName: credit.product_name,
          date: credit.issue_date.toISOString(),
          term: credit.duration,
          note: credit.notes || null,
          amount: credit.total_amount,
          debtorId: credit.debtorId.toString(),
          sellerId: credit.sellerId.toString(),
          createdAt: credit.createdAt.toISOString(),
          updatedAt: credit.updatedAt.toISOString(),
          Payment: credit.PaymentSchedules.map((p) => ({
            id: p.id.toString(),
            debtId: p.creditsId.toString(),
            amount: p.expected_amount,
            month: p.due_date.getMonth() + 1,
            date: p.due_date.toISOString(),
            isActive: p.status === 'PENDING',
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
          nextPayment: credit.PaymentSchedules[0]
            ? {
                id: credit.PaymentSchedules[0].id.toString(),
                debtId: credit.PaymentSchedules[0].creditsId.toString(),
                amount: credit.PaymentSchedules[0].expected_amount,
                month: credit.PaymentSchedules[0].due_date.getMonth() + 1,
                date: credit.PaymentSchedules[0].due_date.toISOString(),
                isActive: credit.PaymentSchedules[0].status === 'PENDING',
                createdAt: credit.PaymentSchedules[0].createdAt.toISOString(),
                updatedAt: credit.PaymentSchedules[0].updatedAt.toISOString(),
              }
            : null,
          totalPayments: credit.PaymentSchedules.length,
        })),
        ImgOfDebtor: debtor.ImagesDebtors.map((img) => ({
          id: img.id.toString(),
          name: img.image,
          debtorId: img.debtorId.toString(),
          createdAt: img.createdAt.toISOString(),
          updatedAt: img.updatedAt.toISOString(),
        })),
        Phone: debtor.PhoneNumberDebters.map((p) => ({
          id: p.id.toString(),
          phoneNumber: p.phone_number,
          debtorId: p.debtorId.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })),
        Seller: {
          id: debtor.seller.id.toString(),
          fullName: debtor.seller.name,
          phoneNumber: '',
          email: '',
          img: debtor.seller.image || '',
          wallet: debtor.seller.balance,
          login: debtor.seller.login,
          password: debtor.seller.password,
          status: '',
          refreshToken: '',
          createdAt: debtor.seller.createdAt.toISOString(),
          updatedAt: debtor.seller.updatedAt.toISOString(),
        },
        totalAmount: debtor.Credits.reduce(
          (acc, credit) => acc + credit.total_amount,
          0
        ),
      };
  
      return result;
    } catch (error) {
      console.error(error);
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
  
  

  async updateDebtor(data: UpdateDebtorDto, id: number) {
    try {
      const existing = await this.prisma.debtor.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException({ message: 'Debtor not found' });
      }

      if (data.phone_number) {
        await this.prisma.$transaction([
          this.prisma.phoneNumberDebters.deleteMany({
            where: { debtorId: id },
          }),

          ...data.phone_number.map((number) =>
            this.prisma.phoneNumberDebters.create({
              data: {
                phone_number: number,
                debtorId: id,
              },
            }),
          ),
        ]);
      }

      const { phone_number, ...debtorData } = data;

      const updated = await this.prisma.debtor.update({
        where: { id },
        data: debtorData,
      });

      return updated;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteDebtor(id: number) {
    try {
      const existing = await this.prisma.debtor.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException({ message: 'Debtor not found' });
      }

      await this.prisma.$transaction([
        this.prisma.phoneNumberDebters.deleteMany({
          where: { debtorId: id },
        }),
        this.prisma.imagesDebtors.deleteMany({
          where: { debtorId: id },
        }),
        this.prisma.debtor.delete({
          where: { id },
        }),
      ]);

      return { message: 'Debtor deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getProfile(req: Request) {
    try {
      const one = await this.prisma.seller.findUnique({
        where: { id: req['user-id'] },
        omit: { password: true },
      });

      const debtorCount = await this.prisma.debtor.count({
        where: {
          sellerId: req['user-id'],
        },
      })

      const allCredits = await this.prisma.credits.findMany({
        where: {
          sellerId: req['user-id'],
        },
      })
      return { ...one, role: 'SELLER', debtorCount, creditSum: allCredits.reduce((acc, curr) => acc + curr.total_amount, 0) };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
