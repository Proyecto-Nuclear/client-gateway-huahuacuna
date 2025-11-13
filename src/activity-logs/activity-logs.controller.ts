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
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto, PaginationDto } from './dto';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/auth/jwt-payload.interface';

/**
 * Controlador de Bitácora de Actividades
 *
 * Gestiona todas las operaciones relacionadas con registros de actividad
 * del sistema a través del API Gateway.
 */
@ApiTags('Activity Logs')
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  /**
   * Crear registro de actividad
   *
   * Permite a un administrador crear un nuevo registro en la bitácora.
   * Registra eventos importantes del sistema.
   */
  @Post()
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_activity_logs_create',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Crear registro de actividad' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async create(
    @Body() dto: CreateActivityLogDto,
    @CurrentUser('sub') userId: number,
  ) {
    return await this.activityLogsService.create(dto, userId);
  }

  /**
   * Obtener actividades recientes del sistema
   *
   * Lista las actividades más recientes registradas en el sistema.
   * Solo accesible por administradores.
   */
  @Get('recent')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_activity_logs_get_recent',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener actividades recientes' })
  @ApiResponse({ status: 200, description: 'Lista de actividades recientes' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getRecent(@Query() pagination: PaginationDto) {
    return await this.activityLogsService.getRecent(pagination);
  }

  /**
   * Obtener actividades de un niño
   *
   * Lista todas las actividades registradas para un niño específico.
   * Útil para ver el historial completo del niño.
   */
  @Get('child/:childId')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_activity_logs_get_by_child',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener actividades de un niño' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del niño' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Niño no encontrado' })
  async getByChild(
    @Param('childId', ParseIntPipe) childId: number,
    @Query() pagination: PaginationDto,
  ) {
    return await this.activityLogsService.getByChild(childId, pagination);
  }

  /**
   * Obtener actividades de un apadrinamiento
   *
   * Lista todas las actividades registradas para un apadrinamiento específico.
   * Los padrinos solo pueden ver actividades de sus propios apadrinamientos.
   * Los administradores pueden ver actividades de cualquier apadrinamiento.
   */
  @Get('sponsorship/:sponsorshipId')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_activity_logs_get_by_sponsorship',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.PADRINO],
  })
  @ApiOperation({ summary: 'Obtener actividades de un apadrinamiento' })
  @ApiResponse({ status: 200, description: 'Lista de actividades del apadrinamiento' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Apadrinamiento no encontrado' })
  async getBySponsorship(
    @Param('sponsorshipId', ParseIntPipe) sponsorshipId: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') userRole: string,
    @Query() pagination: PaginationDto,
  ) {
    return await this.activityLogsService.getBySponsorship(
      sponsorshipId,
      userId,
      userRole,
      pagination,
    );
  }
}
