import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { LogbookService } from './logbook.service';
import { EndpointConfig } from '../common/decorators/endpoint-config.decorator';
import type { JwtPayload } from '../common/auth/jwt-payload.interface';
import { Role } from '../common/auth/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateLogbookEntryDto } from './dto/create-logbook-entry.dto';
import { GetEntriesQueryDto } from './dto/get-entries-query.dto';

@ApiTags('logbook')
@Controller('logbook')
export class LogbookController {
  constructor(private readonly logbookService: LogbookService) {}

  // ==========================================================================
  // ADMIN ENDPOINTS
  // ==========================================================================

  @Post('entries')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_logbook_create_entry',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Crear entrada de bitácora (Admin)',
    description: 'Permite a los administradores crear una nueva entrada en la bitácora del niño - RF-013',
  })
  @ApiBody({ type: CreateLogbookEntryDto })
  @ApiResponse({
    status: 201,
    description: 'Entrada de bitácora creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o descripción muy larga',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  createEntry(@Body() data: CreateLogbookEntryDto, @CurrentUser() user: JwtPayload) {
    return this.logbookService.createEntry(data, user.sub);
  }

  // ==========================================================================
  // PADRINO ENDPOINTS
  // ==========================================================================

  @Get('children/:childId/entries')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_logbook_get_entries',
    isProtected: true,
  })
  @ApiOperation({
    summary: 'Obtener entradas de bitácora del niño',
    description:
      'Permite a los padrinos ver la bitácora de su niño apadrinado - RF-015, RF-016. Incluye paginación y filtros por fecha.',
  })
  @ApiParam({
    name: 'childId',
    description: 'ID del niño',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Entradas obtenidas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo el padrino asignado o admin puede ver',
  })
  getEntries(@Param('childId', ParseIntPipe) childId: number, @Query() query: GetEntriesQueryDto) {
    return this.logbookService.getEntries(childId, query);
  }

  @Get('children/:childId/pdf')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_logbook_generate_pdf',
    isProtected: true,
  })
  @ApiOperation({
    summary: 'Descargar bitácora en PDF',
    description:
      'Permite a los padrinos descargar la bitácora completa del niño en formato PDF - RF-017',
  })
  @ApiParam({
    name: 'childId',
    description: 'ID del niño',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'PDF generado exitosamente',
    headers: {
      'Content-Type': {
        description: 'application/pdf',
      },
      'Content-Disposition': {
        description: 'attachment; filename="bitacora-nino-{id}.pdf"',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Niño no encontrado',
  })
  async downloadPdf(
    @Param('childId', ParseIntPipe) childId: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.logbookService.generatePdf(childId);

      // Convertir de base64 a Buffer
      const pdfBuffer = Buffer.from(result.pdf, 'base64');

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error: unknown) {
      const err = error as any;
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Error al generar PDF';

      res.status(statusCode).json({
        statusCode,
        message,
        error: err.error || 'Error',
      });
    }
  }

  @Get('children/:childId/statistics')
  @EndpointConfig({
    kafkaTopic: 'apadrinamiento_logbook_get_statistics',
    isProtected: true,
  })
  @ApiOperation({
    summary: 'Obtener estadísticas de bitácora',
    description:
      'Muestra estadísticas de la bitácora del niño: total de fotos, videos y última actualización - RF-019',
  })
  @ApiParam({
    name: 'childId',
    description: 'ID del niño',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  getStatistics(@Param('childId', ParseIntPipe) childId: number) {
    return this.logbookService.getStatistics(childId);
  }
}
