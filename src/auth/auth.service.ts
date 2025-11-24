import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordRequestDto,
  ResetPasswordDto,
  VerifyEmailDto,
  UpdateProfileDto,
  CreateAdminDto,
  UpdateAdminDto,
  RefreshTokenDto,
} from './dto';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  /**
   * RF-001: Registro de Padrinos
   * Protegido con Circuit Breaker
   */
  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    this.logger.log(`Registering new user: ${dto.email}`);

    // Ejecutar con circuit breaker
    return await this.circuitBreaker.execute(
      'auth-service',
      () => this.kafkaClient.send('auth_register', { dto, ipAddress, userAgent }),
      // Fallback: retornar error amigable
      () => ({
        error: true,
        message: 'Auth service is temporarily unavailable. Please try again later.',
        statusCode: 503,
      }),
      {
        timeout: 10000, // 10 segundos para registro
        errorThresholdPercentage: 50,
      },
    );
  }

  /**
   * RF-002: Autenticación de Usuarios
   * Protegido con Circuit Breaker
   */
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    this.logger.log(`Login attempt for: ${dto.email}`);

    return await this.circuitBreaker.execute(
      'auth-service',
      () => this.kafkaClient.send('auth_login', { dto, ipAddress, userAgent }),
      () => ({
        error: true,
        message: 'Auth service is temporarily unavailable. Please try again later.',
        statusCode: 503,
      }),
      {
        timeout: 5000, // 5 segundos para login
      },
    );
  }

  /**
   * Verificación de email
   */
  async verifyEmail(dto: VerifyEmailDto) {
    this.logger.log('Email verification request');
    return await firstValueFrom(
      this.kafkaClient.send('auth_verify_email', dto),
    );
  }

  /**
   * RF-003: Recuperación de Contraseña - Solicitud
   */
  async requestPasswordReset(dto: ResetPasswordRequestDto) {
    this.logger.log(`Password reset request for: ${dto.email}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_request_password_reset', dto),
    );
  }

  /**
   * RF-003: Recuperación de Contraseña - Confirmación
   */
  async resetPassword(dto: ResetPasswordDto) {
    this.logger.log('Password reset confirmation');
    return await firstValueFrom(
      this.kafkaClient.send('auth_reset_password', dto),
    );
  }

  /**
   * Refrescar access token
   */
  async refreshToken(dto: RefreshTokenDto) {
    this.logger.log('Token refresh request');
    return await firstValueFrom(
      this.kafkaClient.send('auth_refresh_token', dto),
    );
  }

  /**
   * Cerrar sesión
   */
  async logout(refreshToken: string, userId: number) {
    this.logger.log(`Logout request for user: ${userId}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_logout', {
        refreshToken,
        userId,
      }),
    );
  }

  /**
   * RF-004: Gestión de Perfil de Padrino
   */
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    this.logger.log(`Profile update for user: ${userId}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_update_profile', {
        userId,
        dto,
      }),
    );
  }

  /**
   * RF-005: Gestión de Administradores - Creación
   */
  async createAdmin(
    dto: CreateAdminDto,
    createdBy: number,
    ipAddress?: string,
    userAgent?: string,
  ) {
    this.logger.log(`Creating admin: ${dto.email} by user: ${createdBy}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_create_admin', {
        dto,
        createdBy,
        ipAddress,
        userAgent,
      }),
    );
  }

  /**
   * RF-005: Gestión de Administradores - Actualización
   */
  async updateAdmin(
    adminId: number,
    dto: UpdateAdminDto,
    updatedBy: number,
  ) {
    this.logger.log(`Updating admin: ${adminId} by user: ${updatedBy}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_update_admin', {
        adminId,
        dto,
        updatedBy,
      }),
    );
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId: number) {
    this.logger.log(`Getting user by ID: ${userId}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_get_user', { userId }),
    );
  }

  /**
   * RF-005: Listar administradores
   */
  async listAdmins(requesterId: number) {
    this.logger.log(`Listing admins requested by: ${requesterId}`);
    return await firstValueFrom(
      this.kafkaClient.send('auth_list_admins', { requesterId }),
    );
  }

  /**
   * Test endpoint
   */
  async test() {
    return await firstValueFrom(
      this.kafkaClient.send('auth_test', {}),
    );
  }
}
