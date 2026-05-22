import { PlanoInvalidoError } from '../../shared/errors/PlanoErrors';
import { CustoMensal } from '../value-objects/CustoMensal';

export class Plano {
    public custoMensal: CustoMensal;

    constructor(
        public readonly codigo: number,
        public nome: string,
        custoMensal: number,
        public readonly data: Date,
        public readonly descricao: string
    ) {
        this.custoMensal = new CustoMensal(custoMensal);
        this.validar();
    }

    atualizarCustor(novoCusto: number): void {
        this.custoMensal = new CustoMensal(novoCusto);
    }

    private validar(): void {
        if (!this.nome || this.nome.trim().length === 0) {
            throw new PlanoInvalidoError('nome não pode ser vazio');
        }
    }
}