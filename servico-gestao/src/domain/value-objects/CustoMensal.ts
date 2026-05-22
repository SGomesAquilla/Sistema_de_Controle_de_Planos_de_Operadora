import { CustoMensalInvalidoError } from '../../shared/errors/ValueObjectsErrors';

export class CustoMensal {
    public readonly valor: number;

    constructor(valor: number) {
        if (valor <= 0) {
            throw new CustoMensalInvalidoError('Deve ser maior que zero');
        }
        if (!isFinite(valor)) {
            throw new CustoMensalInvalidoError('Deve ser um valor finito');
        }
        this.valor = valor;
    }

    equals(outro: CustoMensal): boolean {
        return this.valor === outro.valor;
  }
}