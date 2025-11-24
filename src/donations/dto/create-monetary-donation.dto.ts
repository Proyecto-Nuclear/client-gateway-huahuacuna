import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateMonetaryDonationDto {
  @ApiProperty({
    description: 'Monto de la donación en centavos COP (ej: 1000000 = $10.000 COP)',
    example: 5000000,
    minimum: 1000000,
    type: Number,
  })
  @IsInt()
  @Min(1000000, { message: 'El monto mínimo es $10.000 COP (1000000 centavos)' })
  amount: number;

  @ApiProperty({
    description: 'Nombre completo del donante',
    example: 'Juan Pérez García',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  donorName: string;

  @ApiProperty({
    description: 'Correo electrónico del donante',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  donorEmail: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del donante',
    example: '+57 300 123 4567',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  donorPhone?: string;

  @ApiPropertyOptional({
    description: 'Tipo de documento del donante (CC, NIT, CE, etc.)',
    example: 'CC',
  })
  @IsString()
  @IsOptional()
  donorDocumentType?: string;

  @ApiPropertyOptional({
    description: 'Número de documento del donante (para certificado tributario)',
    example: '12345678',
  })
  @IsString()
  @IsOptional()
  donorDocument?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario registrado (si aplica)',
    example: 123,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  donorUserId?: number;

  @ApiPropertyOptional({
    description: 'ID del proyecto específico al que se destina la donación',
    example: 5,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  projectId?: number;

  @ApiPropertyOptional({
    description: 'Nombre del proyecto al que se destina la donación',
    example: 'Construcción de aulas escolares',
  })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiPropertyOptional({
    description: 'Mensaje personal del donante',
    example: 'Quiero contribuir con la educación de los niños',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;

  @ApiPropertyOptional({
    description: 'Indica si la donación es anónima',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
