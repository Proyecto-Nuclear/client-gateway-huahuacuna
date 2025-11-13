import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para parámetros de paginación
 */
export class PaginationDto {
  @ApiProperty({ required: false, example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, example: 12, default: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 12;
}
