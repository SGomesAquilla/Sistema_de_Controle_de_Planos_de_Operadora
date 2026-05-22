export interface AssinaturaResponseDTO {
  codigo: number;
  codPlano: number;
  codCliente: number;
  inicioFidelidade: Date;
  fimFidelidade: Date;
  dataUltimoPagamento: Date;
  status: string;
  emFidelidade: boolean;
}