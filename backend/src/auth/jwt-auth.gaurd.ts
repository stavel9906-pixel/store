import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UsersRole } from 'src/enums/userRole.enum';

@Injectable()
export class AuthAndRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {} 

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UsersRole[]>('roles', [context.getHandler(), context.getClass()]);

    if (!roles || roles.length === 0) {
      throw new ForbiddenException('No roles defined for this route');
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Authorization header missing');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Invalid token');

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY || 'default_secret');
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!roles.includes(payload.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    request.user = payload;
    return true;
  }
}
