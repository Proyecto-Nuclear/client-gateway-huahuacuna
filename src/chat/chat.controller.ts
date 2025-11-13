import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto, CreateConversationDto, PaginationDto } from './dto';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/auth/jwt-payload.interface';

/**
 * Controlador de Chat
 *
 * Gestiona todas las operaciones relacionadas con conversaciones y mensajes
 * a través del API Gateway.
 */
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Crear conversación para un apadrinamiento
   *
   * Permite a un padrino crear una conversación para uno de sus apadrinamientos.
   * Solo se puede crear una conversación por apadrinamiento.
   */
  @Post('conversations')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_create_conversation',
    isProtected: true,
    roles: [Role.PADRINO],
  })
  @ApiOperation({ summary: 'Crear conversación' })
  @ApiResponse({ status: 201, description: 'Conversación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Ya existe una conversación para este apadrinamiento' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Apadrinamiento no encontrado' })
  async createConversation(
    @Body() dto: CreateConversationDto,
    @CurrentUser('sub') padrinoId: number,
  ) {
    return await this.chatService.createConversation(dto, padrinoId);
  }

  /**
   * Obtener mis conversaciones
   *
   * Lista todas las conversaciones del usuario autenticado.
   * Los padrinos ven solo sus conversaciones, los admins ven todas.
   */
  @Get('conversations')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_get_my_conversations',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener mis conversaciones' })
  @ApiResponse({ status: 200, description: 'Lista de conversaciones' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getMyConversations(
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.chatService.getMyConversations(userId, userRole, pagination);
  }

  /**
   * Obtener mensajes de una conversación
   *
   * Lista todos los mensajes de una conversación con paginación.
   * Los padrinos solo pueden ver mensajes de sus propias conversaciones.
   * Marca automáticamente los mensajes como entregados.
   */
  @Get('conversations/:conversationId/messages')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_get_messages',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener mensajes de conversación' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Conversación no encontrada' })
  async getMessages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.chatService.getMessages(
      conversationId,
      userId,
      userRole,
      pagination,
    );
  }

  /**
   * Enviar mensaje
   *
   * Envía un mensaje en una conversación existente.
   * Los padrinos solo pueden enviar en sus propias conversaciones.
   * Los admins pueden enviar en cualquier conversación.
   */
  @Post('messages')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_send_message',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Enviar mensaje' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Conversación no encontrada' })
  async sendMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser('sub') senderId: number,
    @CurrentUser('role') senderRole: string,
  ) {
    return await this.chatService.sendMessage(dto, senderId, senderRole);
  }

  /**
   * Marcar mensajes como leídos
   *
   * Marca todos los mensajes no leídos de una conversación como leídos.
   * Solo marca los mensajes que no son del usuario actual.
   */
  @Post('conversations/:conversationId/read')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_mark_as_read',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Marcar mensajes como leídos' })
  @ApiResponse({ status: 200, description: 'Mensajes marcados como leídos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Conversación no encontrada' })
  async markAsRead(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return await this.chatService.markAsRead(conversationId, userId, userRole);
  }

  /**
   * Obtener conteo de mensajes no leídos
   *
   * Obtiene el número total de mensajes no leídos del usuario.
   * Útil para mostrar badges de notificación.
   */
  @Get('unread-count')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_chat_get_unread_count',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener conteo de mensajes no leídos' })
  @ApiResponse({ status: 200, description: 'Conteo de mensajes no leídos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getUnreadCount(@CurrentUser('sub') userId: number) {
    return await this.chatService.getUnreadCount(userId);
  }
}
