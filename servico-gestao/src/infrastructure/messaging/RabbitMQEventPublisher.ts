import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { IDomainEvent, IEventPublisher } from '../../application/ports/IEventPublisher';

@Injectable()
export class RabbitMQEventPublisher
  implements IEventPublisher, OnModuleInit, OnModuleDestroy
{
  private connection!: amqp.AmqpConnectionManager;
  private channel!: amqp.ChannelWrapper;

  async onModuleInit(): Promise<void> {
    const rabbitMQUrl = process.env.RABBITMQ_URL;
    if (!rabbitMQUrl) {
      throw new Error('Status code: 500 / RABBITMQ_URL nao foi definido')
    }

    this.connection = amqp.connect([rabbitMQUrl])
    this.channel = this.connection.createChannel({
      json: true,
      setup: async (channel: amqp.Channel) => {
        await channel.assertQueue('assinatura.criada', { durable: true });
      },
    });

    await this.channel.waitForConnect();
    console.log('✅ RabbitMQEventPublisher conectado — ServicoGestao');
  }

  async publish(event: IDomainEvent): Promise<void> {
    await this.channel.sendToQueue(event.eventName, event.payload);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}