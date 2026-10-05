"use client";

import { useState } from "react";
import { criarPedido } from "@/services/pedidoService";
import { Button } from "@heroui/button";

interface Props {
  propriedadeId: number;
  usuarioId: number;
  tipo: "Compra" | "Aluguel";
}

export default function RequestPropertyButton({
  propriedadeId,
  usuarioId,
  tipo,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    null
  );

  async function handleRequest() {
    try {
      setLoading(true);
      setMessage(null);

      const result = await criarPedido({
        propriedadeId,
        usuarioId,
        tipoPedido: tipo,
        observacao:
          tipo === "Compra"
            ? "Solicitação de compra."
            : "Solicitação de aluguel.",
      });

      setMessage(result.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erro ao criar pedido."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        color={tipo === "Compra" ? "primary" : "secondary"}
        onPress={handleRequest}
        isLoading={loading}
      >
        {tipo === "Compra"
          ? "Solicitar Compra"
          : "Solicitar Aluguel"}
      </Button>

      {message && (
        <p className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}