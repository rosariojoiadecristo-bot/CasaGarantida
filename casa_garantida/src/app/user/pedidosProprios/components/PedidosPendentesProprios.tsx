"use client";

import { useMemo, useState } from "react";
import { Modal } from "@heroui/react";
import { PedidoDetalhe } from "@/types/Pedido";
import { cancelarPedido } from "@/services/pedidoService";
import { formatarData } from "@/utils/formatarData";
import { Button } from "@heroui/button";
import { redirect } from "next/navigation";

interface PedidosPendentesPropriosProps {
  initialPedidos: PedidoDetalhe[];
  usuarioId: number;
}

interface GrupoPedidos {
  propriedadeId: number;
  propriedadeNome: string;
  pedidos: PedidoDetalhe[];
}

export default function PedidosPendentesProprios({
  initialPedidos,
  usuarioId,
}: PedidosPendentesPropriosProps) {
  const [pedidos, setPedidos] = useState<PedidoDetalhe[]>(initialPedidos || []);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const grupos: GrupoPedidos[] = useMemo(() => {
    const mapa = new Map<number, GrupoPedidos>();

    for (const pedido of pedidos) {
      if (!mapa.has(pedido.propriedadeId)) {
        mapa.set(pedido.propriedadeId, {
          propriedadeId: pedido.propriedadeId,
          propriedadeNome: pedido.propriedadeNome,
          pedidos: [],
        });
      }
      mapa.get(pedido.propriedadeId)!.pedidos.push(pedido);
    }

    return Array.from(mapa.values()).sort((a, b) =>
      a.propriedadeNome.localeCompare(b.propriedadeNome)
    );
  }, [pedidos]);

  const totalPedidos = pedidos.length;

  function abrirCancelamento(pedido: PedidoDetalhe) {
    setPedidoSelecionado(pedido);
    setIsOpen(true);
  }

  async function handleConfirmarCancelamento() {
    if (!pedidoSelecionado) return;

    try {
      setLoading(true);
      setMessage(null);

      await cancelarPedido(pedidoSelecionado.id, usuarioId);

      // Remove da lista local
      setPedidos((current) =>
        current.filter((p) => p.id !== pedidoSelecionado.id)
      );

      setMessage({ type: "success", text: "Pedido cancelado com sucesso." });

      setIsOpen(false);
      setPedidoSelecionado(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ocorreu um erro.",
      });
    } finally {
      setLoading(false);
    }
  }

  // 🔒 Bloqueia clientes (id = 3)
  if (usuarioId === 1 || usuarioId === 2) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">
          Os Meus Pedidos Pendentes
        </h1>

        <span
          className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800"
          title="Total de pedidos pendentes"
        >
          {totalPedidos} {totalPedidos === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <p className="mt-2 mb-6 text-gray-500">
        Acompanhe aqui as suas solicitações de compra e aluguel ainda em análise.
      </p>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {grupos.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-600">
            Não tem pedidos pendentes.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Quando submeter uma solicitação, ela aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grupos.map((grupo) => (
            <div
              key={grupo.propriedadeId}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {grupo.propriedadeNome}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Imóvel #{grupo.propriedadeId}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {grupo.pedidos.length}{" "}
                  {grupo.pedidos.length === 1 ? "pedido" : "pedidos"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Observação
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {grupo.pedidos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              pedido.tipoPedido === "Compra"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {pedido.tipoPedido}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatarData(pedido.dataPedido)}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pendente
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[280px]">
                          {pedido.observacao?.trim() || (
                            <span className="text-gray-400 italic">
                              Sem observação
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => abrirCancelamento(pedido)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmação */}
      <Modal>
        <Modal.Backdrop
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Modal.Container className="flex items-center justify-center w-full">
            <Modal.Dialog className="sm:max-w-[420px] w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading className="text-lg font-semibold">
                  Cancelar pedido
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="my-4 space-y-3">
                {pedidoSelecionado && (
                  <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <p>
                      <strong>Imóvel:</strong>{" "}
                      {pedidoSelecionado.propriedadeNome || "N/D"}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {pedidoSelecionado.tipoPedido}
                    </p>
                  </div>
                )}

                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Esta ação remove definitivamente o pedido e não pode ser
                  revertida.
                </p>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="light"
                  onPress={() => setIsOpen(false)}
                  isDisabled={loading}
                >
                  Voltar
                </Button>

                <Button
                  color="danger"
                  onPress={handleConfirmarCancelamento}
                  isLoading={loading}
                >
                  Confirmar cancelamento
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}