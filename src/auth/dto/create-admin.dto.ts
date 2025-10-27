import { IsEmail, IsString, MinLength, Matches, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin User', description: 'Nombre completo' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'admin@fundacion.org', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'AdminPass123', description: 'Contraseña' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @ApiProperty({ enum: AdminRole, example: 'ADMIN', description: 'Rol del administrador' })
  @IsEnum(AdminRole)
  role: AdminRole;
}
