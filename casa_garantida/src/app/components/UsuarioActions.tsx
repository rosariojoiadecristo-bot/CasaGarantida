"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  promoverParaGestor,
  rebaixarParaCliente,
} from "@/services/usuarioService";
import { Usuario } from "@/types/Usuario";

interface Props {
  usuario: Usuario;
  currentUser: Usuario;
}

type Acao = "promover" | "rebaixar" | null;

export default function UsuarioActions({ usuario, currentUser }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acao, setAcao] = useState<Acao>(null);
  const [erro, setErro] = useState<string | null>(null);

  // 🔒 Só Administradores (id = 1) podem ver os botões
  if (currentUser?.tipoUsuarioId !== 1) return null;

  // Não permitir que o admin se altere a si próprio
  if (currentUser.id === usuario.id) return null;

  const fechar = () => {
    if (loading) return;
    setAcao(null);
    setErro(null);
  };

  const confirmar = async () => {
    if (!acao) return;

    try {
      setLoading(true);
      setErro(null);

      if (acao === "promover") {
        await promoverParaGestor(usuario.id);
      } else {
        await rebaixarParaCliente(usuario.id);
      }

      setAcao(null);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado."
      );
    } finally {
      setLoading(false);
    }
  };

  const nome = `${usuario.firstName} ${usuario.lastName}`;

  return (
    <>
      <div className="flex gap-2 mt-2">
        {usuario.tipoUsuarioId === 3 && (
          <button
            onClick={() => setAcao("promover")}
            className="text-xs px-3 py-1 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Promover a Gestor
          </button>
        )}
        {usuario.tipoUsuarioId === 2 && (
          <button
            onClick={() => setAcao("rebaixar")}
            className="text-xs px-3 py-1 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
          >
            Rebaixar a Cliente
          </button>
        )}
      </div>

      {/* MODAL */}
      {acao && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={fechar}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900">
              {acao === "promover"
                ? "Promover utilizador"
                : "Rebaixar utilizador"}
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              Tem a certeza que deseja{" "}
              {acao === "promover" ? "promover" : "rebaixar"}{" "}
              <strong className="text-gray-900">{nome}</strong> a{" "}
              <strong
                className={
                  acao === "promover" ? "text-emerald-700" : "text-amber-700"
                }
              >
                {acao === "promover" ? "Gestor" : "Cliente"}
              </strong>
              ?
            </p>

            {erro && (
              <p className="mt-3 text-sm text-red-600 font-medium">{erro}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={fechar}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmar}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-colors ${
                  acao === "promover"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {loading
                  ? "A processar..."
                  : acao === "promover"
                    ? "Promover"
                    : "Rebaixar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  promoverParaGestor,
  rebaixarParaCliente,
} from "@/services/usuarioService";
import { Usuario } from "@/types/Usuario";

interface Props {
  usuario: Usuario;
  currentUser: Usuario;
}

export default function UsuarioActions({ usuario, currentUser }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔒 Só Administradores (id = 1) podem ver e usar os botões
  if (currentUser?.tipoUsuarioId !== 1) {
    return null;
  }

  // Não permitir que o admin se rebaixe/promova a si próprio
  if (currentUser.id === usuario.id) {
    return null;
  }

  const handlePromover = async () => {
    if (!confirm(`Promover ${usuario.firstName} a Gestor?`)) return;

    try {
      setLoading(true);
      await promoverParaGestor(usuario.id);
      router.refresh(); // recarrega os dados do server component
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao promover.");
    } finally {
      setLoading(false);
    }
  };

  const handleRebaixar = async () => {
    if (!confirm(`Rebaixar ${usuario.firstName} a Cliente?`)) return;

    try {
      setLoading(true);
      await rebaixarParaCliente(usuario.id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao rebaixar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      {usuario.tipoUsuarioId === 3 && (
        <button
          onClick={handlePromover}
          disabled={loading}
          className="text-xs px-3 py-1 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "..." : "Promover a Gestor"}
        </button>
      )}
      {usuario.tipoUsuarioId === 2 && (
        <button
          onClick={handleRebaixar}
          disabled={loading}
          className="text-xs px-3 py-1 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "..." : "Rebaixar a Cliente"}
        </button>
      )}
    </div>
  );
}*/