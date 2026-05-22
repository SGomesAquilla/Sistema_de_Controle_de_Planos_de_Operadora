import { PeriodoInvalidoError } from '../../shared/errors/ValueObjectsErrors';

export class Periodo {
  public readonly inicio: Date;
  public readonly fim: Date;

  private static readonly DIAS_FIDELIDADE = 365;

  constructor(inicio: Date, fim: Date) {
    if (!inicio || !fim) {
      throw new PeriodoInvalidoError('datas de início e fim são obrigatórias');
    }
    if (fim <= inicio) {
      throw new PeriodoInvalidoError('data fim deve ser posterior à data início');
    }
    this.inicio = inicio;
    this.fim = fim;
  }

  static criarComFidelidade(dataContratacao: Date): Periodo {
    const fim = new Date(dataContratacao);
    fim.setDate(fim.getDate() + Periodo.DIAS_FIDELIDADE);
    return new Periodo(dataContratacao, fim);
  }

  estaEmFidelidade(dataReferencia: Date): boolean {
    return dataReferencia <= this.fim;
  }

  equals(outro: Periodo): boolean {
    return (
      this.inicio.getTime() === outro.inicio.getTime() &&
      this.fim.getTime() === outro.fim.getTime()
    );
  }
}