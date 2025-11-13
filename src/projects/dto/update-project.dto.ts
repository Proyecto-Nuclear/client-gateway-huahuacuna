import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Título del proyecto' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Objetivo del proyecto' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Beneficiarios del proyecto' })
  @IsString()
  @IsOptional()
  beneficiaries?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de finalización' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'URL de imagen de portada' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'URLs de imágenes adicionales' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ description: 'Meta descripción para SEO', maxLength: 160 })
  @IsString()
  @MaxLength(160)
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Palabras clave para SEO' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  metaKeywords?: string[];
}
