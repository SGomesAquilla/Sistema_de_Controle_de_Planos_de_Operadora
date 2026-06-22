import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  if (!port) {
    throw new Error('port is undefinied')
  }
  await app.listen(Number(port));
  console.log(`API Gateway rodando na porta ${port}`);
}

bootstrap();
