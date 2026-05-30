export interface AssinaturaResponseDTO {
  codigo: bigint;
  codCli: bigint;
  codPlano: bigint;
  custoFinal: number,
  descricao: string,
  inicioFidelidade: Date;
  fimFidelidade: Date;
  dataUltimoPagamento: Date;
  status: string;
  emFidelidade: boolean;
}