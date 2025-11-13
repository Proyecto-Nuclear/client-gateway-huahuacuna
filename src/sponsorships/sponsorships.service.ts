import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateSponsorshipRequestDto,
  ApproveRequestDto,
  RejectRequestDto,
  CancelSponsorshipDto,
  PaginationDto,
  GetMySponsorshipsDto,
} from './dto';

/**
 * Servicio de Sponsorships
 *
 * Comunica con el microservicio apadrinamiento vía Kafka para gestionar
 * solicitudes de apadrinamiento y apadrinamientos activos.
 */
@Injectable()
export class SponsorshipsService {
  private readonly logger = new Logger(SponsorshipsService.name);

  constructor(
    @Inject('APADRINAMIENTO_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Crear solicitud de apadrinamiento
   */
  async createRequest(dto: CreateSponsorshipRequestDto, userId: number) {
    this.logger.log(`Creating sponsorship request for child: ${dto.childId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_create_request', {
        childId: dto.childId,
        userId,
        reason: dto.reason,
      }),
    );
  }

  /**
   * Aprobar solicitud de apadrinamiento
   */
  async approveRequest(dto: ApproveRequestDto, reviewerId: number) {
    this.logger.log(`Approving sponsorship request: ${dto.requestId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_approve_request', {
        requestId: dto.requestId,
        reviewerId,
      }),
    );
  }

  /**
   * Rechazar solicitud de apadrinamiento
   */
  async rejectRequest(dto: RejectRequestDto, reviewerId: number) {
    this.logger.log(`Rejecting sponsorship request: ${dto.requestId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_reject_request', {
        requestId: dto.requestId,
        reviewerId,
        rejectionReason: dto.rejectionReason,
      }),
    );
  }

  /**
   * Obtener solicitudes pendientes
   */
  async getPendingRequests(pagination: PaginationDto) {
    this.logger.log('Getting pending sponsorship requests');
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_get_pending_requests', {
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }

  /**
   * Obtener apadrinamientos del padrino autenticado
   */
  async getMySponsorships(padrinoId: number, query: GetMySponsorshipsDto) {
    this.logger.log(`Getting sponsorships for padrino: ${padrinoId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_get_my_sponsorships', {
        padrinoId,
        page: query.page,
        limit: query.limit,
        activeOnly: query.activeOnly,
      }),
    );
  }

  /**
   * Obtener detalles de un apadrinamiento
   */
  async getSponsorshipDetails(sponsorshipId: number, userId: number, userRole: string) {
    this.logger.log(`Getting sponsorship details: ${sponsorshipId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_get_details', {
        sponsorshipId,
        userId,
        userRole,
      }),
    );
  }

  /**
   * Cancelar apadrinamiento
   */
  async cancelSponsorship(
    sponsorshipId: number,
    dto: CancelSponsorshipDto,
    userId: number,
    userRole: string,
  ) {
    this.logger.log(`Cancelling sponsorship: ${sponsorshipId}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_cancel', {
        sponsorshipId,
        userId,
        userRole,
        cancellationReason: dto.cancellationReason,
      }),
    );
  }

  /**
   * Obtener historial de apadrinamientos (admin)
   */
  async getSponsorshipHistory(pagination: PaginationDto) {
    this.logger.log('Getting sponsorship history');
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_sponsorships_get_history', {
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }
}
