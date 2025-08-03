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
import { generateToken } from 'src/config/TokenGenerate/token-generator';
import { UserRole } from 'src/common/enums/user-roles';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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

      if (one.pin !== data.pin) {
        throw new BadRequestException({ message: 'Wrong pin' });
      }

      const token = generateToken(one.id, UserRole.SELLER);
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

  async getMyDebtors(req: Request) {
    try {
      const debtors = await this.prisma.debtor.findMany({
        where: { sellerId: req['user-id'] },
        include: {
          PhoneNumberDebters: {
            select: {
              id: true,
              phone_number: true,
            },
          },
        },
      });
      return debtors;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
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
        omit: { password: true, pin: true },
      });
      return { ...one, role: 'SELLER' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
