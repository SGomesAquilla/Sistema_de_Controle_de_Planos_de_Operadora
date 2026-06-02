import { Controller, Get } from '@nestjs/common';
import { ListarClientesUseCase } from '../../application/use-cases/cliente/ListarClientesUseCase';

@Controller('gestao')
export class ClienteController {
  constructor(
    private readonly listarClientesUseCase: ListarClientesUseCase,
  ) {}

  @Get('clientes')
  async listarClientes() {
    return this.listarClientesUseCase.execute();
  }
}