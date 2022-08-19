import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import '@nestjs/config';
import { Logger } from '@nestjs/common';
import { PORT } from './@config/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>(PORT);

  await app.listen(port);
  Logger.log(`http://localhost:${port}/`);
}
bootstrap();
