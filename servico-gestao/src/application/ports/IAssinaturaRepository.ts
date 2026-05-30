import { Assinatura, StatusAssinatura } from '../../domain/entities/Assinatura';

export interface IAssinaturaRepository {
  save(assinatura: Assinatura): Promise<Assinatura>;
  findAll(): Promise<Assinatura[]>;
  findById(codigo: bigint): Promise<Assinatura | null>;
  findByCliente(codCli: bigint): Promise<Assinatura[]>;
  findByPlano(codPlano: bigint): Promise<Assinatura[]>;
  findByStatus(status: StatusAssinatura): Promise<Assinatura[]>;
}