import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { PrismaModule } from 'src/common/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CreditsController],
  providers: [CreditsService],
})
export class CreditsModule {}
