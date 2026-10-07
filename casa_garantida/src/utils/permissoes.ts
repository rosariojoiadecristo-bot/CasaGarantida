import { Usuario } from "@/types/Usuario";

export type Permissao =
  | "dashboard"
  | "pedidos"
  | "pedidosProprios"
  | "propriedades"
  | "minhasPropriedades"
  | "usuarios";

// Mapa: tipoUsuarioId → lista de permissões
const PERMISSOES_POR_TIPO: Record<number, Permissao[]> = {
  1: ["dashboard", "pedidos", "propriedades", "usuarios"], // Administrador
  2: ["dashboard", "pedidos", "propriedades", "usuarios"], // Gestor
  3: ["pedidosProprios", "minhasPropriedades"],            // Cliente
};

export function temPermissao(
  currentUser: Usuario | null | undefined,
  permissao: Permissao
): boolean {
  if (!currentUser) return false;
  const tipo = currentUser.tipoUsuarioId;
  return PERMISSOES_POR_TIPO[tipo]?.includes(permissao) ?? false;
}