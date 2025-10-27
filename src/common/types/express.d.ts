import { JwtPayload } from '../auth/jwt-payload.interface';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}