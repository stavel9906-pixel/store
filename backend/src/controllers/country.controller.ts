import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { CountriesService } from "src/services/country.service";

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
