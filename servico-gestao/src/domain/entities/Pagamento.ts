import { DomainError } from '../../shared/errors/DomainError';

export class PagamentoInvalidoError extends DomainError {
    constructor(motivo: string) {
        super(`Erro no pagamento: ${motivo}`);
    }
}

export class Pagamento {
    constructor(
        public readonly codigo: bigint,
        public readonly codAss: bigint,
        public readonly valorPago: number,
        public readonly dataPagamento: Date
    ) {
        this.validar()
    }

    private validar(): void {
        if (this.codigo <= 0n) {
            throw new PagamentoInvalidoError('código inválido');
        }

        if (this.codAss <= 0n) {
            throw new PagamentoInvalidoError('valor pago deve ser maior que zero');
        }

        if (!this.dataPagamento || isNaN(this.dataPagamento.getTime())) {
            throw new PagamentoInvalidoError('data do pagamento inválida');
        }
    }
}