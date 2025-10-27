import { SetMetadata } from '@nestjs/common';
import { Role } from '../auth/jwt-payload.interface';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar qué roles pueden acceder a un endpoint
 * Uso: @Roles(Role.SUPER_ADMIN, Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
