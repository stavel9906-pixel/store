import { Controller, Get } from '@nestjs/common';
import { CitiesService } from 'src/services/city.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async getAll() {
    return this.citiesService.getAllCities();
  }
}
