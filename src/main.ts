import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',  // Adres frontendowego serwera
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,  // Jeśli używasz ciasteczek lub sesji
  });
  await app.listen(process.env.PORT || 8887);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT}/graphql`,
  );
}
bootstrap();
