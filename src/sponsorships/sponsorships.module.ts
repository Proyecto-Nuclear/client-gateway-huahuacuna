import { Module } from '@nestjs/common';
import { SponsorshipsController } from './sponsorships.controller';
import { SponsorshipsService } from './sponsorships.service';

/**
 * Módulo de Apadrinamientos
 *
 * Gestiona todas las operaciones relacionadas con solicitudes de apadrinamiento
 * y apadrinamientos activos, comunicándose con el microservicio apadrinamiento.
 */
@Module({
  controllers: [SponsorshipsController],
  providers: [SponsorshipsService],
  exports: [SponsorshipsService],
})
export class SponsorshipsModule {}
