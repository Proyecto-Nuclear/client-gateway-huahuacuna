import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: '+51987654321', description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'Av. Principal 123, Lima', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL de foto de perfil', required: false })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
