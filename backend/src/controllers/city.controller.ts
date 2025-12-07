import { Controller, Get, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { CitiesService } from "src/services/city.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("cities")
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async getAll() {
    try {
      return this.citiesService.getAllCities();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to get cities"
      );
    }
  }
}
