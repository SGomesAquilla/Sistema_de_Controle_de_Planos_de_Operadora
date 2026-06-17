import { Module } from '@nestjs/common';
import { PagamentoController } from './controllers/PagamentoController';
import { PagamentoService } from './services/PagamentoService';
import { PagamentoRepository } from './repositories/PagamentoRepository';
import { RabbitMQService } from './messaging/RabbitMQService';

@Module({
  controllers: [PagamentoController],
  providers: [
    PagamentoService,
    PagamentoRepository,
    RabbitMQService,
  ],
})

export class AppModule {}