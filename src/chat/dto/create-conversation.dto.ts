import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO para crear una conversación
 */
export class CreateConversationDto {
  @ApiProperty({ example: 1, description: 'ID del apadrinamiento' })
  @IsInt()
  @IsPositive()
  sponsorshipId: number;
}
