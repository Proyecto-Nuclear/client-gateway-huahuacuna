import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para paginación
 */
export class PaginationDto {
  @ApiProperty({ required: false, example: 1, default: 1, description: 'Página actual' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    required: false,
    example: 12,
    default: 12,
    description: 'Número de resultados por página (máx 12)'
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  limit?: number = 12;
}
