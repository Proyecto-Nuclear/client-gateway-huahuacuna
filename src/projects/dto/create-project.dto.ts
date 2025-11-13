import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Título del proyecto' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descripción del proyecto' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Objetivo del proyecto' })
  @IsString()
  @IsNotEmpty()
  objective: string;

  @ApiProperty({ description: 'Beneficiarios del proyecto' })
  @IsString()
  @IsNotEmpty()
  beneficiaries: string;

  @ApiProperty({ description: 'Fecha de inicio' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

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
