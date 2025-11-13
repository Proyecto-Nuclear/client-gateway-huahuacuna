import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';

/**
 * Módulo de Bitácora de Actividades
 *
 * Gestiona todas las operaciones relacionadas con registros de actividad,
 * comunicándose con el microservicio apadrinamiento.
 */
@Module({
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
