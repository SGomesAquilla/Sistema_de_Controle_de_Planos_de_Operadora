import { Module } from '@nestjs/common';
import { PlanoController } from '../controllers/PlanoController';
import { ListarPlanosUseCase } from '../../application/use-cases/plano/ListarPlanosUseCase';
import { AtualizarCustoPlanoUseCase } from '../../application/use-cases/plano/AtualizarCustoPlanoUseCase';
import { PrismaPlanoRepository } from '../repositories/PrismaPlanoRepository';
import { PrismaModule } from '../../infrastructure/database/prisma/PrismaModule';

@Module({
  imports: [PrismaModule],
  controllers: [PlanoController],
  providers: [
    PrismaPlanoRepository,
    {
      provide: 'IPlanoRepository',
      useExisting: PrismaPlanoRepository,
    },
    {
      provide: ListarPlanosUseCase,
      useFactory: (repo: PrismaPlanoRepository) =>
        new ListarPlanosUseCase(repo),
      inject: [PrismaPlanoRepository],
    },
    {
      provide: AtualizarCustoPlanoUseCase,
      useFactory: (repo: PrismaPlanoRepository) =>
        new AtualizarCustoPlanoUseCase(repo),
      inject: [PrismaPlanoRepository],
    },
  ],
})
export class PlanoModule {}