import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { AssinaturaNaoEncontradaError } from '../../../shared/errors/AssinaturaErrors';

export class ListarAssinaturaPorCodigoUseCase {
    constructor(
        private readonly assinaturaRepository: IAssinaturaRepository,
    ) {}

    async execute(codigo: bigint): Promise<AssinaturaResponseDTO> {
        const assinatura = await this.assinaturaRepository.findById(codigo);
        if (!assinatura) { throw new AssinaturaNaoEncontradaError(codigo) };

        const agora = new Date();

        return {
            codigo: assinatura.codigo,
            codCli: assinatura.codCli,
            codPlano: assinatura.codPlano,
            custoFinal: assinatura.custoFinal,
            descricao: assinatura.descricao,
            inicioFidelidade: assinatura.inicioFidelidade,
            fimFidelidade: assinatura.fimFidelidade,
            dataUltimoPagamento: assinatura.dataUltimoPagamento,
            status: assinatura.obterStatus(agora),
            emFidelidade: assinatura.estaEmFidelidade(agora),  
        };
    }
}