import { Controller, Get } from '@nestjs/common';
import { CountriesService } from 'src/services/country.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAll() {
    return this.countriesService.getAllCountries();
  }
}
