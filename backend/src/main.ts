import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
