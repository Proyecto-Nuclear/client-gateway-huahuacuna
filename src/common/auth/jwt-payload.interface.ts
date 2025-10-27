export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PADRINO = 'PADRINO',
}

export interface JwtPayload {
  sub: number; // User ID
  email: string;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}