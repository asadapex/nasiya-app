import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'apex',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
