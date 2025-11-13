import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateActivityLogDto, PaginationDto, ActivityType } from './dto';

/**
 * Servicio de Bitácora de Actividades para el Gateway
 *
 * Comunica con el microservicio apadrinamiento vía Kafka para gestionar
 * registros de actividad del sistema.
 */
@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @Inject('APADRINAMIENTO_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Crear registro de actividad
   */
  async create(dto: CreateActivityLogDto, performedBy?: number) {
    this.logger.log(`Creating activity log: ${dto.type}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_activity_logs_create', {
        childId: dto.childId,
        sponsorshipId: dto.sponsorshipId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        metadata: dto.metadata,
        performedBy,
      }),
    );
  }

  /**
   * Obtener actividades de un niño
   */
  async getByChild(childId: number, pagination: PaginationDto) {
    this.logger.log(`Getting activity logs for child: ${childId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_activity_logs_get_by_child', {
        childId,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }

  /**
   * Obtener actividades de un apadrinamiento
   */
  async getBySponsorship(
    sponsorshipId: number,
    userId: number,
    userRole: string,
    pagination: PaginationDto,
  ) {
    this.logger.log(`Getting activity logs for sponsorship: ${sponsorshipId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_activity_logs_get_by_sponsorship', {
        sponsorshipId,
        userId,
        userRole,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }

  /**
   * Obtener actividades recientes
   */
  async getRecent(pagination: PaginationDto, type?: ActivityType) {
    this.logger.log('Getting recent activity logs');
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_activity_logs_get_recent', {
        page: pagination.page,
        limit: pagination.limit,
        type,
      }),
    );
  }
}
