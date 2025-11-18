import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DonationsService {
  constructor(
    @Inject('DONACIONES_SERVICE')
    private readonly donacionesClient: ClientKafka,
  ) {}

  async createMonetary(data: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_monetary', data),
    );
  }

  async createInKind(data: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_inkind', data),
    );
  }

  async getAllDonations(query: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_all', query),
    );
  }

  async getUserDonations(userId: number, query: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_user_donations', {
        userId,
        ...query,
      }),
    );
  }

  async approveDonation(id: number, approvedBy: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_approve', { id, approvedBy }),
    );
  }
}
