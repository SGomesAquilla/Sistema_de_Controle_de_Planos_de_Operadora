import { PlanoInvalidoError } from '../../shared/errors/PlanoErrors';
import { CustoMensal } from '../value-objects/CustoMensal';

export class Plano {
    public custoMensal: CustoMensal;

    constructor(
        public readonly codigo: bigint,
        public nome: string,
        custoMensal: number,
        public data: Date,
        public readonly descricao: string
    ) {
        this.custoMensal = new CustoMensal(custoMensal);
        this.validar();
    }

    atualizarCusto(novoCusto: number): void {
        this.custoMensal = new CustoMensal(novoCusto);
        this.data = new Date();
    }

    private validar(): void {
        if (!this.nome || this.nome.trim().length === 0) {
            throw new PlanoInvalidoError('nome não pode ser vazio');
        }
    }
}