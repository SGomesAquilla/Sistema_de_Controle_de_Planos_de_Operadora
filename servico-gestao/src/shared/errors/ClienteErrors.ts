import { DomainError } from './DomainError';

export class ClienteInvalidoError extends DomainError {
  constructor(motivo: string) {
    super(`Cliente inválido: ${motivo}`);
  }
}

export class ClienteNaoEncontradoError extends DomainError {
  constructor(codigo: number) {
    super(`Cliente não encontrado: ${codigo}`);
  }
}