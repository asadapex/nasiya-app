import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/common/guard/auth/auth.guard';
import { RoleGuard } from 'src/common/guard/admin/admin.guard';
import { Roles } from 'src/common/decorator/role-decorator';
import { UserRole } from 'src/common/enums/user-roles';
import { Request } from 'express';
import { CreateAdminDto } from 'src/common/dto/admin-dtos/create-admin.dto';
import { AdminLoginDto } from 'src/common/dto/admin-dtos/admin-login';
import { SellerCreateDto } from 'src/common/dto/admin-dtos/seller-create.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('admin-register')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('admin-login')
  login(@Body() data: AdminLoginDto) {
    return this.adminService.login(data);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('create-seller')
  createSeller(@Body() data: SellerCreateDto) {
    return this.adminService.createSeller(data);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.adminService.getProfile(req);
  }
}
