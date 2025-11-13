import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Tipos de actividad disponibles
 */
export enum ActivityType {
  SPONSORSHIP_STARTED = 'SPONSORSHIP_STARTED',
  SPONSORSHIP_ENDED = 'SPONSORSHIP_ENDED',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  CHILD_UPDATE = 'CHILD_UPDATE',
  DONATION = 'DONATION',
  MILESTONE = 'MILESTONE',
}

/**
 * DTO para crear un registro de actividad
 */
export class CreateActivityLogDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  childId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  sponsorshipId?: number;

  @ApiProperty({ enum: ActivityType, example: ActivityType.CHILD_UPDATE })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty({ example: 'Actualización de información académica' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'Se actualizó la información del rendimiento académico del niño.',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    required: false,
    example: { grade: '5to', average: 18.5 },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
