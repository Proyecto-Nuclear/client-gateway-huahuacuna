import { IsString, IsNotEmpty, IsEmail, IsInt, Min, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para inscribirse a un evento
 */
export class RegisterToEventDto {
  @ApiProperty({
    description: 'ID del evento al que se desea inscribir',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    description: 'Nombre completo del participante',
    example: 'Juan Pérez García',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    description: 'Correo electrónico del participante',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+51 987654321',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'Número de acompañantes',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  numberOfCompanions: number;

  @ApiProperty({
    description: 'Mensaje o comentario adicional',
    example: 'Tengo una alergia alimentaria',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;
}
