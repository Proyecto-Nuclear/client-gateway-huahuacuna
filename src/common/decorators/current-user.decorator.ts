import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';

/**
 * Decorator para obtener el usuario actual desde el request
 * Uso en un endpoint: @CurrentUser() user: JwtPayload
 *
 * Debe usarse en endpoints protegidos con JwtAuthGuard
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    // Si se especificó una propiedad, devolver solo esa
    if (data && user) {
      return user[data];
    }

    // Devolver todo el usuario
    return user;
  },
);
