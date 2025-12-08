import { Controller, Get, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthAndRoleGuard } from "src/auth/jwt-auth.gaurd";
import { Roles } from "src/auth/roles.decorator";
import { UsersRole } from "src/enums/userRole.enum";
import { CountriesService } from "src/services/country.service";

@UseGuards(AuthAndRoleGuard)
@Roles(UsersRole.ADMIN, UsersRole.USER)
@Controller("countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAll() {
    try {
      return this.countriesService.getAllCountries();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to fetch countries"
      );
    }
  }
}
