import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ListarPlanosUseCase } from '../../application/use-cases/plano/ListarPlanosUseCase';
import { AtualizarCustoPlanoUseCase } from '../../application/use-cases/plano/AtualizarCustoPlanoUseCase';

@Controller('gestao')
export class PlanoController {
  constructor(
    private readonly listarPlanosUseCase: ListarPlanosUseCase,
    private readonly atualizarCustoPlanoUseCase: AtualizarCustoPlanoUseCase,
  ) {}

  @Get('planos')
  async listarPlanos() {
    return this.listarPlanosUseCase.execute();
  }

  @Patch('planos/:idPlano')
  async atualizarCusto(
    @Param('idPlano') idPlano: string,
    @Body('custoMensal') custoMensal: number,
  ) {
    return this.atualizarCustoPlanoUseCase.execute({
      codigo: BigInt(idPlano),
      custoMensal: Number(custoMensal),
    });
  }
}