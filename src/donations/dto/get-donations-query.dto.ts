import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { DonationStatus, DonationType } from './donation.enums';

export class GetDonationsQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado de la donación',
    enum: DonationStatus,
    example: DonationStatus.APPROVED,
  })
  @IsEnum(DonationStatus)
  @IsOptional()
  status?: DonationStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de donación',
    enum: DonationType,
    example: DonationType.MONETARY,
  })
  @IsEnum(DonationType)
  @IsOptional()
  type?: DonationType;

  @ApiPropertyOptional({
    description: 'Número de registros a omitir (para paginación)',
    example: 0,
    minimum: 0,
    type: Number,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({
    description: 'Número de registros a obtener (para paginación)',
    example: 10,
    minimum: 1,
    type: Number,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  take?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar los resultados',
    example: 'createdAt',
    enum: ['createdAt', 'amount'],
  })
  @IsString()
  @IsIn(['createdAt', 'amount'])
  @IsOptional()
  orderBy?: 'createdAt' | 'amount';

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
