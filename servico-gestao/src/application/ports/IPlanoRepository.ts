import { Plano } from '../../domain/entities/Plano';

export interface IPlanoRepository {
    findAll(): Promise<Plano[]>;
    findById(codigo: bigint): Promise<Plano | null>;
    updateCustoMensal(codigo: bigint, novoCusto: number): Promise<Plano>;
}