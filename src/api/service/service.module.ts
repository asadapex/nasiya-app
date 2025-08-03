import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
