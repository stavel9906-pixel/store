import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CountriesController } from "src/controllers/country.controller";
import { Country } from "src/entities/country.entity";
import { CountriesService } from "src/services/country.service";

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
