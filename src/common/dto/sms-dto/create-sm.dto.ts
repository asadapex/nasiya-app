import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSmDto {
  @ApiProperty({ type: String, example: 'Qarzdorlik haqida ogohlantirish' })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Hurmatli Mijoz, Qarzdorlik boyicha ogohlantirish',
  })
  @IsString()
  template_text: string;
}
