import { IsString, IsNotEmpty, IsDateString, IsInt, Min, IsOptional, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear un nuevo evento
 */
export class CreateEventDto {
  @ApiProperty({
    description: 'Título del evento',
    example: 'Festival Benéfico de Navidad 2024',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del evento (soporta HTML)',
    example: '<p>Únete a nuestro festival benéfico donde recaudaremos fondos para los niños de la comunidad.</p>',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Fecha y hora del evento (ISO 8601)',
    example: '2024-12-25T18:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @ApiProperty({
    description: 'Ubicación del evento',
    example: 'Centro Cultural Municipal, Calle Principal #123',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;

  @ApiProperty({
    description: 'Capacidad total del evento',
    example: 200,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'URL de la imagen de portada',
    example: 'https://example.com/images/festival-cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Array de URLs de imágenes adicionales',
    example: ['https://example.com/images/gallery1.jpg', 'https://example.com/images/gallery2.jpg'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Meta descripción para SEO',
    example: 'Festival benéfico navideño para recaudar fondos para niños',
    maxLength: 160,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({
    description: 'Palabras clave para SEO',
    example: ['festival', 'navidad', 'beneficencia', 'niños'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  metaKeywords?: string[];

  @ApiProperty({
    description: 'ID del usuario administrador que crea el evento',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  createdBy: number;
}
