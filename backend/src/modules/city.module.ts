import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitiesController } from "src/controllers/city.controller";
import { City } from "src/entities/city.entity";
import { CitiesService } from "src/services/city.service";

@Module({
  imports: [TypeOrmModule.forFeature([City])], // מאפשר inject של repository
  providers: [CitiesService],
  controllers: [CitiesController],
})
export class CitiesModule {}
