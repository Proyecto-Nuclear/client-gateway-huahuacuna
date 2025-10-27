import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../auth/jwt-payload.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException('Authorization header is missing.');
		}

		const [type, token] = authHeader.split(' ');
		if (type !== 'Bearer' || !token) {
			throw new UnauthorizedException('Malformed authorization header.');
		}

		try {
			request.user = this.jwtService.verify<JwtPayload>(token);
			return true;
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new UnauthorizedException(
					`Token validation failed: ${error.message}`,
				);
			}
			throw new UnauthorizedException(
				'Token validation failed due to an unknown error.',
			);
		}
	}
}
