import { IPlanoRepository } from '../../ports/IPlanoRepository';
import { PlanoResponseDTO } from '../../dtos/PlanoResponseDTO';

export class ListarPlanosUseCase {
    constructor(private readonly planoRepository: IPlanoRepository) {}

    async execute(): Promise<PlanoResponseDTO[]> {
        const planos = await this.planoRepository.findAll();

        return planos.map((plano) => ({
            codigo: plano.codigo,
            nome: plano.nome,
            custoMensal: plano.custoMensal.valor,
            descricao: plano.descricao,
            dataCriacao: plano.data,
        }));
    }
}