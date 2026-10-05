import { PedidoDetalhe } from "../types/Pedido";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5160/api";

export interface CriarPedidoData {
  propriedadeId: number;
  usuarioId: number;
  tipoPedido: "Compra" | "Aluguel";
  observacao?: string;
}

export interface AprovarPedidoData {
  processadoPor: number;
  anos?: number;
  meses?: number;
  dias?: number;
}

export async function aprovarPedido(
  pedidoId: number,
  dados: AprovarPedidoData
) {
  const response = await fetch(`${API_URL}/Pedido/${pedidoId}/aprovar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Não foi possível aprovar o pedido.");
  }

  return result;
}

export async function criarPedido(
  data: CriarPedidoData
) {
  const response = await fetch(`${API_URL}/Pedido`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Não foi possível criar o pedido."
    );
  }

  return result;
}

export async function getPedidosPendentes(): Promise<
  PedidoDetalhe[]
> {
  const response = await fetch(
    `${API_URL}/Pedido/pendentes`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível obter os pedidos pendentes."
    );
  }

  return response.json();
}

export async function rejeitarPedido(
  pedidoId: number,
  processadoPor: number,
  observacao?: string
) {
  const response = await fetch(
    `${API_URL}/Pedido/${pedidoId}/rejeitar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        processadoPor,
        observacao,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Não foi possível rejeitar o pedido."
    );
  }

  return result;
}

export async function getPedidosRejeitadosPorUsuario(
  usuarioId: number
): Promise<PedidoDetalhe[]> {
  const response = await fetch(
    `${API_URL}/Pedido/rejeitados/usuario/${usuarioId}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Não foi possível obter os seus pedidos pendentes.");
  }

  return response.json();
}

export async function getPedidosPendentesPorUsuario(
  usuarioId: number
): Promise<PedidoDetalhe[]> {
  const response = await fetch(
    `${API_URL}/Pedido/pendentes/usuario/${usuarioId}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Não foi possível obter os seus pedidos pendentes.");
  }

  return response.json();
}

export async function cancelarPedido(
  pedidoId: number,
  usuarioId: number
) {
  const response = await fetch(
    `${API_URL}/Pedido/${pedidoId}/cancelar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuarioId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Não foi possível cancelar o pedido."
    );
  }

  return result;
}

export async function cancelarPedidoRejeitado(
  pedidoId: number,
  usuarioId: number
) {
  const response = await fetch(
    `${API_URL}/Pedido/${pedidoId}/cancelarRejeitado`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuarioId }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Não foi possível cancelar o pedido."
    );
  }

  return result;
}