import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { IClienteRepository } from '../../ports/IClienteRepository';
import { ClienteNaoEncontradoError } from '../../../shared/errors/ClienteErrors';

export class ListarAssinaturasPorClienteUseCase {
    constructor(
        private readonly assinaturaRepository: IAssinaturaRepository,
        private readonly clienteRepository: IClienteRepository,
    ) {}

    async execute(codCli: bigint): Promise<AssinaturaResponseDTO[]> {
        const cliente = await this.clienteRepository.findById(codCli);
        if (!cliente) { throw new ClienteNaoEncontradoError(codCli) };

        const assinaturas = await this.assinaturaRepository.findByCliente(codCli);
        const agora = new Date();

        return assinaturas.map((assinatura) => ({
            codigo: assinatura.codigo,
            codPlano: assinatura.codPlano,
            codCli: assinatura.codCli,
            custoFinal: assinatura.custoFinal,
            descricao: assinatura.descricao,
            inicioFidelidade: assinatura.inicioFidelidade,
            fimFidelidade: assinatura.fimFidelidade,
            dataUltimoPagamento: assinatura.dataUltimoPagamento,
            status: assinatura.obterStatus(agora),
            emFidelidade: assinatura.estaEmFidelidade(agora),
        }))
    }
}