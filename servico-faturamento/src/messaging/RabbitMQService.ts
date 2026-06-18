import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager'
import { ChannelWrapper } from 'amqp-connection-manager';
import { InternalServerError } from '../shared/errors/InternalServerError'

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    // Por motivos de estudo e para simplificar o codigo para
    // a entrega no prazo previsto, estarei desconsiderando
    // o aviso de erro nos atributos desta classe. Mas deve se
    // tirar as "!" depois para correto funcionamento e deploy
    private connection!: amqp.AmqpConnectionManager;
    private channel!: ChannelWrapper;

    private readonly filas = [
        'PagamentoPlanoServicoGestao',
        'PagamentoPlanoServicoPlanosAtivos',
    ];

    async onModuleInit(): Promise<void> {
        const rabbitMQUrl = process.env.RABBITMQ_URL;
        if (!rabbitMQUrl) {
            throw new InternalServerError('RabbitMQ_URL nao definida')
        }

        this.connection = amqp.connect([rabbitMQUrl])
        this.channel = this.connection.createChannel({
            json: true,
            setup: async (channel: amqp.Channel) => {
                for (const fila of this.filas) {
                    await channel.assertQueue(fila, { durable: true });
                }
            },
        });

        await this.channel.waitForConnect();
        console.log('RabbitMQ conectado - ServicoFaturamento');
    }

    async publicar(fila: string, mensagem: object): Promise<void> {
        await this.channel.sendToQueue(fila, mensagem);
    }

    async onModuleDestroy(): Promise<void> {
        await this.channel.close()
        await this.connection.close();
    }
}