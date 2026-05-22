export type TipoListagemAssinatura = 'TODOS' | 'ATIVOS' | 'CANCELADOS';

export interface ListarAssinaturasDTO {
  tipo: TipoListagemAssinatura;
}