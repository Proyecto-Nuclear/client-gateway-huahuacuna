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
import { SponsorshipsService } from './sponsorships.service';
import {
  CreateSponsorshipRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
  CancelSponsorshipDto,
  PaginationDto,
  GetMySponsorshipsDto,
} from './dto';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/auth/jwt-payload.interface';

/**
 * Controlador de Apadrinamientos
 *
 * Gestiona todas las operaciones relacionadas con solicitudes de apadrinamiento
 * y apadrinamientos activos a través del API Gateway.
 */
@ApiTags('Sponsorships')
@Controller('sponsorships')
export class SponsorshipsController {
  constructor(private readonly sponsorshipsService: SponsorshipsService) {}

  /**
   * Crear solicitud de apadrinamiento
   *
   * Permite a un padrino crear una solicitud para apadrinar a un niño.
   * El niño debe estar disponible y no tener solicitudes pendientes.
   */
  @Post('requests')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_create_request',
    isProtected: true,
    roles: [Role.PADRINO],
  })
  @ApiOperation({ summary: 'Crear solicitud de apadrinamiento' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  @ApiResponse({ status: 400, description: 'El niño no está disponible' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async createRequest(
    @Body() dto: CreateSponsorshipRequestDto,
    @CurrentUser('sub') userId: number,
  ) {
    return await this.sponsorshipsService.createRequest(dto, userId);
  }

  /**
   * Aprobar solicitud de apadrinamiento
   *
   * Permite a un administrador aprobar una solicitud pendiente.
   * Al aprobar, se crea un apadrinamiento activo y el niño pasa a estado SPONSORED.
   */
  @Post('requests/approve')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_approve_request',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Aprobar solicitud de apadrinamiento' })
  @ApiResponse({ status: 200, description: 'Solicitud aprobada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solicitud no válida' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async approveRequest(
    @Body() dto: ApproveRequestDto,
    @CurrentUser('sub') reviewerId: number,
  ) {
    return await this.sponsorshipsService.approveRequest(dto, reviewerId);
  }

  /**
   * Rechazar solicitud de apadrinamiento
   *
   * Permite a un administrador rechazar una solicitud pendiente con una razón.
   * El niño vuelve a estado AVAILABLE.
   */
  @Post('requests/reject')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_reject_request',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Rechazar solicitud de apadrinamiento' })
  @ApiResponse({ status: 200, description: 'Solicitud rechazada exitosamente' })
  @ApiResponse({ status: 400, description: 'Solicitud no válida' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async rejectRequest(
    @Body() dto: RejectRequestDto,
    @CurrentUser('sub') reviewerId: number,
  ) {
    return await this.sponsorshipsService.rejectRequest(dto, reviewerId);
  }

  /**
   * Obtener solicitudes pendientes
   *
   * Lista todas las solicitudes de apadrinamiento que están pendientes de revisión.
   * Solo accesible por administradores.
   */
  @Get('requests/pending')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_get_pending_requests',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener solicitudes pendientes' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes pendientes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getPendingRequests(@Query() pagination: PaginationDto) {
    return await this.sponsorshipsService.getPendingRequests(pagination);
  }

  /**
   * Obtener mis apadrinamientos
   *
   * Permite a un padrino ver todos sus apadrinamientos.
   * Opcionalmente puede filtrar solo los activos.
   */
  @Get('my')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_get_my_sponsorships',
    isProtected: true,
    roles: [Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener mis apadrinamientos' })
  @ApiResponse({ status: 200, description: 'Lista de apadrinamientos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getMySponsorships(
    @CurrentUser('sub') padrinoId: number,
    @Query() query: GetMySponsorshipsDto,
  ) {
    return await this.sponsorshipsService.getMySponsorships(padrinoId, query);
  }

  /**
   * Obtener historial de apadrinamientos
   *
   * Lista todos los apadrinamientos (activos, cancelados y completados).
   * Solo accesible por administradores.
   */
  @Get('history')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_get_history',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener historial de apadrinamientos' })
  @ApiResponse({ status: 200, description: 'Historial completo de apadrinamientos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getSponsorshipHistory(@Query() pagination: PaginationDto) {
    return await this.sponsorshipsService.getSponsorshipHistory(pagination);
  }

  /**
   * Obtener detalles de un apadrinamiento
   *
   * Permite ver los detalles completos de un apadrinamiento específico.
   * Los padrinos solo pueden ver sus propios apadrinamientos.
   * Los administradores pueden ver cualquier apadrinamiento.
   */
  @Get(':id')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_get_details',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener detalles de apadrinamiento' })
  @ApiResponse({ status: 200, description: 'Detalles del apadrinamiento' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Apadrinamiento no encontrado' })
  async getSponsorshipDetails(
    @Param('id', ParseIntPipe) sponsorshipId: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return await this.sponsorshipsService.getSponsorshipDetails(
      sponsorshipId,
      userId,
      userRole,
    );
  }

  /**
   * Cancelar apadrinamiento
   *
   * Permite cancelar un apadrinamiento activo.
   * Los padrinos pueden cancelar sus propios apadrinamientos.
   * Los administradores pueden cancelar cualquier apadrinamiento.
   * El niño vuelve a estado AVAILABLE.
   */
  @Post(':id/cancel')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_sponsorships_cancel',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Cancelar apadrinamiento' })
  @ApiResponse({ status: 200, description: 'Apadrinamiento cancelado exitosamente' })
  @ApiResponse({ status: 400, description: 'Apadrinamiento no válido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Apadrinamiento no encontrado' })
  async cancelSponsorship(
    @Param('id', ParseIntPipe) sponsorshipId: number,
    @Body() dto: CancelSponsorshipDto,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
  ) {
    return await this.sponsorshipsService.cancelSponsorship(
      sponsorshipId,
      dto,
      userId,
      userRole,
    );
  }
}
