import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { IClienteRepository } from '../../ports/IClienteRepository';
import { ClienteNaoEncontradoError } from '../../../shared/errors/ClienteErrors';
import { Cliente } from 'src/domain/entities/Cliente';

export class ListarAssinaturasPorClienteUseCase {
    constructor(
        private readonly assinaturaRepository: IAssinaturaRepository,
        private readonly clienteRepository: IClienteRepository,
    ) {}

    async execute(codCliente: number): Promise<AssinaturaResponseDTO[]> {
        const cliente = await this.clienteRepository.findById(codCliente);
        if (!cliente) { throw new ClienteNaoEncontradoError(codCliente) };

        const assinaturas = await this.assinaturaRepository.findByCliente(codCliente);
        const agora = new Date();

        return assinaturas.map((assinatura) => ({
            codigo: assinatura.codigo,
            codPlano: assinatura.codPlano,
            codCliente: assinatura.codCliente,
            inicioFidelidade: assinatura.periodo.inicio,
            fimFidelidade: assinatura.periodo.fim,
            dataUltimoPagamento: assinatura.dataUltimoPagamento,
            status: assinatura.obterStatus(agora),
            emFidelidade: assinatura.estaEmFidelidade(agora),
        }))
    }
}