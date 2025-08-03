import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreditsService } from './credits.service';
import { AuthGuard } from 'src/common/guard/auth/auth.guard';
import { Request } from 'express';
import { CreateCreditDto } from 'src/common/dto/credit-dtos/create-credit.dto';
import { UpdateCreditDto } from 'src/common/dto/credit-dtos/update-credit.dto';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCreditDto: CreateCreditDto, @Req() req: Request) {
    return this.creditsService.create(createCreditDto, req);
  }

  @UseGuards(AuthGuard)
  @Get('credits-debtor')
  findAll(@Req() req: Request) {
    return this.creditsService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.creditsService.findOne(+id, req);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditDto: UpdateCreditDto,
    @Req() req: Request,
  ) {
    return this.creditsService.update(+id, updateCreditDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.creditsService.remove(+id, req);
  }
}
