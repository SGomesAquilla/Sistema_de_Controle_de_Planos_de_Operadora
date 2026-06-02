import { Module } from '@nestjs/common';
import { ClienteController } from '../controllers/ClienteController';
import { ListarClientesUseCase } from '../../application/use-cases/cliente/ListarClientesUseCase';
import { PrismaClienteRepository } from '../repositories/PrismaClienteRepository';
import { PrismaModule } from '../../infrastructure/database/prisma/PrismaModule';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [
    PrismaClienteRepository,
    {
      provide: 'IClienteRepository',
      useExisting: PrismaClienteRepository,
    },
    {
      provide: ListarClientesUseCase,
      useFactory: (repo: PrismaClienteRepository) =>
        new ListarClientesUseCase(repo),
      inject: [PrismaClienteRepository],
    },
  ],
})
export class ClienteModule {}