import { IAssinaturaRepository } from '../../ports/IAssinaturaRepository';
import { ListarAssinaturasDTO, TipoListagemAssinatura } from '../../dtos/ListarAssinaturasDTO';
import { AssinaturaResponseDTO } from '../../dtos/AssinaturaResponseDTO';
import { Assinatura, StatusAssinatura } from '../../../domain/entities/Assinatura';
import { AssinaturaInvalidaError } from '../../../shared/errors/AssinaturaErrors';

// --- Interfaces da Strategy ---
interface IListagemStrategy {
  executar(repository: IAssinaturaRepository): Promise<Assinatura[]>;
}

// --- Estratégia: TODOS ---
class ListarTodosStrategy implements IListagemStrategy {
  async executar(repository: IAssinaturaRepository): Promise<Assinatura[]> {
    return repository.findAll();
  }
}

// --- Estratégia: ATIVOS ---
class ListarAtivosStrategy implements IListagemStrategy {
  async executar(repository: IAssinaturaRepository): Promise<Assinatura[]> {
    return repository.findByStatus(StatusAssinatura.ATIVO);
  }
}

// --- Estratégia: CANCELADOS ---
class ListarCanceladosStrategy implements IListagemStrategy {
  async executar(repository: IAssinaturaRepository): Promise<Assinatura[]> {
    return repository.findByStatus(StatusAssinatura.CANCELADO);
  }
}

// --- Mapa de estratégias ---
const estrategias: Record<TipoListagemAssinatura, IListagemStrategy> = {
  TODOS: new ListarTodosStrategy(),
  ATIVOS: new ListarAtivosStrategy(),
  CANCELADOS: new ListarCanceladosStrategy(),
};

export class ListarAssinaturasPorTipoUseCase {
  constructor(private readonly assinaturaRepository: IAssinaturaRepository) {}

  async execute(dto: ListarAssinaturasDTO): Promise<AssinaturaResponseDTO[]> {
    const estrategia = estrategias[dto.tipo];

    if (!estrategia)
      throw new AssinaturaInvalidaError(
        `tipo de listagem inválido: ${dto.tipo}`,
      );

    const assinaturas = await estrategia.executar(this.assinaturaRepository);
    const agora = new Date();

    return assinaturas.map((assinatura) => ({
      codigo: assinatura.codigo,
      codPlano: assinatura.codPlano,
      codCliente: assinatura.codCliente,
      inicioFidelidade: assinatura.periodo.inicio,
      fimFidelidade: assinatura.periodo.fim,
      dataUltimoPagamento: assinatura.dataUltimoPagamento,
      status: assinatura.obterStatus(agora),
      emFidelidade: assinatura.estaEmFidelidade(agora),
    }));
  }
}