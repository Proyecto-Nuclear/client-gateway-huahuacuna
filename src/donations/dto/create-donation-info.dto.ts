import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationInfoDto {
  @ApiProperty({ description: 'Título de la sección de donaciones' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Descripción general' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Importancia de las donaciones' })
  @IsString()
  @IsNotEmpty()
  importance: string;

  @ApiProperty({ description: 'Destino de las donaciones' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ description: 'Modalidades de donación' })
  @IsString()
  @IsNotEmpty()
  modalities: string;

  @ApiProperty({ description: 'Título del Call-to-Action' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  ctaTitle: string;

  @ApiProperty({ description: 'Descripción del Call-to-Action' })
  @IsString()
  @IsNotEmpty()
  ctaDescription: string;

  @ApiProperty({ description: 'Texto del botón CTA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ctaButtonText: string;

  @ApiProperty({ description: 'Lista de artículos necesarios', required: false })
  @IsArray()
  @IsOptional()
  neededItems?: string[];

  @ApiProperty({ description: 'Dirección de contacto', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  contactAddress?: string;

  @ApiProperty({ description: 'Teléfono de contacto', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  contactPhone?: string;

  @ApiProperty({ description: 'Email de contacto', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contactEmail?: string;

  @ApiProperty({ description: 'Información de horarios', required: false })
  @IsString()
  @IsOptional()
  scheduleInfo?: string;
}
