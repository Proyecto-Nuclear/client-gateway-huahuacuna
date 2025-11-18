import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { Role } from '../common/auth/jwt-payload.interface';
import {
  CreateEventDto,
  UpdateEventDto,
  GetEventsQueryDto,
  GetPublishedEventsQueryDto,
  RegisterToEventDto,
  GetRegistrationsQueryDto,
  CheckInDto,
} from './dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @EndpointConfig({
    kafkaTopic: 'servicios_events_create',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Crear un nuevo evento (Admin)' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_update',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Actualizar evento (Admin)' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Post(':id/publish')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_publish',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Publicar evento (Admin)' })
  publish(@Param('id') id: string) {
    return this.eventsService.publish(+id);
  }

  @Delete(':id')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_delete',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Eliminar evento (Admin)' })
  delete(@Param('id') id: string) {
    return this.eventsService.delete(+id);
  }

  @Get('admin/all')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_get_all',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener todos los eventos (Admin)' })
  getAllAdmin(@Query() query: GetEventsQueryDto) {
    return this.eventsService.getAllAdmin(query);
  }

  @Get('published')
  @EndpointConfig({ kafkaTopic: 'servicios_events_get_published' })
  @ApiOperation({ summary: 'Obtener eventos publicados (Público)' })
  getPublished(@Query() query: GetPublishedEventsQueryDto) {
    return this.eventsService.getPublished(query);
  }

  @Get(':slug')
  @EndpointConfig({ kafkaTopic: 'servicios_events_get_detail' })
  @ApiOperation({ summary: 'Obtener detalle de evento por slug (Público)' })
  getDetail(@Param('slug') slug: string) {
    return this.eventsService.getDetail(slug);
  }

  @Post('register')
  @EndpointConfig({ kafkaTopic: 'servicios_events_register' })
  @ApiOperation({ summary: 'Inscribirse a un evento (Público)' })
  register(@Body() registerDto: RegisterToEventDto) {
    return this.eventsService.register(registerDto);
  }

  @Get(':id/registrations')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_get_registrations',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener inscritos a un evento (Admin)' })
  getRegistrations(@Param('id') id: string, @Query() query: GetRegistrationsQueryDto) {
    return this.eventsService.getRegistrations(+id, query);
  }

  @Post('registrations/:id/check-in')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_check_in',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Hacer check-in de una inscripción (Admin)' })
  checkIn(@Param('id') id: string, @Body() checkInDto: CheckInDto) {
    return this.eventsService.checkIn(+id, checkInDto);
  }

  @Get(':id/statistics')
  @EndpointConfig({
    kafkaTopic: 'servicios_events_get_statistics',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener estadísticas de un evento (Admin)' })
  getStatistics(@Param('id') id: string) {
    return this.eventsService.getStatistics(+id);
  }
}
