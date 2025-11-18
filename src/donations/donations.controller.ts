import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import { Role } from '../common/auth/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/auth/jwt-payload.interface';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post('monetary')
  @EndpointConfig({ kafkaTopic: 'donaciones_create_monetary' })
  @ApiOperation({ summary: 'Crear donación monetaria (PSE)' })
  createMonetary(@Body() data: any) {
    return this.donationsService.createMonetary(data);
  }

  @Post('in-kind')
  @EndpointConfig({ kafkaTopic: 'donaciones_create_inkind' })
  @ApiOperation({ summary: 'Registrar interés en donación en especie' })
  createInKind(@Body() data: any) {
    return this.donationsService.createInKind(data);
  }

  @Get('admin/all')
  @EndpointConfig({
    kafkaTopic: 'donaciones_get_all',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Obtener todas las donaciones (Admin)' })
  getAllDonations(@Query() query: any) {
    return this.donationsService.getAllDonations(query);
  }

  @Get('my-donations')
  @EndpointConfig({
    kafkaTopic: 'donaciones_get_user_donations',
    isProtected: true,
  })
  @ApiOperation({ summary: 'Obtener mis donaciones' })
  getUserDonations(@CurrentUser() user: JwtPayload, @Query() query: any) {
    return this.donationsService.getUserDonations(user.sub, query);
  }

  @Post(':id/approve')
  @EndpointConfig({
    kafkaTopic: 'donaciones_approve',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({ summary: 'Aprobar donación (Admin)' })
  approveDonation(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.donationsService.approveDonation(id, user.sub);
  }
}
