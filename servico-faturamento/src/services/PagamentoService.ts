import { Injectable } from "@nestjs/common";
import { PagamentoRepository } from "../repositories/PagamentoRepository";
import { RabbitMQService } from "../messaging/RabbitMQService";

export interface RegistrarPagamentoDTO {
    dia: number;
    mes: number;
    ano: number;
    codAss: number;
    valorPago: number;
}

@Injectable()
export class PagamentoService {
    constructor(
        private readonly pagamentoRepository: PagamentoRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    async registrar(dto: RegistrarPagamentoDTO): Promise<void> {
        const dataPagamento = new Date(dto.ano, dto.mes - 1, dto.dia);
        const codAss = BigInt(dto.codAss);

        await this.pagamentoRepository.salvar(
            codAss,
            dto.valorPago,
            dataPagamento,
        );

        const payload = {
            codAss: dto.codAss,
            valorPago: dto.valorPago,
            dia: dto.dia,
            mes: dto.mes,
            ano: dto.ano,
        };

        await this.rabbitMQService.publicar(
            'PagamentoPlanoServicoGestao',
            payload,
        );

        await this.rabbitMQService.publicar(
            'PagamentoPlanoServicosAtivos',
            payload,
        );
    }
}
