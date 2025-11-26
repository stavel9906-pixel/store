import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { User } from "src/entities/user.entity";
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
      throw new BadRequestException("Registration failed");
    }
  }

  @Post("login")
  async login(
    @Body() user: User // password optional for Google login
  ) {
    try {
      const { email, password } = user;

      const result = await this.usersService.login(email, password);
      return result; // במקרה של הצלחה מחזיר את האובייקט עם פרטי המשתמש
    } catch (err: any) {
      if (err instanceof UnauthorizedError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
