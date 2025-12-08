import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/entities/user.entity";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { AuthService } from "src/services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() user: User) {
    const { userName, email, password } = user;
    try {
      return await this.authService.register(userName, email, password);
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

  @Post("google-login")
  @UseGuards(AuthGuard("google-token")) 
  async googleLogin(@Req() req: any) {
    try {
      const jwt = await this.authService.generateToken(req.user);
      return {
        token: jwt,
      };
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Error signing in with Google",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("login")
  async login(@Body() user: User) {
    try {
      const { email, password } = user;

      return await this.authService.login(email, password);
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
}
