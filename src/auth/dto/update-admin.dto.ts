import { IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class UpdateAdminDto {
  @ApiProperty({ example: 'Admin User Updated', description: 'Nombre completo', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ enum: UserStatus, example: 'ACTIVE', description: 'Estado del usuario', required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
