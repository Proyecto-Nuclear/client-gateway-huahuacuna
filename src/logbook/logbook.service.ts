import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';
import { GetEntriesQueryDto } from './dto/get-entries-query.dto';

@Injectable()
export class LogbookService {
  constructor(
    @Inject('APADRINAMIENTO_SERVICE')
    private readonly apadrinamientoClient: ClientKafka,
  ) {}

  async createEntry(data: CreateLogbookEntryDto, createdBy: number) {
    return await lastValueFrom(
      this.apadrinamientoClient.send('apadrinamiento_logbook_create_entry', {
        ...data,
        createdBy,
      }),
    );
  }

  async getEntries(childId: number, query: GetEntriesQueryDto) {
    return await lastValueFrom(
      this.apadrinamientoClient.send('apadrinamiento_logbook_get_entries', {
        childId,
        ...query,
      }),
    );
  }

  async generatePdf(childId: number) {
    return await lastValueFrom(
      this.apadrinamientoClient.send('apadrinamiento_logbook_generate_pdf', { childId }),
    );
  }

  async getStatistics(childId: number) {
    return await lastValueFrom(
      this.apadrinamientoClient.send('apadrinamiento_logbook_get_statistics', { childId }),
    );
  }
}
