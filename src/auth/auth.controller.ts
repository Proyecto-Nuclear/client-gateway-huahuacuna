import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import express from "express";
import { AuthService } from "./auth.service";
import {
  CreateAdminDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  ResetPasswordRequestDto,
  UpdateAdminDto,
  UpdateProfileDto,
  VerifyEmailDto,
} from "./dto";
import { EndpointConfig } from "../common/decorators/endpoint-config.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import * as jwtPayloadInterface from "../common/auth/jwt-payload.interface";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * RF-001: Registro de Padrinos
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @EndpointConfig({ kafkaTopic: 'auth_register' })
  @ApiOperation({ summary: 'Registro de padrinos' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o documento ya registrado' })
  async register(@Body() dto: RegisterDto, @Req() req: express.Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, ipAddress, userAgent);
  }

  /**
   * RF-002: Autenticación de Usuarios
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({ kafkaTopic: 'auth_login' })
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 403, description: 'Cuenta bloqueada o inactiva' })
  async login(@Body() dto: LoginDto, @Req() req: express.Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ipAddress, userAgent);
  }

  /**
   * Verificación de email
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({ kafkaTopic: 'auth_verify_email' })
  @ApiOperation({ summary: 'Verificar email' })
  @ApiResponse({ status: 200, description: 'Email verificado exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  /**
   * RF-003: Recuperación de Contraseña - Solicitud
   */
  @Post('password/request-reset')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({ kafkaTopic: 'auth_request_password_reset' })
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Solicitud procesada' })
  async requestPasswordReset(@Body() dto: ResetPasswordRequestDto) {
    return this.authService.requestPasswordReset(dto);
  }

  /**
   * RF-003: Recuperación de Contraseña - Confirmación
   */
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({ kafkaTopic: 'auth_reset_password' })
  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  /**
   * Refrescar access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({ kafkaTopic: 'auth_refresh_token' })
  @ApiOperation({ summary: 'Refrescar access token' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  /**
   * Cerrar sesión
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @EndpointConfig({
    kafkaTopic: 'auth_logout',
    isProtected: true,
  })
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout(
    @Body() dto: RefreshTokenDto,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
  ) {
    return this.authService.logout(dto.refreshToken, user.sub);
  }

  /**
   * Obtener perfil del usuario actual
   */
  @Get('profile')
  @EndpointConfig({
    kafkaTopic: 'auth_get_user',
    isProtected: true,
  })
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  async getProfile(@CurrentUser() user: jwtPayloadInterface.JwtPayload) {
    return this.authService.getUserById(user.sub);
  }

  /**
   * RF-004: Gestión de Perfil de Padrino
   */
  @Patch('profile')
  @EndpointConfig({
    kafkaTopic: 'auth_update_profile',
    isProtected: true,
    roles: [jwtPayloadInterface.Role.PADRINO],
  })
  @ApiOperation({ summary: 'Actualizar perfil de padrino' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo padrinos pueden actualizar su perfil' })
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
  ) {
    return this.authService.updateProfile(user.sub, dto);
  }

  /**
   * RF-005: Gestión de Administradores - Creación
   */
  @Post('admins')
  @HttpCode(HttpStatus.CREATED)
  @EndpointConfig({
    kafkaTopic: 'auth_create_admin',
    isProtected: true,
    roles: [jwtPayloadInterface.Role.SUPER_ADMIN],
  })
  @ApiOperation({ summary: 'Crear administrador (solo super-admin)' })
  @ApiResponse({ status: 201, description: 'Administrador creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo super-admins pueden crear administradores' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
    @Req() req: express.Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.authService.createAdmin(dto, user.sub, ipAddress, userAgent);
  }

  /**
   * RF-005: Gestión de Administradores - Actualización
   */
  @Patch('admins/:adminId')
  @EndpointConfig({
    kafkaTopic: 'auth_update_admin',
    isProtected: true,
    roles: [jwtPayloadInterface.Role.SUPER_ADMIN],
  })
  @ApiOperation({ summary: 'Actualizar administrador (solo super-admin)' })
  @ApiResponse({ status: 200, description: 'Administrador actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo super-admins pueden actualizar administradores' })
  @ApiResponse({ status: 404, description: 'Administrador no encontrado' })
  async updateAdmin(
    @Param('adminId') adminId: string,
    @Body() dto: UpdateAdminDto,
    @CurrentUser() user: jwtPayloadInterface.JwtPayload,
  ) {
    return this.authService.updateAdmin(parseInt(adminId), dto, user.sub);
  }

  /**
   * RF-005: Listar administradores
   */
  @Get('admins')
  @EndpointConfig({
    kafkaTopic: 'auth_list_admins',
    isProtected: true,
    roles: [jwtPayloadInterface.Role.SUPER_ADMIN],
  })
  @ApiOperation({ summary: 'Listar administradores (solo super-admin)' })
  @ApiResponse({ status: 200, description: 'Lista de administradores obtenida exitosamente' })
  @ApiResponse({ status: 403, description: 'Solo super-admins pueden listar administradores' })
  async listAdmins(@CurrentUser() user: jwtPayloadInterface.JwtPayload) {
    return this.authService.listAdmins(user.sub);
  }

  /**
   * Test endpoint
   */
  @Get('test')
  @EndpointConfig({ kafkaTopic: 'auth_test' })
  @ApiOperation({ summary: 'Test de comunicación con auth service' })
  async test() {
    return this.authService.test();
  }
}
