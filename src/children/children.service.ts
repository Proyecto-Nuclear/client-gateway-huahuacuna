import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateChildDto,
  UpdateChildDto,
  FilterChildrenDto,
  PaginationDto,
} from './dto';

/**
 * Children Service
 * Comunica con el microservicio apadrinamiento via Kafka
 */
@Injectable()
export class ChildrenService {
  private readonly logger = new Logger(ChildrenService.name);

  constructor(
    @Inject('APADRINAMIENTO_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * RF-006: Crear nuevo niño (solo SUPER_ADMIN y ADMIN)
   */
  async create(dto: CreateChildDto, userId: number) {
    this.logger.log(`Creating child: ${dto.firstName} ${dto.lastName}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_create', {
        dto,
        userId,
      }),
    );
  }

  /**
   * RF-006: Obtener niños disponibles (público)
   * Máximo 12 niños por página
   */
  async getAvailable(pagination: PaginationDto) {
    this.logger.log(`Getting available children (page: ${pagination.page})`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_get_available', pagination),
    );
  }

  /**
   * RF-007: Filtrar niños por edad, género, municipio
   */
  async filter(filters: FilterChildrenDto) {
    this.logger.log('Filtering children');
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_filter', filters),
    );
  }

  /**
   * Obtener todos los niños (solo ADMIN y SUPER_ADMIN)
   */
  async getAll(pagination: PaginationDto) {
    this.logger.log(`Getting all children (page: ${pagination.page})`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_get_all', pagination),
    );
  }

  /**
   * Obtener niño por ID (público)
   */
  async getById(id: number) {
    this.logger.log(`Getting child by ID: ${id}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_get_by_id', { id }),
    );
  }

  /**
   * Actualizar niño (solo SUPER_ADMIN y ADMIN)
   */
  async update(id: number, dto: UpdateChildDto) {
    this.logger.log(`Updating child: ${id}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_update', {
        id,
        dto,
      }),
    );
  }

  /**
   * Eliminar niño (solo SUPER_ADMIN y ADMIN)
   */
  async delete(id: number) {
    this.logger.log(`Deleting child: ${id}`);
    return await firstValueFrom(
      this.kafkaClient.send('apadrinamiento_children_delete', { id }),
    );
  }
}
