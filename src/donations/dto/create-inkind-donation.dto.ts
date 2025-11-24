import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInKindDonationDto {
  @ApiProperty({
    description: 'Nombre completo del donante',
    example: 'María González López',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  donorName: string;

  @ApiProperty({
    description: 'Correo electrónico del donante',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  donorEmail: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del donante',
    example: '+57 310 987 6543',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  donorPhone?: string;

  @ApiProperty({
    description: 'Descripción detallada de los artículos a donar',
    example: '10 juguetes didácticos, 5 pelotas de fútbol, 20 cuadernos',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Valor estimado de la donación en centavos COP (ej: 50000 = $500 COP)',
    example: 50000,
    minimum: 0,
    type: Number,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  estimatedValue?: number;

  @ApiPropertyOptional({
    description: 'Mensaje personal del donante',
    example: 'Espero que estos artículos sean de utilidad para los niños',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;
}
