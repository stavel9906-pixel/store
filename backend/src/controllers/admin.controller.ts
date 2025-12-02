import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { AuthGuard } from "@nestjs/passport";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";

@UseGuards(new AuthAndRoleGuard([UsersRole.ADMIN]))
@Roles(UsersRole.ADMIN)
@Controller("admin")
export class AdminController {
  @Get("some-secret")
  getSecret() {
    return { secret: "for admin only" };
  }
}
