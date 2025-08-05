import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';
import { TokenGeneratorService } from 'src/config/TokenGenerate/token-generator';

@Module({
  imports: [PrismaModule],
  controllers: [SellerController],
  providers: [SellerService, TokenGeneratorService],
})
export class SellerModule {}
