import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ServiceModule } from './service/service.module';
import { MulterModule } from './multer/multer.module';
import { SellerModule } from './seller/seller.module';
import { CreditsModule } from './credits/credits.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [AdminModule, ServiceModule, MulterModule, SellerModule, CreditsModule, SmsModule],
  controllers: [],
})
export class AppModule {}
