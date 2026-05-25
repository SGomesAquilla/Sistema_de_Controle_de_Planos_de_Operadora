import { Plano } from '../../domain/entities/Plano';

export interface IPlanoRepository {
    findAll(): Promise<Plano[]>;
    findById(codigo: number): Promise<Plano | null>;
    updateCustoMensal(codigo: number, novoCusto: number): Promise<Plano>;
}