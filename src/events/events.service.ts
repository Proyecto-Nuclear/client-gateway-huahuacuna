import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(
    @Inject('SERVICIOS_SERVICE')
    private readonly serviciosClient: ClientKafka,
  ) {}

  async create(createEventDto: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_create', createEventDto),
    );
  }

  async update(id: number, updateEventDto: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_update', {
        id,
        data: updateEventDto,
      }),
    );
  }

  async publish(id: number) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_publish', {
        id,
        updatedBy: 1,
      }),
    );
  }

  async delete(id: number) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_delete', { id }),
    );
  }

  async getAllAdmin(query: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_get_all', query),
    );
  }

  async getPublished(query: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_get_published', query),
    );
  }

  async getDetail(slug: string) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_get_detail', { slug }),
    );
  }

  async register(registerDto: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_register', registerDto),
    );
  }

  async getRegistrations(eventId: number, query: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_get_registrations', {
        ...query,
        eventId,
      }),
    );
  }

  async checkIn(id: number, checkInDto: any) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_check_in', {
        id,
        data: checkInDto,
      }),
    );
  }

  async getStatistics(eventId: number) {
    return await lastValueFrom(
      this.serviciosClient.send('servicios_events_get_statistics', {
        eventId,
      }),
    );
  }
}
