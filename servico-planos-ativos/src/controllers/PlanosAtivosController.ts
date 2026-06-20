import { Controller, Get, Param } from '@nestjs/common';
import { PlanosAtivosService } from '../services/PlanosAtivosService';

@Controller('planosativos')
export class PlanosAtivosController {
    constructor(private readonly planosAtivosService: PlanosAtivosService) {}

    @Get(':codass')
    async verificarAtivo(@Param('codass') codass: string): Promise<boolean> {
        return this.planosAtivosService.verificarAtivo(codass);
    }
}