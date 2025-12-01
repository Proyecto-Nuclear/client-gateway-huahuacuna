import { IsInt, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetEntriesQueryDto {
  @ApiPropertyOptional({ description: 'Número de entradas a saltar', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Número de entradas a retornar', example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  take?: number = 20;

  @ApiPropertyOptional({ description: 'Fecha de inicio (ISO)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin (ISO)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
