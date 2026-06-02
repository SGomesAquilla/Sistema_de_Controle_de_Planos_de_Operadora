import { Module } from '@nestjs/common';
import { AssinaturaController } from '../controllers/AssinaturaController';
import { CriarAssinaturaUseCase } from '../../application/use-cases/assinatura/CriarAssinaturaUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasPorClienteUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorClienteUseCase';
import { ListarAssinaturasPorPlanoUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorPlanoUseCase';
import { PrismaAssinaturaRepository } from '../repositories/PrismaAssinaturaRepository';
import { PrismaClienteRepository } from '../repositories/PrismaClienteRepository';
import { PrismaPlanoRepository } from '../repositories/PrismaPlanoRepository';
import { NoOpEventPublisher } from '../../infrastructure/container/NoOpEventPublisher';
import { PrismaModule } from '../../infrastructure/database/prisma/PrismaModule';

@Module({
  imports: [PrismaModule],
  controllers: [AssinaturaController],
  providers: [
    PrismaAssinaturaRepository,
    PrismaClienteRepository,
    PrismaPlanoRepository,
    NoOpEventPublisher,
    {
      provide: CriarAssinaturaUseCase,
      useFactory: (
        assinaturaRepo: PrismaAssinaturaRepository,
        clienteRepo: PrismaClienteRepository,
        planoRepo: PrismaPlanoRepository,
        publisher: NoOpEventPublisher,
      ) =>
        new CriarAssinaturaUseCase(
          assinaturaRepo,
          clienteRepo,
          planoRepo,
          publisher,
        ),
      inject: [
        PrismaAssinaturaRepository,
        PrismaClienteRepository,
        PrismaPlanoRepository,
        NoOpEventPublisher,
      ],
    },
    {
      provide: ListarAssinaturasPorTipoUseCase,
      useFactory: (repo: PrismaAssinaturaRepository) =>
        new ListarAssinaturasPorTipoUseCase(repo),
      inject: [PrismaAssinaturaRepository],
    },
    {
      provide: ListarAssinaturasPorClienteUseCase,
      useFactory: (
        assinaturaRepo: PrismaAssinaturaRepository,
        clienteRepo: PrismaClienteRepository,
      ) =>
        new ListarAssinaturasPorClienteUseCase(assinaturaRepo, clienteRepo),
      inject: [PrismaAssinaturaRepository, PrismaClienteRepository],
    },
    {
      provide: ListarAssinaturasPorPlanoUseCase,
      useFactory: (
        assinaturaRepo: PrismaAssinaturaRepository,
        planoRepo: PrismaPlanoRepository,
      ) =>
        new ListarAssinaturasPorPlanoUseCase(assinaturaRepo, planoRepo),
      inject: [PrismaAssinaturaRepository, PrismaPlanoRepository],
    },
  ],
})
export class AssinaturaModule {}