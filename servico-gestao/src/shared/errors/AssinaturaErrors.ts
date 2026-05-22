import { DomainError } from './DomainError';

export class AssinaturaInvalidaError extends DomainError {
  constructor(motivo: string) {
    super(`Assinatura inválida: ${motivo}`);
  }
}

export class AssinaturaNaoEncontradaError extends DomainError {
  constructor(codigo: number) {
    super(`Assinatura não encontrada: ${codigo}`);
  }
}