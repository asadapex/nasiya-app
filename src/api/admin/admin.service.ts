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
import { CreateAdminDto } from 'src/common/dto/admin-dtos/create-admin.dto';
import { AdminLoginDto } from 'src/common/dto/admin-dtos/admin-login';
import { SellerCreateDto } from 'src/common/dto/admin-dtos/seller-create.dto';
import { UserRole } from 'src/common/enums/user-roles';
import { TokenGeneratorService } from 'src/config/TokenGenerate/token-generator';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly tokenGenerator: TokenGeneratorService,
  ) {}

  async findAdmin(login: string) {
    const one = await this.prisma.admin.findUnique({ where: { login } });
    return one;
  }

  async create(data: CreateAdminDto) {
    try {
      const one = await this.findAdmin(data.login);
      if (one) {
        throw new BadRequestException({ message: 'Admin already exists' });
      }
      const { password } = data;
      const hash = await BcryptEncryption.encrypt(password);
      const newAdmin = await this.prisma.admin.create({
        data: { ...data, password: hash },
      });
      return newAdmin;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async login(data: AdminLoginDto) {
    try {
      const one = await this.findAdmin(data.login);
      if (!one) {
        throw new NotFoundException({ message: 'Admin not found' });
      }

      const isPasswordCorrect = await BcryptEncryption.compare(
        data.password,
        one.password,
      );
      if (!isPasswordCorrect) {
        throw new BadRequestException({ message: 'Wrong credentials' });
      }
      const token = this.tokenGenerator.generateToken(one.id, UserRole.ADMIN);
      return { token };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createSeller(data: SellerCreateDto) {
    try {
      const one = await this.prisma.seller.findUnique({
        where: { login: data.login },
      });
      if (one) {
        throw new BadRequestException({ message: 'Seller already exists' });
      }
      const { password } = data;
      const hash = await BcryptEncryption.encrypt(password);
      const newSeller = await this.prisma.seller.create({
        data: { ...data, password: hash },
      });
      return newSeller;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getProfile(req: Request) {
    try {
      const one = await this.prisma.admin.findUnique({
        where: { id: req['user-id'] },
        omit: { password: true },
      });
      return { ...one, role: 'ADMIN' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
