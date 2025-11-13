import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, } from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import {
  CreateProjectDto,
  GetProjectsQueryDto,
  GetPublishedProjectsQueryDto,
  GetVolunteersQueryDto,
  MarkVolunteerContactedDto,
  RegisterVolunteerDto,
  UpdateProjectDto,
} from "./dto";
import { JwtAuthGuard } from "../common/guard/jwt-auth.guard";
import { RolesGuard } from "../common/guard/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/auth/jwt-payload.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { KafkaTopics } from "../common/decorators/kafka-topic.decorator";

/**
 * Controlador de Proyectos - Client Gateway
 *
 * Expone endpoints REST para gestión de proyectos y voluntarios.
 * Endpoints públicos: visualización de proyectos, detalle, registro de voluntarios
 * Endpoints protegidos (Admin): CRUD de proyectos, gestión de voluntarios
 */
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ========== Endpoints Públicos ==========

  /**
   * GET /api/projects/public
   * Obtener proyectos publicados (sin autenticación)
   */
  @Get('public')
  @ApiOperation({ summary: 'Obtener proyectos publicados' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos publicados' })
  @KafkaTopics('servicios_projects_get_published')
  async getPublishedProjects(@Query() query: GetPublishedProjectsQueryDto) {
    return this.projectsService.getPublishedProjects(query);
  }

  /**
   * GET /api/projects/public/:slug
   * Obtener detalle de proyecto por slug (sin autenticación)
   */
  @Get('public/:slug')
  @ApiOperation({ summary: 'Obtener detalle de proyecto publicado' })
  @ApiParam({ name: 'slug', description: 'Slug del proyecto' })
  @ApiResponse({ status: 200, description: 'Detalle del proyecto' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @KafkaTopics('servicios_projects_get_detail')
  async getProjectDetail(@Param('slug') slug: string) {
    return this.projectsService.getProjectDetail(slug);
  }

  /**
   * POST /api/projects/:id/volunteers
   * Registrar voluntario en un proyecto (sin autenticación)
   */
  @Post(':id/volunteers')
  @ApiOperation({ summary: 'Registrarse como voluntario en un proyecto' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiResponse({ status: 201, description: 'Registro de voluntario creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o email ya registrado' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @KafkaTopics('servicios_projects_register_volunteer')
  async registerVolunteer(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: RegisterVolunteerDto,
  ) {
    return this.projectsService.registerVolunteer(projectId, dto);
  }

  // ========== Endpoints Administrativos ==========

  /**
   * POST /api/projects
   * Crear proyecto (requiere autenticación y rol Admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo proyecto (Admin)' })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @KafkaTopics('servicios_projects_create')
  async createProject(
    @Body() dto: CreateProjectDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.projectsService.createProject(dto, userId);
  }

  /**
   * GET /api/projects
   * Obtener todos los proyectos con filtros (requiere autenticación y rol Admin)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los proyectos (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de proyectos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @KafkaTopics('servicios_projects_get_all')
  async getAllProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectsService.getAllProjects(query);
  }

  /**
   * PUT /api/projects/:id
   * Actualizar proyecto (requiere autenticación y rol Admin)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar proyecto (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @KafkaTopics('servicios_projects_update')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.projectsService.updateProject(id, dto, userId);
  }

  /**
   * POST /api/projects/:id/publish
   * Publicar proyecto (requiere autenticación y rol Admin)
   */
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar proyecto (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto publicado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @KafkaTopics('servicios_projects_publish')
  async publishProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.projectsService.publishProject(id, userId);
  }

  /**
   * DELETE /api/projects/:id
   * Eliminar proyecto (requiere autenticación y rol Admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar proyecto (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @KafkaTopics('servicios_projects_delete')
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }

  /**
   * GET /api/projects/volunteers
   * Obtener registros de voluntarios (requiere autenticación y rol Admin)
   */
  @Get('volunteers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener registros de voluntarios (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de voluntarios registrados' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @KafkaTopics('servicios_projects_get_volunteers')
  async getVolunteers(@Query() query: GetVolunteersQueryDto) {
    return this.projectsService.getVolunteers(query);
  }

  /**
   * POST /api/projects/volunteers/:id/contacted
   * Marcar voluntario como contactado (requiere autenticación y rol Admin)
   */
  @Post('volunteers/:id/contacted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar voluntario como contactado (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del registro de voluntario' })
  @ApiResponse({ status: 200, description: 'Voluntario marcado como contactado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @KafkaTopics('servicios_projects_mark_volunteer_contacted')
  async markVolunteerContacted(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MarkVolunteerContactedDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.projectsService.markVolunteerContacted(id, dto, userId);
  }
}
