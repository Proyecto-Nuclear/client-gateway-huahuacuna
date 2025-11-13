import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import {
  CreateChildDto,
  UpdateChildDto,
  FilterChildrenDto,
  PaginationDto,
} from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { Role } from '../common/auth/jwt-payload.interface';
import type { JwtPayload } from '../common/auth/jwt-payload.interface';

/**
 * Controlador del Gateway para gestión de niños
 * Comunica con el microservicio apadrinamiento via Kafka
 * RF-006: Catálogo de niños disponibles
 * RF-007: Filtrado por edad, género, municipio
 */
@ApiTags('Children')
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  /**
   * RF-006: Crear nuevo niño (solo SUPER_ADMIN y ADMIN)
   */
  @Post()
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_children_create',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Crear nuevo niño',
    description: 'Solo administradores pueden crear niños en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Niño creado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tiene permisos suficientes',
  })
  async create(
    @Body() createChildDto: CreateChildDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.childrenService.create(createChildDto, user.sub);
  }

  /**
   * RF-006: Obtener niños disponibles (público)
   * Máximo 12 niños por página
   */
  @Get('available')
  @EndpointConfig({ kafkaTopic: 'apadrinamiento_children_get_available' })
  @ApiOperation({
    summary: 'Obtener niños disponibles para apadrinar',
    description: 'Lista de niños con estado AVAILABLE (RF-006). Máximo 12 por página.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de niños disponibles',
  })
  async getAvailable(@Query() paginationDto: PaginationDto) {
    return this.childrenService.getAvailable(paginationDto);
  }

  /**
   * RF-007: Filtrar niños por edad, género, municipio
   */
  @Get('filter')
  @EndpointConfig({ kafkaTopic: 'apadrinamiento_children_filter' })
  @ApiOperation({
    summary: 'Filtrar niños disponibles',
    description:
      'Filtrar niños por rango de edad, género y municipio (RF-007). Máximo 12 por página.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de niños filtrados',
  })
  async filter(@Query() filterDto: FilterChildrenDto) {
    return this.childrenService.filter(filterDto);
  }

  /**
   * Obtener todos los niños (solo ADMIN y SUPER_ADMIN)
   * Incluye todos los estados
   */
  @Get()
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_children_get_all',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Obtener todos los niños',
    description: 'Lista completa de niños en todos los estados. Solo para administradores.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todos los niños',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tiene permisos suficientes',
  })
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.childrenService.getAll(paginationDto);
  }

  /**
   * Obtener niño por ID (público)
   */
  @Get(':id')
  @EndpointConfig({ kafkaTopic: 'apadrinamiento_children_get_by_id' })
  @ApiOperation({
    summary: 'Obtener niño por ID',
    description: 'Obtiene la información completa de un niño',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Niño encontrado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Niño no encontrado',
  })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.getById(id);
  }

  /**
   * Actualizar niño (solo SUPER_ADMIN y ADMIN)
   */
  @Patch(':id')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_children_update',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Actualizar información de un niño',
    description: 'Solo administradores pueden actualizar la información de los niños',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Niño actualizado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Niño no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tiene permisos suficientes',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.childrenService.update(id, updateChildDto);
  }

  /**
   * Eliminar niño (solo SUPER_ADMIN y ADMIN)
   * No permite eliminar niños en estado PENDING o SPONSORED
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_children_delete',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Eliminar niño',
    description:
      'Solo administradores pueden eliminar niños. No se pueden eliminar niños con estado PENDING o SPONSORED',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Niño eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Niño no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No se puede eliminar niño en estado PENDING o SPONSORED',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tiene permisos suficientes',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.childrenService.delete(id);
  }
}
