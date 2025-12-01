import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { DonationsService } from "./donations.service";
import { EndpointConfig } from "../common/decorators/endpoint-config.decorator";
import type { JwtPayload } from "../common/auth/jwt-payload.interface";
import { Role } from "../common/auth/jwt-payload.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import {
  CreateDonationInfoDto,
  CreateInKindDonationDto,
  CreateMonetaryDonationDto,
  CreateTestimonialDto,
  GetDonationsQueryDto,
} from "./dto";

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

  // ============================================================================
  // DONATION INFO ENDPOINTS (Public & Admin)
  // ============================================================================

  @Get('info')
  @EndpointConfig({ kafkaTopic: 'donaciones_get_donation_info' })
  @ApiOperation({
    summary: 'Obtener información pública sobre donaciones',
    description:
      'Endpoint público que devuelve la información sobre cómo donar, importancia, destino, modalidades, CTA y estadísticas de impacto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de donaciones obtenida exitosamente',
  })
  getDonationInfo() {
    return this.donationsService.getDonationInfo();
  }

  @Post('admin/info')
  @EndpointConfig({
    kafkaTopic: 'donaciones_create_donation_info',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Crear información de donaciones (Admin)',
    description: 'Permite a los administradores crear la información pública sobre donaciones.',
  })
  @ApiBody({ type: CreateDonationInfoDto })
  @ApiResponse({
    status: 201,
    description: 'Información de donaciones creada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  createDonationInfo(@Body() data: CreateDonationInfoDto, @CurrentUser() user: JwtPayload) {
    return this.donationsService.createDonationInfo(data, user.sub);
  }

  @Put('admin/info/:id')
  @EndpointConfig({
    kafkaTopic: 'donaciones_update_donation_info',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Actualizar información de donaciones (Admin)',
    description: 'Permite a los administradores actualizar la información pública sobre donaciones.',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de donaciones actualizada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Información no encontrada',
  })
  updateDonationInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateDonationInfoDto>,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.donationsService.updateDonationInfo(id, data, user.sub);
  }

  // ============================================================================
  // TESTIMONIALS ENDPOINTS (Public & Admin)
  // ============================================================================

  @Get('testimonials')
  @EndpointConfig({ kafkaTopic: 'donaciones_get_published_testimonials' })
  @ApiOperation({
    summary: 'Obtener testimonios publicados',
    description:
      'Endpoint público que devuelve los testimonios de donantes publicados. Por defecto retorna 10.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonios obtenidos exitosamente',
  })
  getPublishedTestimonials(@Query('limit', ParseIntPipe) limit?: number) {
    return this.donationsService.getPublishedTestimonials(limit);
  }

  @Get('admin/testimonials')
  @EndpointConfig({
    kafkaTopic: 'donaciones_get_all_testimonials',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Obtener todos los testimonios (Admin)',
    description:
      'Permite a los administradores obtener todos los testimonios, publicados y no publicados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonios obtenidos exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  getAllTestimonials(@Query() query: { skip?: number; take?: number }) {
    return this.donationsService.getAllTestimonials(query);
  }

  @Post('admin/testimonials')
  @EndpointConfig({
    kafkaTopic: 'donaciones_create_testimonial',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Crear testimonio (Admin)',
    description: 'Permite a los administradores crear un nuevo testimonio de donante.',
  })
  @ApiBody({ type: CreateTestimonialDto })
  @ApiResponse({
    status: 201,
    description: 'Testimonio creado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  createTestimonial(@Body() data: CreateTestimonialDto, @CurrentUser() user: JwtPayload) {
    return this.donationsService.createTestimonial(data, user.sub);
  }

  @Put('admin/testimonials/:id')
  @EndpointConfig({
    kafkaTopic: 'donaciones_update_testimonial',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Actualizar testimonio (Admin)',
    description: 'Permite a los administradores actualizar un testimonio existente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio actualizado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Testimonio no encontrado',
  })
  updateTestimonial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateTestimonialDto>,
  ) {
    return this.donationsService.updateTestimonial(id, data);
  }

  @Post('admin/testimonials/:id/publish')
  @EndpointConfig({
    kafkaTopic: 'donaciones_publish_testimonial',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Publicar testimonio (Admin)',
    description: 'Permite a los administradores publicar un testimonio para que sea visible públicamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio publicado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Testimonio no encontrado',
  })
  publishTestimonial(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.publishTestimonial(id);
  }

  @Post('admin/testimonials/:id/unpublish')
  @EndpointConfig({
    kafkaTopic: 'donaciones_unpublish_testimonial',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Despublicar testimonio (Admin)',
    description: 'Permite a los administradores despublicar un testimonio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio despublicado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Testimonio no encontrado',
  })
  unpublishTestimonial(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.unpublishTestimonial(id);
  }

  @Delete('admin/testimonials/:id')
  @EndpointConfig({
    kafkaTopic: 'donaciones_delete_testimonial',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Eliminar testimonio (Admin)',
    description: 'Permite a los administradores eliminar un testimonio permanentemente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Testimonio eliminado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Testimonio no encontrado',
  })
  deleteTestimonial(@Param('id', ParseIntPipe) id: number) {
    return this.donationsService.deleteTestimonial(id);
  }

  // ============================================================================
  // PSE ENDPOINTS
  // ============================================================================

  @Post('pse/callback')
  @EndpointConfig({ kafkaTopic: 'donaciones_pse_callback' })
  @ApiOperation({
    summary: 'Callback de PSE (Webhook)',
    description:
      'Endpoint público que recibe las notificaciones de PSE sobre el estado de las transacciones. Este endpoint no requiere autenticación ya que es llamado por PSE.',
  })
  @ApiResponse({
    status: 200,
    description: 'Callback procesado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de callback inválidos',
  })
  pseCallback(@Body() callbackData: any) {
    return this.donationsService.processPseCallback(callbackData);
  }

  // ============================================================================
  // CERTIFICATES ENDPOINTS
  // ============================================================================

  @Get('certificates/:year')
  @EndpointConfig({
    kafkaTopic: 'donaciones_generate_certificate',
    isProtected: true,
  })
  @ApiOperation({
    summary: 'Descargar certificado de donación anual',
    description:
      'Permite a un usuario autenticado descargar su certificado de donación para un año específico. ' +
      'IMPORTANTE: Solo se pueden generar certificados para años anteriores al actual. ' +
      'El certificado requiere donaciones aprobadas mayores a $50.000 COP en el año.',
  })
  @ApiParam({
    name: 'year',
    description: 'Año del certificado (debe ser anterior al año actual)',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Certificado PDF generado exitosamente',
    headers: {
      'Content-Type': {
        description: 'application/pdf',
      },
      'Content-Disposition': {
        description: 'attachment; filename="certificado-donacion-YYYY.pdf"',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Año inválido o monto insuficiente para generar certificado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron donaciones para el año especificado',
  })
  async downloadCertificate(
    @Param('year', ParseIntPipe) year: number,
    @CurrentUser() user: JwtPayload,
    @Res() res: Response,
  ) {
    try {
      const result = await this.donationsService.generateCertificate(user.sub, year);

      // Convertir de base64 a Buffer
      const pdfBuffer = Buffer.from(result.pdf, 'base64');

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error: unknown) {
      // Manejar errores de Kafka y propagarlos correctamente
      const err = error as any;
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Error al generar el certificado';

      res.status(statusCode).json({
        statusCode,
        message,
        error: err.error || 'Error',
      });
    }
  }

  // ============================================================================
  // EXCEL EXPORTS & REPORTS ENDPOINTS (Admin)
  // ============================================================================

  @Get('admin/export')
  @EndpointConfig({
    kafkaTopic: 'donaciones_export_excel',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Exportar donaciones a Excel (Admin)',
    description:
      'Permite a los administradores exportar donaciones a Excel con filtros avanzados: fecha, estado, tipo, monto, email del donante, proyecto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  async exportDonations(@Query() filters: any, @Res() res: Response) {
    try {
      const result = await this.donationsService.exportExcel(filters);
      const excelBuffer = Buffer.from(result.excel, 'base64');

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': excelBuffer.length,
      });

      res.status(HttpStatus.OK).send(excelBuffer);
    } catch (error: unknown) {
      const err = error as any;
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Error al exportar donaciones';

      res.status(statusCode).json({
        statusCode,
        message,
        error: err.error || 'Error',
      });
    }
  }

  @Get('admin/reports/annual/:year')
  @EndpointConfig({
    kafkaTopic: 'donaciones_generate_report',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Generar reporte anual (Admin)',
    description: 'Permite a los administradores generar reportes anuales en Excel con resumen y detalle.',
  })
  @ApiParam({
    name: 'year',
    description: 'Año del reporte',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte Excel generado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  async generateAnnualReport(
    @Param('year', ParseIntPipe) year: number,
    @Res() res: Response,
  ) {
    try {
      const reportData = {
        type: 'annual',
        year,
      };

      const result = await this.donationsService.generateReport(reportData);
      const excelBuffer = Buffer.from(result.excel, 'base64');

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': excelBuffer.length,
      });

      res.status(HttpStatus.OK).send(excelBuffer);
    } catch (error: unknown) {
      const err = error as any;
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Error al generar reporte anual';

      res.status(statusCode).json({
        statusCode,
        message,
        error: err.error || 'Error',
      });
    }
  }

  @Get('admin/reports/monthly/:year/:month')
  @EndpointConfig({
    kafkaTopic: 'donaciones_generate_report',
    isProtected: true,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  })
  @ApiOperation({
    summary: 'Generar reporte mensual (Admin)',
    description: 'Permite a los administradores generar reportes mensuales en Excel con resumen y detalle.',
  })
  @ApiParam({
    name: 'year',
    description: 'Año del reporte',
    example: 2024,
  })
  @ApiParam({
    name: 'month',
    description: 'Mes (1-12)',
    example: 12,
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte Excel generado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Requiere rol de administrador',
  })
  async generateMonthlyReport(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Res() res: Response,
  ) {
    try {
      const reportData = {
        type: 'monthly',
        year,
        month,
      };

      const result = await this.donationsService.generateReport(reportData);
      const excelBuffer = Buffer.from(result.excel, 'base64');

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': excelBuffer.length,
      });

      res.status(HttpStatus.OK).send(excelBuffer);
    } catch (error: unknown) {
      const err = error as any;
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Error al generar reporte mensual';

      res.status(statusCode).json({
        statusCode,
        message,
        error: err.error || 'Error',
      });
    }
  }
}
