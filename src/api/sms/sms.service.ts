import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSmDto } from '../../common/dto/sms-dto/create-sm.dto';
import { UpdateSmDto } from '../../common/dto/sms-dto/update-sm.dto';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSmDto) {
    const newSms = await this.prisma.sMSTemplates.create({ data });
    return newSms;
  }

  async findAll() {
    return await this.prisma.sMSTemplates.findMany();
  }

  async findOne(id: number) {
    const one = await this.prisma.sMSTemplates.findUnique({ where: { id } });
    if (!one) {
      throw new NotFoundException({ message: 'SM not found' });
    }
    return one;
  }

  async update(id: number, updateSmDto: UpdateSmDto) {
    const one = await this.prisma.sMSTemplates.findUnique({ where: { id } });
    if (!one) {
      throw new NotFoundException({ message: 'SM not found' });
    }
    return await this.prisma.sMSTemplates.update({
      where: { id },
      data: updateSmDto,
    });
  }

  async remove(id: number) {
    const one = await this.prisma.sMSTemplates.findUnique({ where: { id } });
    if (!one) {
      throw new NotFoundException({ message: 'SM not found' });
    }
    return await this.prisma.sMSTemplates.delete({ where: { id } });
  }
}
