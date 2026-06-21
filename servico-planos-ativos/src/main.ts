import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT;
  if (!port) {
    throw new Error('PORT environment variable is required');
  }

  await app.listen(Number(port));
  console.log(`ServicoPlanosAtivos rodando na porta ${port}`)
}

bootstrap();
