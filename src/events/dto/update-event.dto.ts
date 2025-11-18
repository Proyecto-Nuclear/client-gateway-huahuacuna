import { IsString, IsDateString, IsInt, Min, IsOptional, IsArray, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../events.types';

/**
 * DTO para actualizar un evento
 */
export class UpdateEventDto {
  @ApiProperty({
    description: 'Título del evento',
    example: 'Festival Benéfico de Navidad 2024 - Actualizado',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Descripción detallada del evento',
    example: '<p>Descripción actualizada del festival benéfico.</p>',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Fecha y hora del evento',
    example: '2024-12-25T19:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @ApiProperty({
    description: 'Ubicación del evento',
    example: 'Centro Cultural Municipal, Calle Principal #123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Capacidad total del evento',
    example: 250,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'URL de la imagen de portada',
    example: 'https://example.com/images/festival-cover-updated.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Array de URLs de imágenes',
    example: ['https://example.com/images/gallery1.jpg'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Estado del evento',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({
    description: 'Meta descripción para SEO',
    example: 'Festival benéfico navideño actualizado',
    maxLength: 160,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({
    description: 'Palabras clave para SEO',
    example: ['festival', 'navidad', 'beneficencia'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  metaKeywords?: string[];

  @ApiProperty({
    description: 'ID del usuario que actualiza el evento',
    example: 1,
  })
  @IsInt()
  updatedBy: number;
}
