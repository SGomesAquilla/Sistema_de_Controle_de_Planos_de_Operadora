import { DomainError } from './DomainError';

export class AssinaturaInvalidaError extends DomainError {
  constructor(motivo: string) {
    super(`Assinatura inválida: ${motivo}`);
  }
}

export class AssinaturaNaoEncontradaError extends DomainError {
  constructor(codigo: bigint) {
    super(`Assinatura não encontrada: ${codigo}`);
  }
}