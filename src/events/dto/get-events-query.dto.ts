import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../events.types';

/**
 * DTO para obtener lista de eventos (Admin)
 */
export class GetEventsQueryDto {
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

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
  orderBy?: 'createdAt' | 'publishedAt' | 'eventDate' | 'viewCount';

  @IsString()
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
