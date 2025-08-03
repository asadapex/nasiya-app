import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PayCreditByAmountDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  creditId: number;

  @ApiProperty({ type: Number, example: 10000 })
  @IsNumber()
  amount: number;
}
