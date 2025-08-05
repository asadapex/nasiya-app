import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { AuthGuard } from 'src/common/guard/auth/auth.guard';
import { Request } from 'express';
import { SellerLoginDto } from 'src/common/dto/seller-dtos/seller-login';
import { CreateDebtorDto } from 'src/common/dto/seller-dtos/create-debtor.dto';
import { UpdateDebtorDto } from 'src/common/dto/seller-dtos/update-debtor.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('login-seller')
  loginSeller(@Body() data: SellerLoginDto) {
    return this.sellerService.loginSeller(data);
  }

  @UseGuards(AuthGuard)
  @Post('create-debtor')
  createDebtor(@Body() data: CreateDebtorDto, @Req() req: Request) {
    return this.sellerService.createDebtor(data, req);
  }

  @UseGuards(AuthGuard)
  @Get('my-debtors')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Ali' })
  getMyDebtors(@Req() req: Request, @Query() query: any) {
    return this.sellerService.getMyDebtors(req, query);
  }

  @UseGuards(AuthGuard)
  @Patch('update-debtor/:id')
  updateDebtor(@Body() data: UpdateDebtorDto, @Param('id') id: number) {
    return this.sellerService.updateDebtor(data, id);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-debtor/:id')
  deleteDebtor(@Param('id') id: number) {
    return this.sellerService.deleteDebtor(id);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.sellerService.getProfile(req);
  }
}
