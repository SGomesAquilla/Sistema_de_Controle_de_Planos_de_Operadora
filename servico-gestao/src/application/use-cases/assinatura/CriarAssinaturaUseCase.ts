import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { IClienteRepository } from '../../ports/IClienteRepository';
import { IPlanoRepository } from '../../ports/IPlanoRepository';
import { IEventPublisher } from '../../ports/IEventPublisher';
import { CriarAssinaturaDTO } from '../../dtos/CriarAassinaturaDTO';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { Assinatura } from '../../../domain/entities/Assinatura';
import { ClienteNaoEncontradoError } from '../../../shared/errors/ClienteErrors';
import { PlanoNaoEncontradoError } from '../../../shared/errors/PlanoErrors';

export class CriarAssinaturaUseCase {
    constructor(
        private readonly assinaturaRepository: IAssinaturaRepository,
        private readonly clienteRepository: IClienteRepository,
        private readonly planoRepository: IPlanoRepository,
        private readonly eventPublisher: IEventPublisher,
    ) {}

    async execute(dto: CriarAssinaturaDTO): Promise<AssinaturaResponseDTO> {
        const cliente = await this.clienteRepository.findById(dto.codCliente);
        if (!cliente) { throw new ClienteNaoEncontradoError(dto.codCliente); }

        const plano = await this.planoRepository.findById(dto.codPlano);
        if (!plano) { throw new PlanoNaoEncontradoError(dto.codPlano); }

        const dataContratacao = dto.dataContratacao ?? new Date();

        const assinatura = Assinatura.criar(
            0,
            dto.codPlano,
            dto.codCliente,
            dataContratacao,
        );

        const assinaturaSalva = await this.assinaturaRepository.save(assinatura);

        await this.eventPublisher.publish({
            eventName: 'assinatura.criada',
            occurredAt: new Date(),
            payload: {
                codAssinatura: assinaturaSalva.codigo,
                codCliente: assinaturaSalva.codCliente,
                codPlano: assinaturaSalva.codPlano,
            },
        });

        return this.toResponseDTO(assinaturaSalva);
    }

    private toResponseDTO(assinatura: Assinatura): AssinaturaResponseDTO {
        const agora = new Date();
        return {
        codigo: assinatura.codigo,
        codPlano: assinatura.codPlano,
        codCliente: assinatura.codCliente,
        inicioFidelidade: assinatura.periodo.inicio,
        fimFidelidade: assinatura.periodo.fim,
        dataUltimoPagamento: assinatura.dataUltimoPagamento,
        status: assinatura.obterStatus(agora),
        emFidelidade: assinatura.estaEmFidelidade(agora),
        };
    }
}