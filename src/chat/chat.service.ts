import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMessageDto, CreateConversationDto, PaginationDto } from './dto';

/**
 * Servicio de Chat para el Gateway
 *
 * Comunica con el microservicio apadrinamiento vía Kafka para gestionar
 * conversaciones y mensajes de chat.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('APADRINAMIENTO_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Crear conversación para un apadrinamiento
   */
  async createConversation(dto: CreateConversationDto, padrinoId: number) {
    this.logger.log(`Creating conversation for sponsorship: ${dto.sponsorshipId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_create_conversation', {
        sponsorshipId: dto.sponsorshipId,
        padrinoId,
      }),
    );
  }

  /**
   * Enviar mensaje en una conversación
   */
  async sendMessage(dto: SendMessageDto, senderId: number, senderRole: string) {
    this.logger.log(`Sending message in conversation: ${dto.conversationId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_send_message', {
        conversationId: dto.conversationId,
        senderId,
        content: dto.content,
        senderRole,
      }),
    );
  }

  /**
   * Obtener mensajes de una conversación
   */
  async getMessages(
    conversationId: number,
    userId: number,
    userRole: string,
    pagination: PaginationDto,
  ) {
    this.logger.log(`Getting messages for conversation: ${conversationId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_get_messages', {
        conversationId,
        userId,
        userRole,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }

  /**
   * Obtener mis conversaciones
   */
  async getMyConversations(userId: number, userRole: string, pagination: PaginationDto) {
    this.logger.log(`Getting conversations for user: ${userId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_get_my_conversations', {
        userId,
        userRole,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(conversationId: number, userId: number, userRole: string) {
    this.logger.log(`Marking messages as read in conversation: ${conversationId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_mark_as_read', {
        conversationId,
        userId,
        userRole,
      }),
    );
  }

  /**
   * Obtener conteo de mensajes no leídos
   */
  async getUnreadCount(userId: number, conversationId?: number) {
    this.logger.log(`Getting unread count for user: ${userId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_chat_get_unread_count', {
        userId,
        conversationId,
      }),
    );
  }
}
