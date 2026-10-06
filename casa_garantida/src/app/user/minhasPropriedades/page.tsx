import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { getPropriedadesByCliente } from '@/services/propriedadeService';
import MinhasPropriedades from './components/minhasPropriedades';
import { PedidoDetalhe } from '@/types/Pedido';
import { getPedidosRejeitadosPorUsuario } from '@/services/pedidoService';
import PedidosRejeitadosProprios from './components/PedidosRejeitadosProprios';

interface UsuarioBanco {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const PropertiesPage = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/unauthorized");
  }

  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    redirect("/unauthorized");
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  // Buscar usuário na base SQL Server
  const response = await fetch(
    `${API_URL}/Usuario/by-email?email=${encodeURIComponent(kindeUser.email)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    redirect("/unauthorized");
  }

  const usuarioBanco: UsuarioBanco = await response.json();
  console.log(usuarioBanco.id);

  // Busca apenas as propriedades onde LocatarioId == usuarioBanco.id
  const properties = await getPropriedadesByCliente(usuarioBanco.id);

  // 🔹 Só os pendentes DESTE utilizador
    const pedidos: PedidoDetalhe[] =
      await getPedidosRejeitadosPorUsuario(usuarioBanco.id);

  return (
    <>
    <MinhasPropriedades properties={properties} />
    <PedidosRejeitadosProprios initialPedidos={pedidos} usuarioId={usuarioBanco.id}/>
    </>
  );
};

export default PropertiesPage;