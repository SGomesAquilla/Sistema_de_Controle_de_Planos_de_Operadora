import { Injectable } from '@nestjs/common';
import { IPlanoRepository } from '../../application/ports/IPlanoRepository';
import { Plano } from '../../domain/entities/Plano';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

@Injectable()
export class PrismaPlanoRepository implements IPlanoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Plano[]> {
    const registros = await this.prisma.plano.findMany();
    return registros.map(
      (r) => new Plano(r.codigo, r.nome, r.custoMensal, r.data, r.descricao),
    );
  }

  async findById(codigo: bigint): Promise<Plano | null> {
    const registro = await this.prisma.plano.findUnique({
      where: { codigo },
    });
    if (!registro) return null;
    return new Plano(
      registro.codigo,
      registro.nome,
      registro.custoMensal,
      registro.data,
      registro.descricao
    );
  }

  async updateCustoMensal(codigo: bigint, novoCusto: number): Promise<Plano> {
    const registro = await this.prisma.plano.update({
      where: { codigo },
      data: {
        custoMensal: novoCusto,
        data: new Date(),
      },
    });
    return new Plano(
      registro.codigo,
      registro.nome,
      registro.custoMensal,
      registro.data,
      registro.descricao
    );
  }
}