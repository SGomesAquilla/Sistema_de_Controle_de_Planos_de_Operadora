import { DomainError } from './Assinatura';

export { DomainError } from '../../shared/errors/DomainError';

export class AssinaturaInvalidaError extends DomainError {
    constructor(motivo: string) {
        super(`Assinatura inválida: ${motivo}`);
    }
}

export class Assinatura {
    constructor(
        public readonly codigo: number,
        public readonly codPlano: number,
        public readonly codCli: number,
        public readonly inicioFidelidade: Date,
        public readonly fimFidelidade: Date,
        public readonly dataUltimoPagamento: Date
    ) {
        this.validar()
    }

    private validar(): void {
        //Codigo
    }
}