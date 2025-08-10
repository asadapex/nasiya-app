import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ type: String, example: 'admin' })
  @IsString()
  login: string;

  @ApiProperty({ type: String, example: 'admin123' })
  @IsString()
  password: string;
}
