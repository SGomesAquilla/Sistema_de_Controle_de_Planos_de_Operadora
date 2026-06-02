import { AssinaturaInvalidaError } from '../../shared/errors/AssinaturaErrors';
import { Periodo } from '../value-objects/Periodo';

export enum StatusAssinatura {
  ATIVO = 'ATIVO',
  CANCELADO = 'CANCELADO',
}

export class Assinatura {
  private static readonly DIAS_VALIDADE_PAGAMENTO = 30;

  private constructor(
    public readonly codigo: bigint,
    public readonly codPlano: bigint,
    public readonly codCli: bigint,
    private periodoFidelidade: Periodo,
    public dataUltimoPagamento: Date,
    public readonly custoFinal: number,
    public readonly descricao: string,
  ) {}

  get inicioFidelidade(): Date {
    return this.periodoFidelidade.inicio;
  }

  get fimFidelidade(): Date {
    return this.periodoFidelidade.fim;
  }

  static criar(
    codigo: bigint,
    codPlano: bigint,
    codCli: bigint,
    dataContratacao: Date,
    custoFinal: number,
    descricao: string,
  ): Assinatura {
    if (codPlano <= 0n) {
      throw new AssinaturaInvalidaError(
        'código do plano inválido',
      );
    }

    if (codCli <= 0n) {
      throw new AssinaturaInvalidaError(
        'código do cliente inválido',
      );
    }

    if (custoFinal < 0) {
      throw new AssinaturaInvalidaError(
        'custo final inválido',
      );
    }

    const periodoFidelidade =
      Periodo.criarComFidelidadePadrao(
        dataContratacao,
      );

    return new Assinatura(
      codigo,
      codPlano,
      codCli,
      periodoFidelidade,
      dataContratacao,
      custoFinal,
      descricao,
    );
  }

  static reconstituir(
    codigo: bigint,
    codPlano: bigint,
    codCli: bigint,
    inicioFidelidade: Date,
    fimFidelidade: Date,
    dataUltimoPagamento: Date,
    custoFinal: number,
    descricao: string,
  ): Assinatura {
    const periodo = new Periodo(inicioFidelidade, fimFidelidade);
    return new Assinatura(
      codigo,
      codPlano,
      codCli,
      periodo,
      dataUltimoPagamento,
      custoFinal,
      descricao,
    );
  }

  estaAtiva(
    dataReferencia: Date = new Date(),
  ): boolean {
    const validadePagamento =
      new Date(this.dataUltimoPagamento);

    validadePagamento.setDate(
      validadePagamento.getDate() +
        Assinatura.DIAS_VALIDADE_PAGAMENTO,
    );

    return dataReferencia <= validadePagamento;
  }

  obterStatus(
    dataReferencia: Date = new Date(),
  ): StatusAssinatura {
    return this.estaAtiva(dataReferencia)
      ? StatusAssinatura.ATIVO
      : StatusAssinatura.CANCELADO;
  }

  estaEmFidelidade(
    dataReferencia: Date = new Date(),
  ): boolean {
    return this.periodoFidelidade.contem(
      dataReferencia,
    );
  }

  registrarPagamento(
    dataPagamento: Date,
  ): void {
    if (
      dataPagamento <
      this.dataUltimoPagamento
    ) {
      throw new AssinaturaInvalidaError(
        'data de pagamento não pode ser anterior ao último pagamento registrado',
      );
    }

    this.dataUltimoPagamento =
      dataPagamento;
  }

  alterarPeriodoFidelidade(
    novoPeriodo: Periodo,
  ): void {
    this.periodoFidelidade =
      novoPeriodo;
  }
}