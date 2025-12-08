import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users.module';
import { AuthAndRoleGuard } from 'src/auth/jwt-auth.gaurd';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { CloudinaryModule } from './cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { GoogleTokenStrategy } from 'src/google/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    CloudinaryModule,
    PassportModule.register({ defaultStrategy: 'google-token' })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthAndRoleGuard, GoogleTokenStrategy],
  exports: [AuthService, AuthAndRoleGuard],
})
export class AuthModule {}
