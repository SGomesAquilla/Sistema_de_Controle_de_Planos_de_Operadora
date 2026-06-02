import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CriarAssinaturaUseCase } from '../../application/use-cases/assinatura/CriarAssinaturaUseCase';
import { ListarAssinaturasPorTipoUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorTipoUseCase';
import { ListarAssinaturasPorClienteUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorClienteUseCase';
import { ListarAssinaturasPorPlanoUseCase } from '../../application/use-cases/assinatura/ListarAssinaturasPorPlanoUseCase';
import { TipoListagemAssinatura } from '../../application/dtos/ListarAssinaturasDTO';

@Controller('gestao')
export class AssinaturaController {
  constructor(
    private readonly criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private readonly listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private readonly listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase,
    private readonly listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase,
  ) {}

  @Post('assinaturas')
  async criarAssinatura(
    @Body('codCli') codCli: string,
    @Body('codPlano') codPlano: string,
    @Body('custoFinal') custoFinal: number,
    @Body('descricao') descricao: string,
  ) {
    return this.criarAssinaturaUseCase.execute({
      codCli: BigInt(codCli),
      codPlano: BigInt(codPlano),
      custoFinal: Number(custoFinal),
      descricao,
    });
  }

  @Get('assinaturas/:tipo')
  async listarPorTipo(@Param('tipo') tipo: string) {
    return this.listarAssinaturasPorTipoUseCase.execute({
      tipo: tipo.toUpperCase() as TipoListagemAssinatura,
    });
  }

  @Get('assinaturascliente/:codcli')
  async listarPorCliente(@Param('codcli') codcli: string) {
    return this.listarAssinaturasPorClienteUseCase.execute(BigInt(codcli));
  }

  @Get('assinaturasplano/:codplano')
  async listarPorPlano(@Param('codplano') codplano: string) {
    return this.listarAssinaturasPorPlanoUseCase.execute(BigInt(codplano));
  }
}