import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO para crear una solicitud de apadrinamiento
 */
export class CreateSponsorshipRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID del niño que se desea apadrinar',
  })
  @IsInt()
  @IsPositive()
  childId: number;

  @ApiProperty({
    example: 'Deseo apadrinar a este niño porque me identifico con su historia y quiero ayudarle a tener un mejor futuro',
    description: 'Razón por la que desea apadrinar al niño',
  })
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  reason: string;
}
