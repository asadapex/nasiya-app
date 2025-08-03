import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateDebtorDto {
  @ApiProperty({ type: [String], example: ['passport img', 'id img'] })
  @IsString()
  @IsArray()
  images?: string[];

  @ApiProperty({ type: String, example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ type: [String], example: ['+998901234567'] })
  @IsString()
  @IsArray()
  phone_number: string[];

  @ApiProperty({ type: String, example: "A. Navoiy ko'chasi 12A" })
  @IsString()
  address: string;

  @ApiProperty({ type: String, example: 'Additional info' })
  @IsString()
  info: string;
}
