import { DomainError } from './DomainError';

export class CustoMensalInvalidoError extends DomainError {
  constructor(motivo: string) {
    super(`CustoMensal inválido: ${motivo}`);
  }
}

export class PeriodoInvalidoError extends DomainError {
  constructor(motivo: string) {
    super(`Período inválido: ${motivo}`);
  }
}