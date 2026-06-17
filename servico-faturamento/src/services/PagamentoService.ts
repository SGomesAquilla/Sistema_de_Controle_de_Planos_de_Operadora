import { Injectable } from "@nestjs/common";
import { PagamentoRepository } from "../repositories/PagamentoRepository";
import { RabbitMQService } from "../messaging/RabbitMQService";

// Por causa do jeito q o NestJS funciona, eu nao posso usar interfaces
// entao tive que usar class no DTO abaixo e adicionar as "!"
// Nesse caso em especifico nao ha problema em usar ! porque o
// DTO eh "vazio" mesmo e vai ser preenchido dinamicamente mais tarde
export class RegistrarPagamentoDTO {
    dia!: number;
    mes!: number;
    ano!: number;
    codAss!: number;
    valorPago!: number;
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
