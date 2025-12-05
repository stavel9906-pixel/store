import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersRole } from 'src/enums/userRole.enum';

@Injectable()
export class AuthAndRoleGuard implements CanActivate {
  constructor(private requiredRoles: UsersRole[] = []) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      Logger.error('Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      Logger.error('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format');
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY || 'default_secret');
    } catch (err) {
      Logger.error('Invalid or expired token');
      throw new UnauthorizedException('Invalid or expired token');
    }

    // אם הגארד דורש תפקידים
    if (this.requiredRoles.length > 0) {
      if (!payload.role || !this.requiredRoles.includes(payload.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
