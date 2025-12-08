import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Patch,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import type { UpdateUserDTO } from "src/entities/DTO/updatedUserDTO";
import { UsersRole } from "src/enums/userRole.enum";
import { UsersService } from "src/services/users.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  getProfile(@Request() req) {
    try {
      return this.usersService.getUserFromToken(req.headers["authorization"]);
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch profile");
    }
  }

  @Get("is-admin")
  getIsAdmin(@Request() req) {
    try {
      const user = this.usersService.getUserFromToken(
        req.headers["authorization"]
      );
      return user.role === UsersRole.ADMIN;
    } catch (error) {
      throw new InternalServerErrorException("Failed to get if admin");
    }
  }

  @Patch()
  @UseInterceptors(FileInterceptor("image"))
  async updateStatus(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() user: UpdateUserDTO
  ) {
    try {
      return await this.usersService.updateUser(user, file);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Error while updating order password",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
