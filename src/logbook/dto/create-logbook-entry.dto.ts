import { IsString, IsInt, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogbookEntryDto {
  @ApiProperty({ description: 'ID del niño', example: 1 })
  @IsInt()
  childId: number;

  @ApiPropertyOptional({ description: 'Escuela del niño', example: 'Escuela Primaria ABC' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  school?: string;

  @ApiPropertyOptional({ description: 'Grado escolar', example: '3ro' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  grade?: string;

  @ApiPropertyOptional({ description: 'Título de la entrada', example: 'Progreso académico' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Descripción de la entrada (máx 500 caracteres)',
    example: 'El niño ha mostrado gran mejora en matemáticas este mes.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}
