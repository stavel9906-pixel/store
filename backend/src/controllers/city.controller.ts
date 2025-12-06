import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { CitiesService } from "src/services/city.service";

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
