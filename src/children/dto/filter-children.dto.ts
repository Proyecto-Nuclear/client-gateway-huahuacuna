import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { GenderDto } from './create-child.dto';

/**
 * DTO para filtrar niños (RF-007)
 * Filtros aplicables: rango de edad, género (M/F), municipio
 */
export class FilterChildrenDto {
  @ApiProperty({ enum: GenderDto, required: false, description: 'Filtrar por género' })
  @IsOptional()
  @IsEnum(GenderDto)
  gender?: GenderDto;

  @ApiProperty({ required: false, example: 5, description: 'Edad mínima' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(18)
  @Type(() => Number)
  minAge?: number;

  @ApiProperty({ required: false, example: 12, description: 'Edad máxima' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(18)
  @Type(() => Number)
  maxAge?: number;

  @ApiProperty({ required: false, example: 'Cusco', description: 'Filtrar por municipio' })
  @IsOptional()
  @IsString()
  municipality?: string;

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
