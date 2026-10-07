"use client";

import { useMemo, useState } from "react";
import { Modal} from "@heroui/react";
import { PedidoDetalhe } from "@/types/Pedido";
import { aprovarPedido, rejeitarPedido } from "@/services/pedidoService";
import { formatarData } from "@/utils/formatarData";
import { Button } from "@heroui/button";
import { redirect } from "next/navigation";

interface PedidosPendentesProps {
  initialPedidos: PedidoDetalhe[];
  processadoPor: number;
}

interface GrupoPedidos {
  propriedadeId: number;
  propriedadeNome: string;
  pedidos: PedidoDetalhe[];
}

export default function PedidosPendentes({
  initialPedidos,
  processadoPor,
}: PedidosPendentesProps) {
  const [pedidos, setPedidos] = useState<PedidoDetalhe[]>(initialPedidos || []);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoDetalhe | null>(null);
  const [action, setAction] = useState<"aprovar" | "rejeitar" | null>(null);
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anos, setAnos] = useState(0);
  const [meses, setMeses] = useState(0);
  const [dias, setDias] = useState(0);

  // 🔹 Agrupa pedidos por propriedade
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

    // Ordena os grupos pelo nome do imóvel (opcional)
    return Array.from(mapa.values()).sort((a, b) =>
      a.propriedadeNome.localeCompare(b.propriedadeNome)
    );
  }, [pedidos]);

  const totalPedidos = pedidos.length;

  function abrirAprovacao(pedido: PedidoDetalhe) {
  setPedidoSelecionado(pedido);
  setAction("aprovar");
  setObservacao("");
  setAnos(0);
  setMeses(0);
  setDias(0);
  setIsOpen(true);
  }

  function abrirRejeicao(pedido: PedidoDetalhe) {
    setPedidoSelecionado(pedido);
    setAction("rejeitar");
    setObservacao("");
    setIsOpen(true);
  }

  async function handleConfirmar() {
  if (!pedidoSelecionado || !action) return;

  try {
    setLoading(true);
    setMessage(null);

    if (action === "aprovar") {
      const isAluguel = pedidoSelecionado.tipoPedido === "Aluguel";

      if (isAluguel && anos <= 0 && meses <= 0 && dias <= 0) {
        setMessage({
          type: "error",
          text: "Indique a duração do contrato (anos, meses ou dias).",
        });
        setLoading(false);
        return;
      }

      await aprovarPedido(pedidoSelecionado.id, {
        processadoPor,
        anos: isAluguel ? anos : undefined,
        meses: isAluguel ? meses : undefined,
        dias: isAluguel ? dias : undefined,
      });

      setMessage({
        type: "success",
        text: "Pedido aprovado com sucesso. O imóvel foi atualizado.",
      });
    } else {
      await rejeitarPedido(
        pedidoSelecionado.id,
        processadoPor,
        observacao.trim() || undefined
      );
      setMessage({ type: "success", text: "Pedido rejeitado com sucesso." });
    }

    setPedidos((current) => current.filter((p) => p.id !== pedidoSelecionado.id));
    setIsOpen(false);
    setPedidoSelecionado(null);
    setAction(null);
    setObservacao("");
    setAnos(0);
    setMeses(0);
    setDias(0);
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
  if (processadoPor === 3) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos Pendentes</h1>

        <span
          className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800"
          title="Total de pedidos pendentes"
        >
          {totalPedidos} {totalPedidos === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <p className="mt-2 mb-6 text-gray-500">
        Analise e processe as solicitações de compra e aluguel dos imóveis.
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
            Não existem pedidos pendentes.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Novas solicitações aparecerão aqui.
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
                  {grupo.pedidos.length === 1 ? "interessado" : "interessados"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Estado
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
                          <p className="font-medium text-gray-800">
                            {pedido.usuarioNome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {pedido.usuarioEmail}
                          </p>
                          <p className="text-xs text-gray-400">
                            Contacto: {pedido.usuarioContacto}
                          </p>
                        </td>

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

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              color="success"
                              onPress={() => abrirAprovacao(pedido)}
                            >
                              Aprovar
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => abrirRejeicao(pedido)}
                            >
                              Rejeitar
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

      <Modal>
        <Modal.Backdrop
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Modal.Container className="flex items-center justify-center w-full">
            <Modal.Dialog className="sm:max-w-[480px] w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading className="text-lg font-semibold">
                  {action === "aprovar" ? "Aprovar pedido" : "Rejeitar pedido"}
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body className="my-4 space-y-4">
                {pedidoSelecionado && (
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    <p><strong>Imóvel:</strong> {pedidoSelecionado.propriedadeNome || "N/D"}</p>
                    <p><strong>Solicitante:</strong> {pedidoSelecionado.usuarioNome || "N/D"}</p>
                    <p><strong>Tipo:</strong> {pedidoSelecionado.tipoPedido}</p>
                  </div>
                )}
              
                {/* Duração do contrato — apenas para Aluguel e ao aprovar */}
                {action === "aprovar" && pedidoSelecionado?.tipoPedido === "Aluguel" && (
                  <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Duração do contrato de aluguel <span className="text-red-500">*</span>
                    </p>
                
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Anos</label>
                        <input
                          type="number"
                          min={0}
                          value={anos}
                          onChange={(e) => setAnos(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Meses</label>
                        <input
                          type="number"
                          min={0}
                          value={meses}
                          onChange={(e) => setMeses(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Dias</label>
                        <input
                          type="number"
                          min={0}
                          value={dias}
                          onChange={(e) => setDias(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        />
                      </div>
                    </div>
                
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      A data de fim de contrato será calculada a partir da data de decisão.
                    </p>
                  </div>
                )}
              
                {action === "rejeitar" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Motivo da rejeição (opcional)</label>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Digite uma observação..."
                      className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                      rows={3}
                    />
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="light"
                  onPress={() => setIsOpen(false)}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  color={action === "aprovar" ? "success" : "danger"}
                  onPress={handleConfirmar}
                  isLoading={loading}
                >
                  {action === "aprovar"
                    ? "Confirmar aprovação"
                    : "Confirmar rejeição"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}