import { Injectable, InternalServerErrorException, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;
    private readonly TTL_SEGUNDOS = 300; // 5 minutos
    
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) { throw new InternalServerErrorException('REDIS_URL Indefinida') }

        this.client = new Redis(redisUrl);
    }

    async get(codAss: string): Promise<boolean | null> {
        const valor = await this.client.get(`planoativo:${codAss}`);
        if (valor === null) { return null } else { return valor === 'true' };
    }

    async set(codAss: string, ativo: boolean): Promise<void> {
        await this.client.set(
            `planoativo:${codAss}`,
            String(ativo),
            'EX',
            this.TTL_SEGUNDOS,
        );
    }

    async delete(codAss: string): Promise<void> {
        await this.client.del(`planoativo:${codAss}`);
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.quit();
    }
}