import { ClienteInvalidoError } from '../../shared/errors/ClienteErrors';

export class Cliente {
    constructor(
        public readonly codigo: number,
        public readonly nome: string,
        public readonly email: string
    ) {
        this.validar();
    }

    private validar(): void {
        if (!this.nome || this.nome.trim().length === 0) {
            throw new ClienteInvalidoError('nome não pode ser vazio');
        }
        if (!this.email || !this.email.includes('@')) {
            throw new ClienteInvalidoError('email inválido');
        }
    }
}