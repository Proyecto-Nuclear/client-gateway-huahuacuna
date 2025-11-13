import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterVolunteerDto {
  @ApiProperty({ description: 'Nombre completo del voluntario' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email del voluntario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Teléfono del voluntario' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Habilidades del voluntario' })
  @IsString()
  @IsNotEmpty()
  skills: string;

  @ApiProperty({ description: 'Disponibilidad del voluntario' })
  @IsString()
  @IsNotEmpty()
  availability: string;

  @ApiPropertyOptional({ description: 'Mensaje adicional del voluntario' })
  @IsString()
  @IsOptional()
  message?: string;
}

export class MarkVolunteerContactedDto {
  @ApiPropertyOptional({ description: 'Notas del contacto' })
  @IsString()
  @IsOptional()
  notes?: string;
}
