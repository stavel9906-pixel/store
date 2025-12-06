import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { UpdateUserDTO } from "src/entities/DTO/updatedUserDTO";
import { User } from "src/entities/user.entity";
import { UsersRole } from "src/enums/userRole.enum";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { UsersService } from "src/services/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async register(@Body() user: User) {
    const { userName, email, password } = user;
    try {
      return this.usersService.register(userName, email, password);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Error In Register",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("signin")
  async googleSignIn(@Body() user: User) {
    const { userName, email, profile } = user;
    try {
      return this.usersService.googleSignIn(userName, email, profile);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Error in signing in with google",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("login")
  async login(@Body() user: User) {
    try {
      const { email, password } = user;

      return await this.usersService.login(email, password);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Error while logging in",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

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
  // FormData.append("profile", file) לוקח את הקובץ הזה מהבקשה
  @UseInterceptors(FileInterceptor("profile"))
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
