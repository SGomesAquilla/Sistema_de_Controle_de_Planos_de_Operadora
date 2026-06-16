import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PagamentpRepository {
    private prisma: PrismaClient;

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        
        this.prisma = new PrismaClient({adapter});
    }

    async salvar(
        codAss: bigint,
        valorPago: number,
        dataPagamento: Date,
    ) {
        return this.prisma.pagamento.create({
            data: {
                codAss,
                valorPago,
                dataPagamento,
            },
        });
    }
}