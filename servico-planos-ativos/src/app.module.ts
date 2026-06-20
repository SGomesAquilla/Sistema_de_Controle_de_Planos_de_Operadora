import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanosAtivosController } from './controllers/PlanosAtivosController';
import { PlanosAtivosService } from './services/PlanosAtivosService';
import { RedisService } from './cache/RedisService';
import { RabbitMQConsumerService } from './messaging/RabbitMQConsumerService';

@Module({
  imports: [HttpModule],
  controllers: [PlanosAtivosController],
  providers: [PlanosAtivosService, RedisService, RabbitMQConsumerService],
})
export class AppModule {}
