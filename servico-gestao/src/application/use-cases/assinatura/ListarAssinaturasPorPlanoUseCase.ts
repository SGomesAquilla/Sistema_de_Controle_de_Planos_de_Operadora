import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { IPlanoRepository } from '../../ports/IPlanoRepository';
import { PlanoNaoEncontradoError } from '../../../shared/errors/PlanoErrors';

export class ListarAssinaturasPorPlanoUseCase {
    constructor(
        private readonly assinaturaRepository: IAssinaturaRepository,
        private readonly planoRepository: IPlanoRepository,
    ) {}

    async execute(codPlano: bigint): Promise<AssinaturaResponseDTO[]> {
        const plano = await this.planoRepository.findById(codPlano);
        if (!plano) { throw new PlanoNaoEncontradoError(codPlano); }

        const assinaturas = await this.assinaturaRepository.findByPlano(codPlano);
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
        }));
    }
}