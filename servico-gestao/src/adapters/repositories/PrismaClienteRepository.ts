import { Injectable } from '@nestjs/common';
import { IClienteRepository } from '../../application/ports/IClienteRepository';
import { Cliente } from '../../domain/entities/Cliente';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

@Injectable()
export class PrismaClienteRepository implements IClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Cliente[]> {
    const registros = await this.prisma.cliente.findMany();
    return registros.map(
      (r) => new Cliente(r.codigo, r.nome, r.email),
    );
  }

  async findById(codigo: bigint): Promise<Cliente | null> {
    const registro = await this.prisma.cliente.findUnique({
      where: { codigo },
    });
    if (!registro) return null;
    return new Cliente(registro.codigo, registro.nome, registro.email);
  }
}