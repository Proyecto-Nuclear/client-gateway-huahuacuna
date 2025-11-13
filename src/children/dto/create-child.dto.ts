import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export enum GenderDto {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * DTO para crear un niño
 * Solo SUPER_ADMIN y ADMIN pueden crear niños
 */
export class CreateChildDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del niño' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del niño' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '2015-05-20', description: 'Fecha de nacimiento (ISO 8601)' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: GenderDto, example: 'MALE', description: 'Género' })
  @IsEnum(GenderDto)
  gender: GenderDto;

  @ApiProperty({ example: 'Quechua', description: 'Etnia', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ethnicity?: string;

  @ApiProperty({
    example: 'Alergia al gluten',
    description: 'Condición especial (discapacidad, alergia, etc.)',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  specialCondition?: string;

  @ApiProperty({ example: 'Cusco', description: 'Municipio/Ciudad' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  municipality: string;

  @ApiProperty({ example: 'Av. Principal 123', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'URL de la foto principal',
    required: false
  })
  @IsOptional()
  @IsUrl()
  photo?: string;

  @ApiProperty({
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    description: 'URLs de fotos adicionales',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  photos?: string[];

  @ApiProperty({
    example: 'Niño alegre y juguetón que le gusta el fútbol',
    description: 'Descripción breve para tarjeta (max 200 caracteres)'
  })
  @IsString()
  @MaxLength(200)
  shortDescription: string;

  @ApiProperty({
    example: 'Juan vive con su abuela en una pequeña comunidad...',
    description: 'Historia completa del niño'
  })
  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  fullStory: string;

  @ApiProperty({
    example: ['Útiles escolares', 'Ropa', 'Alimentos'],
    description: 'Necesidades específicas del niño',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  needs: string[];
}
