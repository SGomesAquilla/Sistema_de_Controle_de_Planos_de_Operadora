import { DomainError } from './DomainError';

export class PlanoInvalidoError extends DomainError {
  constructor(motivo: string) {
    super(`Plano inválido: ${motivo}`);
  }
}

export class PlanoNaoEncontradoError extends DomainError {
  constructor(codigo: bigint) {
    super(`Plano não encontrado: ${codigo}`);
  }
}