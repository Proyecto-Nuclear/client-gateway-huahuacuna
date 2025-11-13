import { IsOptional, IsInt, Min, IsEnum, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Número de página', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Elementos por página', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class GetProjectsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Estado del proyecto',
    enum: ['DRAFT', 'PUBLISHED', 'FINISHED', 'ARCHIVED'],
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'FINISHED', 'ARCHIVED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'FINISHED' | 'ARCHIVED';

  @ApiPropertyOptional({
    description: 'Campo para ordenar',
    enum: ['createdAt', 'publishedAt', 'startDate', 'viewCount'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'publishedAt', 'startDate', 'viewCount'])
  orderBy?: 'createdAt' | 'publishedAt' | 'startDate' | 'viewCount';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';
}

export class GetPublishedProjectsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Campo para ordenar',
    enum: ['publishedAt', 'startDate', 'viewCount'],
    default: 'publishedAt',
  })
  @IsOptional()
  @IsEnum(['publishedAt', 'startDate', 'viewCount'])
  orderBy?: 'publishedAt' | 'startDate' | 'viewCount';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Término de búsqueda' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Filtrar solo proyectos en curso' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOngoing?: boolean;
}

export class GetVolunteersQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de proyecto' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({ description: 'Filtrar por estado de contacto' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  contacted?: boolean;

  @ApiPropertyOptional({
    description: 'Campo para ordenar',
    enum: ['registeredAt', 'fullName'],
    default: 'registeredAt',
  })
  @IsOptional()
  @IsEnum(['registeredAt', 'fullName'])
  orderBy?: 'registeredAt' | 'fullName';

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';
}
