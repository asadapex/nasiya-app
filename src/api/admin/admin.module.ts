import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenGeneratorService } from 'src/config/TokenGenerate/token-generator';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'apex',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, TokenGeneratorService],
})
export class AdminModule {}
