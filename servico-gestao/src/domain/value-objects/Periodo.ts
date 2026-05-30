import { PeriodoInvalidoError } from '../../shared/errors/ValueObjectsErrors';

export class Periodo {
  private static readonly DIAS_FIDELIDADE_PADRAO = 365;

  constructor(
    public readonly inicio: Date,
    public readonly fim: Date,
  ) {
    if (!inicio || !fim) {
      throw new PeriodoInvalidoError(
        'datas de início e fim são obrigatórias',
      );
    }

    if (fim <= inicio) {
      throw new PeriodoInvalidoError(
        'data fim deve ser posterior à data início',
      );
    }
  }

  static criarComFidelidadePadrao(
    dataContratacao: Date,
  ): Periodo {
    const fim = new Date(dataContratacao);

    fim.setDate(
      fim.getDate() +
        Periodo.DIAS_FIDELIDADE_PADRAO,
    );

    return new Periodo(
      dataContratacao,
      fim,
    );
  }

  contem(
    dataReferencia: Date,
  ): boolean {
    return (
      dataReferencia >= this.inicio &&
      dataReferencia <= this.fim
    );
  }

  equals(outro: Periodo): boolean {
    return (
      this.inicio.getTime() ===
        outro.inicio.getTime() &&
      this.fim.getTime() ===
        outro.fim.getTime()
    );
  }
}