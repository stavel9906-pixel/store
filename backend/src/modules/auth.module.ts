import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users.module';
import { AuthAndRoleGuard } from 'src/auth/jwt-auth.gaurd';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { CloudinaryModule } from './cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthAndRoleGuard],
  exports: [AuthService, AuthAndRoleGuard],
})
export class AuthModule {}
