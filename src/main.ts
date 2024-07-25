import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT}/graphql`,
  );
}
bootstrap();
