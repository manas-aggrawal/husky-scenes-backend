import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums';
import { JWT_SECRET } from '../constants/app.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    if (requiredRoles.includes(Role.PUBLIC)) {
      return true;
    }

    const {
      headers: { authorization: token },
    } = context.switchToHttp().getRequest();

    // Extract token from Authorization header
    const jwtToken = token.split(' ')[1];

    // Verify token, this will automatically check expiration
    const decoded = jwt.verify(jwtToken, JWT_SECRET);

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    return requiredRoles.includes(decoded.role) && decoded;
  }
}
