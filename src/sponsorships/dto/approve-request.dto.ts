import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO para aprobar una solicitud de apadrinamiento
 */
export class ApproveRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la solicitud a aprobar',
  })
  @IsInt()
  @IsPositive()
  requestId: number;
}
