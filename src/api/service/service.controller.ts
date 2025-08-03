import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ServiceService } from './service.service';
import { TopUpBalanceDto } from 'src/common/dto/service-dtos/topup-balance.dto';
import { AuthGuard } from 'src/common/guard/auth/auth.guard';
import { RoleGuard } from 'src/common/guard/admin/admin.guard';
import { Roles } from 'src/common/decorator/role-decorator';
import { UserRole } from 'src/common/enums/user-roles';
import { PayCreditByMonthDto } from 'src/common/dto/service-dtos/pay-credit-bymonths.dto';
import { Request } from 'express';
import { PayCreditByAmountDto } from 'src/common/dto/service-dtos/pay-credit-byamount.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('topup-balance')
  topup(@Body() data: TopUpBalanceDto) {
    return this.serviceService.topup(data);
  }

  @UseGuards(AuthGuard)
  @UseGuards()
  @Post('pay-credit-bymonths')
  payCreditByMonth(@Body() data: PayCreditByMonthDto, @Req() req: Request) {
    return this.serviceService.payCreditByMonth(data, req);
  }

  @UseGuards(AuthGuard)
  @UseGuards()
  @Post('pay-credit-byamount')
  payCreditByAmount(@Body() data: PayCreditByAmountDto) {
    return this.serviceService.payCreditByAmount(data);
  }
}
