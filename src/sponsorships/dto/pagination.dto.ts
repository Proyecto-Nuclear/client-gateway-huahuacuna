import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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

/**
 * DTO para consultar apadrinamientos de un padrino
 */
export class GetMySponsorshipsDto extends PaginationDto {
  @ApiProperty({
    required: false,
    example: false,
    default: false,
    description: 'Mostrar solo apadrinamientos activos',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  activeOnly?: boolean = false;
}
