import { Cliente } from '../../domain/entities/Cliente';

export interface IClienteRepository {
    findAll(): Promise<Cliente[]>;
    findById(codigo: bigint): Promise<Cliente | null>;
}