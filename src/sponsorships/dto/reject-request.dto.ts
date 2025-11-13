import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO para rechazar una solicitud de apadrinamiento
 */
export class RejectRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la solicitud a rechazar',
  })
  @IsInt()
  @IsPositive()
  requestId: number;

  @ApiProperty({
    example: 'El padrino no cumple con los requisitos necesarios',
    description: 'Razón del rechazo',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  rejectionReason: string;
}
