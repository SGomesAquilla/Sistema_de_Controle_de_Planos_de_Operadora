import { AssinaturaInvalidaError } from '../../shared/errors/AssinaturaErrors';
import { Periodo } from '../value-objects/Periodo';

export enum StatusAssinatura {
  ATIVO = 'ATIVO',
  CANCELADO = 'CANCELADO',
}

export class Assinatura {
  public readonly periodo: Periodo;
  private static readonly DIAS_TOLERANCIA_PAGAMENTO = 30;

  private constructor(
    public readonly codigo: number,
    public readonly codPlano: number,
    public readonly codCliente: number,
    public dataUltimoPagamento: Date,
    periodo: Periodo,
  ) {
    this.periodo = periodo;
  }

  // --- Factory Method ---
  static criar(
    codigo: number,
    codPlano: number,
    codCliente: number,
    dataContratacao: Date,
  ): Assinatura {
    if (!codPlano || codPlano <= 0)
      throw new AssinaturaInvalidaError('código do plano inválido');
    if (!codCliente || codCliente <= 0)
      throw new AssinaturaInvalidaError('código do cliente inválido');

    const periodo = Periodo.criarComFidelidade(dataContratacao);

    return new Assinatura(
      codigo,
      codPlano,
      codCliente,
      dataContratacao, // primeiro "pagamento" é a contratação
      periodo,
    );
  }

  // --- Regra de negócio: status ativo ---
  estaAtiva(dataReferencia: Date = new Date()): boolean {
    const limite = new Date(this.dataUltimoPagamento);
    limite.setDate(limite.getDate() + Assinatura.DIAS_TOLERANCIA_PAGAMENTO);
    return dataReferencia <= limite;
  }

  // --- Regra de negócio: status formatado ---
  obterStatus(dataReferencia: Date = new Date()): StatusAssinatura {
    return this.estaAtiva(dataReferencia)
      ? StatusAssinatura.ATIVO
      : StatusAssinatura.CANCELADO;
  }

  // --- Regra de negócio: fidelidade ---
  estaEmFidelidade(dataReferencia: Date = new Date()): boolean {
    return this.periodo.estaEmFidelidade(dataReferencia);
  }

  // --- Ação de domínio: registrar pagamento ---
  registrarPagamento(dataPagamento: Date = new Date()): void {
    if (dataPagamento < this.dataUltimoPagamento)
      throw new AssinaturaInvalidaError(
        'data de pagamento não pode ser anterior ao último pagamento registrado',
      );
    this.dataUltimoPagamento = dataPagamento;
  }
}