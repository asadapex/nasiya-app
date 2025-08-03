import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ type: String, example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: 'John' })
  @IsString()
  login: string;

  @ApiProperty({ type: String, example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  @IsOptional()
  pin?: string;
}
