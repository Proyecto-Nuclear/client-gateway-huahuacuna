import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateProjectDto,
  UpdateProjectDto,
  GetProjectsQueryDto,
  GetPublishedProjectsQueryDto,
  RegisterVolunteerDto,
  MarkVolunteerContactedDto,
  GetVolunteersQueryDto,
} from './dto';

/**
 * Servicio de Proyectos - Client Gateway
 *
 * Maneja la comunicación con el microservicio de servicios
 * a través de Kafka para todas las operaciones relacionadas con proyectos.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @Inject('SERVICIOS_SERVICE')
    private readonly serviciosClient: ClientKafka,
  ) {}

  /**
   * Crear proyecto (Admin)
   */
  async createProject(dto: CreateProjectDto, userId: number) {
    const pattern = 'servicios_projects_create';
    return firstValueFrom(
      this.serviciosClient.send(pattern, {
        ...dto,
        createdBy: userId,
      }),
    );
  }

  /**
   * Actualizar proyecto (Admin)
   */
  async updateProject(id: number, dto: UpdateProjectDto, userId: number) {
    const pattern = 'servicios_projects_update';
    return firstValueFrom(
      this.serviciosClient.send(pattern, {
        id,
        data: {
          ...dto,
          updatedBy: userId,
        },
      }),
    );
  }

  /**
   * Publicar proyecto (Admin)
   */
  async publishProject(id: number, userId: number) {
    const pattern = 'servicios_projects_publish';
    return firstValueFrom(
      this.serviciosClient.send(pattern, {
        id,
        updatedBy: userId,
      }),
    );
  }

  /**
   * Eliminar proyecto (Admin)
   */
  async deleteProject(id: number) {
    const pattern = 'servicios_projects_delete';
    return firstValueFrom(
      this.serviciosClient.send(pattern, { id }),
    );
  }

  /**
   * Obtener todos los proyectos (Admin)
   */
  async getAllProjects(query: GetProjectsQueryDto) {
    const pattern = 'servicios_projects_get_all';
    return firstValueFrom(
      this.serviciosClient.send(pattern, query),
    );
  }

  /**
   * Obtener proyectos publicados (Público)
   */
  async getPublishedProjects(query: GetPublishedProjectsQueryDto) {
    const pattern = 'servicios_projects_get_published';
    return firstValueFrom(
      this.serviciosClient.send(pattern, query),
    );
  }

  /**
   * Obtener detalle de proyecto (Público)
   */
  async getProjectDetail(slug: string) {
    const pattern = 'servicios_projects_get_detail';
    return firstValueFrom(
      this.serviciosClient.send(pattern, { slug }),
    );
  }

  /**
   * Registrar voluntario (Público)
   */
  async registerVolunteer(projectId: number, dto: RegisterVolunteerDto) {
    const pattern = 'servicios_projects_register_volunteer';
    return firstValueFrom(
      this.serviciosClient.send(pattern, {
        ...dto,
        projectId,
      }),
    );
  }

  /**
   * Obtener registros de voluntarios (Admin)
   */
  async getVolunteers(query: GetVolunteersQueryDto) {
    const pattern = 'servicios_projects_get_volunteers';
    return firstValueFrom(
      this.serviciosClient.send(pattern, query),
    );
  }

  /**
   * Marcar voluntario como contactado (Admin)
   */
  async markVolunteerContacted(
    id: number,
    dto: MarkVolunteerContactedDto,
    userId: number,
  ) {
    const pattern = 'servicios_projects_mark_volunteer_contacted';
    return firstValueFrom(
      this.serviciosClient.send(pattern, {
        id,
        data: {
          ...dto,
          contactedBy: userId,
        },
      }),
    );
  }
}
