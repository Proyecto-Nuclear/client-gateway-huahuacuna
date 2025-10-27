import { IsEmail, IsString, MinLength, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Contraseña (mínimo 8 caracteres, con mayúsculas, minúsculas y números)' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @ApiProperty({ example: '+51987654321', description: 'Teléfono' })
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: '12345678', description: 'Documento de identidad' })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  documentId: string;

  @ApiProperty({ example: 'Av. Principal 123, Lima', description: 'Dirección' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;
}
