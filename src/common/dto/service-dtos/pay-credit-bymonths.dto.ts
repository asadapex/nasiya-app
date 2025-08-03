import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PayCreditByMonthDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  creditId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  months: number;
}
