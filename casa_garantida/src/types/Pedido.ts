export type TipoPedido = "Compra" | "Aluguel";

export type StatusPedido =
  | "Pendente"
  | "Aprovado"
  | "Rejeitado";

export interface PedidoDetalhe {
  id: number;

  propriedadeId: number;
  propriedadeNome: string;

  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;

  tipoId: number;
  tipoPedido: TipoPedido;

  statusId: number;
  statusPedido: StatusPedido;

  dataPedido: string;
  dataDecisao?: string | null;

  processadoPor?: number | null;

  observacao?: string | null;
  dataFimContrato?: string | null;
}