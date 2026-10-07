import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { redirect } from "next/navigation";
import Dashboard from "./components/Dashboard";

interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  contacto1?: number | null;
  tipoUsuarioId: number; // 1 = Administrador, 2 = Gestor, 3 = Cliente
}

export default async function PedidosPropriosPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) redirect("/unauthorized");

  const kindeUser = await getUser();
  if (!kindeUser?.email) redirect("/unauthorized");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  // Buscar usuário da nossa base SQL Server
  const response = await fetch(
    `${API_URL}/Usuario/by-email?email=${encodeURIComponent(kindeUser.email)}`,
    { cache: "no-store" }
  );

  if (!response.ok) redirect("/unauthorized");

  const usuarioBanco: Usuario = await response.json();

  return <Dashboard  currentUser={usuarioBanco}/>;
}