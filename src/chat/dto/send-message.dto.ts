import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO para enviar un mensaje
 */
export class SendMessageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  conversationId: number;

  @ApiProperty({
    example: 'Hola, ¿cómo está el niño? Me gustaría saber sobre su progreso escolar.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}
