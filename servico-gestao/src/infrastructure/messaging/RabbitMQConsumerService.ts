import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { ProcessarPagamentoUseCase } from '../../application/use-cases/pagamento/ProcessarPagamentoUseCase';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.AmqpConnectionManager;
  private channel!: amqp.ChannelWrapper;

  private readonly FILA = 'PagamentoPlanoServicoGestao';

  constructor(
    private readonly processarPagamentoUseCase: ProcessarPagamentoUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    const rabbitMQUrl = process.env.RABBITMQ_URL;
    if (!rabbitMQUrl) {
      throw new Error('Status code: 500 / RABBITMQ_URL nao foi definido')
    }

    this.connection = amqp.connect([rabbitMQUrl])
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (channel: amqp.Channel) => {
        await channel.assertQueue(this.FILA, { durable: true });
        await channel.consume(this.FILA, (msg) => this.handleMessage(msg, channel));
      },
    });

    await this.channel.waitForConnect();
    console.log(`✅ RabbitMQ conectado — consumindo fila "${this.FILA}"`);
  }

  private async handleMessage(
    msg: ConsumeMessage | null,
    channel: amqp.Channel,
  ): Promise<void> {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());

      await this.processarPagamentoUseCase.execute({
        codAss: BigInt(payload.codAss),
        dia: payload.dia,
        mes: payload.mes,
        ano: payload.ano,
        valorPago: payload.valorPago,
      });

      channel.ack(msg);
      console.log(`✅ Pagamento processado — assinatura ${payload.codAss}`);
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      channel.nack(msg, false, false);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}