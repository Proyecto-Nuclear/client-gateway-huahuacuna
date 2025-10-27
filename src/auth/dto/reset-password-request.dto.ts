import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email registrado' })
  @IsEmail()
  email: string;
}
