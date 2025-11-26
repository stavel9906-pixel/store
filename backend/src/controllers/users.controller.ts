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
    const { userName, email, password } = user;
    try {
      return this.usersService.googleSignIn(userName, email);
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
        "Error while logging in",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
