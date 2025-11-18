import { IsOptional, IsInt, Min, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * DTO para obtener eventos publicados (Público)
 */
export class GetPublishedEventsQueryDto {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  skip?: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  take?: number;

  @IsString()
  @IsOptional()
  orderBy?: 'publishedAt' | 'eventDate' | 'viewCount';

  @IsString()
  @IsOptional()
  orderDirection?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isUpcoming?: boolean; // true = próximos, false = pasados
}
