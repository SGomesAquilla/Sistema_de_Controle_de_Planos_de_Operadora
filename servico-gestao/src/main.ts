import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Resolve serialização de BigInt no JSON
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  await app.listen(3000);
}
bootstrap();