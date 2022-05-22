import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors();

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application successfully started on port ${port}`);
}
bootstrap();
