import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
