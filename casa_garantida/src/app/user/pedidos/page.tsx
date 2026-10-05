import {
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

import { redirect } from "next/navigation";

import { getPedidosPendentes } from "@/services/pedidoService";
import { PedidoDetalhe } from "@/types/Pedido";
import PedidosPendentes from "./components/PedidosPendentes";

interface UsuarioBanco {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default async function PedidosPage() {
  const {
    isAuthenticated,
    getUser,
  } = getKindeServerSession();

  const authenticated =
    await isAuthenticated();

  if (!authenticated) {
    redirect("/unauthorized");
  }

  const kindeUser =
    await getUser();

  if (!kindeUser?.email) {
    redirect("/unauthorized");
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5160/api";

  // Buscar usuário da nossa base SQL Server
  const response = await fetch(
    `${API_URL}/Usuario/by-email?email=${encodeURIComponent(
      kindeUser.email
    )}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/unauthorized");
  }

  const usuarioBanco: UsuarioBanco =
    await response.json();

  // Buscar pedidos pendentes
  const pedidos: PedidoDetalhe[] =
    await getPedidosPendentes();

  return (
    <PedidosPendentes
      initialPedidos={pedidos}
      processadoPor={usuarioBanco.id}
    />
  );
}