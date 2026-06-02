import { Injectable } from '@nestjs/common';
import { IAssinaturaRepository } from '../../application/ports/IAssinaturaRepository';
import { Assinatura, StatusAssinatura } from '../../domain/entities/Assinatura';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

@Injectable()
export class PrismaAssinaturaRepository implements IAssinaturaRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): Assinatura {
    return Assinatura.reconstituir(
      r.codigo,
      r.codPlano,
      r.codCli,
      r.inicioFidelidade,
      r.fimFidelidade,
      r.dataUltimoPagamento,
      r.custoFinal,
      r.descricao,
    );
  }

  async save(assinatura: Assinatura): Promise<Assinatura> {
    const registro = await this.prisma.assinatura.create({
      data: {
        codPlano: assinatura.codPlano,
        codCli: assinatura.codCli,
        inicioFidelidade: assinatura.inicioFidelidade,
        fimFidelidade: assinatura.fimFidelidade,
        dataUltimoPagamento: assinatura.dataUltimoPagamento,
        custoFinal: assinatura.custoFinal,
        descricao: assinatura.descricao,
      },
    });
    return this.toEntity(registro);
  }

  async findAll(): Promise<Assinatura[]> {
    const registros = await this.prisma.assinatura.findMany();
    return registros.map(this.toEntity);
  }

  async findById(codigo: bigint): Promise<Assinatura | null> {
    const registro = await this.prisma.assinatura.findUnique({
      where: { codigo },
    });
    if (!registro) return null;
    return this.toEntity(registro);
  }

  async findByCliente(codCli: bigint): Promise<Assinatura[]> {
    const registros = await this.prisma.assinatura.findMany({
      where: { codCli },
    });
    return registros.map(this.toEntity);
  }

  async findByPlano(codPlano: bigint): Promise<Assinatura[]> {
    const registros = await this.prisma.assinatura.findMany({
      where: { codPlano },
    });
    return registros.map(this.toEntity);
  }

  async findByStatus(status: StatusAssinatura): Promise<Assinatura[]> {
    const todas = await this.prisma.assinatura.findMany();
    const agora = new Date();
    return todas
      .map(this.toEntity)
      .filter(
        (a) => a.obterStatus(agora) === status,
      );
  }
}