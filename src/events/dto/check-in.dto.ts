import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para hacer check-in de una inscripción
 */
export class CheckInDto {
  @ApiProperty({
    description: 'ID del usuario administrador que realiza el check-in',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  checkedInBy: number;
}
