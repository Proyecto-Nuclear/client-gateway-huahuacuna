import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { Role } from '../common/auth/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/auth/jwt-payload.interface';
import {
  CreateMonetaryDonationDto,
  CreateInKindDonationDto,
  GetDonationsQueryDto,
} from './dto';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('monetary')
  @EndpointConfig({ kafkaTopic: 'donaciones_create_monetary' })
  @ApiOperation({
    summary: 'Crear donación monetaria (PSE)',
    description:
      'Permite crear una donación monetaria a través de PSE. El monto debe ser mínimo $10.000 COP (1000000 centavos).',
  })
  @ApiBody({ type: CreateMonetaryDonationDto })
  @ApiResponse({
    status: 201,
    description: 'Donación monetaria creada exitosamente',
    schema: {
      example: {
        id: 1,
        type: 'MONETARY',
        amount: 5000000,
        donorName: 'Juan Pérez García',
        donorEmail: 'juan.perez@example.com',
        status: 'PENDING',
        transactionId: 'TXN-123456789',
        createdAt: '2024-01-15T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o monto inferior al mínimo permitido',
  })
  createMonetary(@Body() data: CreateMonetaryDonationDto) {
    return this.donationsService.createMonetary(data);
  }

  @Post('in-kind')
  @EndpointConfig({ kafkaTopic: 'donaciones_create_inkind' })
  @ApiOperation({
    summary: 'Registrar interés en donación en especie',
    description:
      'Permite registrar el interés de un donante en realizar una donación en especie (artículos físicos). El equipo se pondrá en contacto para coordinar la entrega.',
  })
  @ApiBody({ type: CreateInKindDonationDto })
  @ApiResponse({
    status: 201,
    description: 'Interés en donación en especie registrado exitosamente',
    schema: {
      example: {
        id: 2,
        type: 'IN_KIND',
        donorName: 'María González López',
        donorEmail: 'maria.gonzalez@example.com',
        description: '10 juguetes didácticos, 5 pelotas de fútbol',
        estimatedValue: 50000,
        status: 'PENDING',
        createdAt: '2024-01-15T11:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  createInKind(@Body() data: CreateInKindDonationDto) {
    return this.donationsService.createInKind(data);
  }

  @Get('admin/all')
  @EndpointConfig({
    kafkaTopic: 'donaciones_get_all',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Obtener todas las donaciones (Admin)',
    description:
      'Permite a los administradores obtener un listado de todas las donaciones con filtros y paginación. Requiere autenticación y rol de administrador.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de donaciones obtenido exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            type: 'MONETARY',
            amount: 5000000,
            donorName: 'Juan Pérez',
            status: 'APPROVED',
            createdAt: '2024-01-15T10:30:00Z',
          },
          {
            id: 2,
            type: 'IN_KIND',
            donorName: 'María González',
            description: 'Juguetes y útiles',
            status: 'PENDING',
            createdAt: '2024-01-14T09:15:00Z',
          },
        ],
        total: 50,
        skip: 0,
        take: 10,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o no proporcionado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - El usuario no tiene rol de administrador',
  })
  getAllDonations(@Query() query: GetDonationsQueryDto) {
    return this.donationsService.getAllDonations(query);
  }

  @Get('my-donations')
  @EndpointConfig({
    kafkaTopic: 'donaciones_get_user_donations',
    isProtected: true,
  })
  @ApiOperation({
    summary: 'Obtener mis donaciones',
    description:
      'Permite a un usuario autenticado obtener el listado de sus propias donaciones. Requiere autenticación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de donaciones del usuario obtenido exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            type: 'MONETARY',
            amount: 5000000,
            status: 'APPROVED',
            projectName: 'Construcción de aulas',
            message: 'Para apoyar la educación',
            createdAt: '2024-01-15T10:30:00Z',
          },
        ],
        total: 1,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o no proporcionado',
  })
  getUserDonations(@CurrentUser() user: JwtPayload, @Query() query: GetDonationsQueryDto) {
    return this.donationsService.getUserDonations(user.sub, query);
  }

  @Post(':id/approve')
  @EndpointConfig({
    kafkaTopic: 'donaciones_approve',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Aprobar donación (Admin)',
    description:
      'Permite a los administradores aprobar una donación pendiente. Requiere autenticación y rol de administrador.',
  })
  @ApiResponse({
    status: 200,
    description: 'Donación aprobada exitosamente',
    schema: {
      example: {
        id: 1,
        status: 'APPROVED',
        approvedAt: '2024-01-15T12:00:00Z',
        approvedBy: 5,
        message: 'Donación aprobada exitosamente',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o no proporcionado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - El usuario no tiene rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Donación no encontrada',
  })
  approveDonation(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.donationsService.approveDonation(id, user.sub);
  }
}
