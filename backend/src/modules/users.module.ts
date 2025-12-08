
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/controllers/users.controller';
import { User } from 'src/entities/user.entity';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { UsersService } from 'src/services/users.service';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CloudinaryModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
