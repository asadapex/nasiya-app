import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCreditDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  debtorId: number;

  @ApiProperty({ type: String, example: 'iPhone 14' })
  @IsString()
  product_name: string;

  @ApiProperty({ type: Number, example: 12, description: 'Duration in months' })
  @IsNumber()
  duration: number;

  @ApiProperty({ type: Number, example: 1000 })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ type: String, example: 'Some notes' })
  @IsString()
  notes: string;
}
