import { NestFactory } from "@nestjs/core";
import "dotenv/config";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, logger: ['error', 'warn', 'log'] });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
