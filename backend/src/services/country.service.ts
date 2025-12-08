import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async getAllCountries() {
    return this.countryRepository.find({
      relations: ['cities'], 
    });
  }
}
