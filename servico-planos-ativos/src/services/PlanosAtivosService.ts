import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../cache/RedisService';

@Injectable()
export class PlanosAtivosService {
    // DUVIDA: Declarar os atributos antes ou no constructor ?
    private readonly servicoGestaoUrl = process.env.SERVICO_GESTAO_URL;

    constructor(
        private readonly redisService: RedisService,
        private readonly httpService: HttpService,
    ) {}

    async verificarAtivo(codAss: string): Promise<boolean> {
        const cacheValor = await this.redisService.get(codAss);

        if (cacheValor !== null) {
            console.log(`Retornando Cache - Assinatura: ${codAss}`);
            return cacheValor;
        }

        console.log(`Sem cache salvo - Assinatura: ${codAss}, consultando ServicoGestao`);

        const ativo = await this.consultarServicoGestao(codAss);

        await this.redisService.set(codAss, ativo);

        return ativo;
    }

    private async consultarServicoGestao(codAss: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.servicoGestaoUrl}/gestao/assinaturas/codigo/${codAss}`)
            );

            return response.data.status === 'ATIVO';
        
        } catch (error: any) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    }

    async invalidarCache(codAss: string): Promise<void> {
        await this.redisService.delete(codAss);
        console.log(`Cache invalidado - Assinatura: ${codAss}`);
    }
}