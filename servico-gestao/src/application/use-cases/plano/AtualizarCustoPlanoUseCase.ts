import { IPlanoRepository } from '../../ports/IPlanoRepository';
import { AtualizarPlanoDTO } from '../../dtos/AtualizarPlanoDTO';
import { PlanoResponseDTO } from '../../dtos/PlanoResponseDTO';
import { PlanoNaoEncontradoError } from '../../../shared/errors/PlanoErrors';

export class AtualizarCustoPlanoUseCase {
    constructor(private readonly planoRepository: IPlanoRepository) {}

    async execute(dto: AtualizarPlanoDTO): Promise<PlanoResponseDTO> {
        const plano = await this.planoRepository.findById(dto.codigo);

        if (!plano) {
            throw new PlanoNaoEncontradoError(dto.codigo);
        }

        plano.atualizarCusto(dto.custoMensal);

        const planoAtualizado = await this.planoRepository.updateCustoMensal(
            dto.codigo,
            plano.custoMensal.valor,
        );

        return {
            codigo: planoAtualizado.codigo,
            nome: planoAtualizado.nome,
            custoMensal: planoAtualizado.custoMensal.valor,
            descricao: planoAtualizado.descricao,
            dataCriacao: planoAtualizado.data,
        };
    }
}