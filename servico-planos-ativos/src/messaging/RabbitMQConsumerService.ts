import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { PlanosAtivosService } from '../services/PlanosAtivosService';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
    // Por motivos de estudo e para simplificar o codigo para
    // a entrega no prazo previsto, estarei desconsiderando
    // o aviso de erro nos atributos desta classe. Mas deve se
    // tirar as "!" depois para correto funcionamento e deploy
    private connection!: amqp.AmqpConnectionManager;
    private channel!: amqp.ChannelWrapper;
    private readonly FILA = 'PagamentoPlanoServicoPlanosAtivos';

    constructor(private readonly planosAtivosService: PlanosAtivosService) {}

    async onModuleInit(): Promise<void> {
        const rabbitMQUrl = process.env.RABBITMQ_URL;
        if (!rabbitMQUrl) {
            throw new Error('RABBITMQ_URL nao definida');
        }

        this.connection = amqp.connect([rabbitMQUrl]);

        this.channel = this.connection.createChannel({
            json: true,
            setup: async (channel: amqp.Channel) => {
                await channel.assertQueue(this.FILA, { durable: true });
                await channel.consume(this.FILA, (msg) => this.handleMessage(msg, channel));
            },
        });

        await this.channel.waitForConnect();
        console.log(`RabbitMQ conectado - consumindo fila "${this.FILA}"`);
    }

    private async handleMessage(
        msg: ConsumeMessage | null,
        channel: amqp.Channel,
    ): Promise<void> {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString());

            await this.planosAtivosService.invalidarCache(String(payload.codAss));

            channel.ack(msg);
        } catch (error) {
            console.error('Erro ao processar invalidação de cache:', error);
            channel.nack(msg, false, false);
        }
    }

    async onModuleDestroy(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }
}