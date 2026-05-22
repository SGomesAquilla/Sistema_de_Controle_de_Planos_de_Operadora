import { DomainError } from '../../shared/errors/DomainError';

export class PagamentoInvalidoError extends DomainError {
    constructor(motivo: string) {
        super(`Erro no pagamento: ${motivo}`);
    }
}

export class Pagamento {
    constructor(
        public readonly codigo: number,
        public readonly codAss: number,
        public readonly valorPago: number,
        public readonly dataPagamento: Date
    ) {
        this.validar()
    }

    private validar(): void {

    }
}