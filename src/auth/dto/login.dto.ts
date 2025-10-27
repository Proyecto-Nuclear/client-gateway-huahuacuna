import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Contraseña' })
  @IsString()
  password: string;
}
