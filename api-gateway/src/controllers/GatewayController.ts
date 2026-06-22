import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from '../proxy/ProxyService';

@Controller()
export class GatewayController {
    private readonly servicoGestaoUrl: string;
    private readonly servicoFaturamentoUrl: string;
    private readonly servicoPlanosAtivosUrl: string;
    
    constructor(private readonly proxyService: ProxyService) {
        const gestaoUrl = process.env.SERVICO_GESTAO_URL;
        if (!gestaoUrl) {
            throw new Error('SERVICO_GESTAO_URL not configured');
        }

        const faturamentoUrl = process.env.SERVICO_FATURAMENTO_URL;
        if (!faturamentoUrl) {
            throw new Error('SERVICO_FATURAMENTO_URL not configured');
        }

        const planosAtivosUrl = process.env.SERVICO_PLANOS_ATIVOS_URL;
        if (!planosAtivosUrl) {
            throw new Error('SERVICO_PLANOS_ATIVOS_URL not configured');
        }

        this.servicoGestaoUrl = gestaoUrl;
        this.servicoFaturamentoUrl = faturamentoUrl;
        this.servicoPlanosAtivosUrl = planosAtivosUrl;
    }

    @All('gestao/*')
    async roteandGestao(@Req() req: Request, @Res() res: Response) {
        await this.encaminhar(req, res, this.servicoGestaoUrl);
    }

    @All('registrarpagamento')
    async roteandoFaturamento(@Req() req: Request, @Res() res: Response) {
        await this.encaminhar(req, res, this.servicoFaturamentoUrl);
    }

    @All('planosativos/*')
    async roteandoPlanosAtivos(@Req() req: Request, @Res() res: Response) {
        await this.encaminhar(req, res, this.servicoPlanosAtivosUrl);
    }

    private async encaminhar(
        req: Request,
        res: Response,
        baseUrl: string,
    ): Promise<void> {
        try {
            const data = await this.proxyService.repassar(
                baseUrl,
                req.originalUrl,
                req.method as any,
                req.body,
            );
            res.status(200).json(data);

        } catch (error: any) {
            const status = error.response?.status || 500;
            const message = error.response?.data || { message: 'Erro no Gateway' };
            res.status(status).json(message);
        }
    }
}