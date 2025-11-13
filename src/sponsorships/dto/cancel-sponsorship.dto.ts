import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO para cancelar un apadrinamiento
 */
export class CancelSponsorshipDto {
  @ApiProperty({
    example: 'El padrino ya no puede continuar con el apadrinamiento por motivos personales',
    description: 'Razón de la cancelación',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  cancellationReason: string;
}
