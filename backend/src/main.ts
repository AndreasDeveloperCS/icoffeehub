import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({ origin: config.get<string>('CORS_ORIGIN', '*'), credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const configuredPort = config.get<string>('PORT');
  const port = Number.parseInt(configuredPort ?? '4000', 10) || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`iCoffeeHub API listening on http://localhost:${port}/api`);
}
bootstrap();
