import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { ProcessarPagamentoDTO } from '../../dtos/ProcessarPagamentoDTO';
import { AssinaturaNaoEncontradaError } from '../../../shared/errors/AssinaturaErrors';

export class ProcessarPagamentoUseCase {
  constructor(private readonly assinaturaRepository: IAssinaturaRepository) {}

  async execute(dto: ProcessarPagamentoDTO): Promise<void> {
    const assinatura = await this.assinaturaRepository.findById(dto.codAss);

    if (!assinatura) {
      throw new AssinaturaNaoEncontradaError(dto.codAss);
    }

    const dataPagamento = new Date(dto.ano, dto.mes - 1, dto.dia);

    assinatura.registrarPagamento(dataPagamento);

    await this.assinaturaRepository.save(assinatura);
  }
}