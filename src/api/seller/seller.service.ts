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
