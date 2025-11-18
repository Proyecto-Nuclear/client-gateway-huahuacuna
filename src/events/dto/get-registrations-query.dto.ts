import { IsOptional, IsInt, Min, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * DTO para obtener inscripciones de un evento
 */
export class GetRegistrationsQueryDto {
  @IsInt()
  @Type(() => Number)
  eventId: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  checkedIn?: boolean;

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
  orderBy?: 'registeredAt' | 'fullName';

  @IsString()
  @IsOptional()
  orderDirection?: 'asc' | 'desc';
}
