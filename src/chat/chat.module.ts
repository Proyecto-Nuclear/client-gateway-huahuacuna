import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

/**
 * Módulo de Chat
 *
 * Gestiona todas las operaciones relacionadas con conversaciones y mensajes,
 * comunicándose con el microservicio apadrinamiento.
 */
@Module({
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
