import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(Strategy, 'google-token') {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(req: Request): Promise<any> {
    const token = req.body.token; 

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.validateGoogleUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid Google Token');
    }

    return user;
  }
}