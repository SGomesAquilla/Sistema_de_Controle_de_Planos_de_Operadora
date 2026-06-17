import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PagamentoService, RegistrarPagamentoDTO } from '../services/PagamentoService';

@Controller()
export class PagamentoController {
    constructor(private readonly pagamentoService: PagamentoService) {}

    @Post('registrarpagamento')
    @HttpCode(200)
    async registrarPagamento(@Body() dto: RegistrarPagamentoDTO): Promise<void> {
        await this.pagamentoService.registrar(dto);
    }
}