import { Assinatura, StatusAssinatura } from '../../domain/entities/Assinatura';

export interface IAssinaturaRepository {
  save(assinatura: Assinatura): Promise<Assinatura>;
  findAll(): Promise<Assinatura[]>;
  findById(codigo: number): Promise<Assinatura | null>;
  findByCliente(codCliente: number): Promise<Assinatura[]>;
  findByPlano(codPlano: number): Promise<Assinatura[]>;
  findByStatus(status: StatusAssinatura): Promise<Assinatura[]>;
}