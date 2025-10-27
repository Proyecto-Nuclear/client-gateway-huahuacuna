import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123...', description: 'Token de verificación' })
  @IsString()
  token: string;
}
