import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

/**
 * Módulo de Proyectos - Client Gateway
 *
 * Maneja todas las operaciones relacionadas con proyectos de la fundación
 * y registros de voluntarios, comunicándose con el microservicio de servicios.
 */
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
