import { getUsuarios } from "@/services/usuarioService";
import UsuarioActions from "../components/UsuarioActions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  contacto1?: number | null;
  tipoUsuarioId: number; // 1 = Administrador, 2 = Gestor, 3 = Cliente
}

// Mapeamento dos tipos para rótulos e estilos visuais
const TIPOS_USUARIO: Record<number, { titulo: string; corBadge: string }> = {
  1: { titulo: "Administradores", corBadge: "bg-red-100 text-red-800 border-red-200" },
  2: { titulo: "Gestores", corBadge: "bg-amber-100 text-amber-800 border-amber-200" },
  3: { titulo: "Clientes", corBadge: "bg-blue-100 text-blue-800 border-blue-200" },
};

export default async function UsuariosPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();
  const kindeUser = await getUser();
  if (!kindeUser?.email) redirect("/unauthorized");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  // Buscar usuário da nossa base SQL Server
  const response = await fetch(
    `${API_URL}/Usuario/by-email?email=${encodeURIComponent(kindeUser.email)}`,
    { cache: "no-store" }
  );

  const currentUser : Usuario = await response.json();

  const usuarios: Usuario[] = await getUsuarios();
  const baseUrl = "http://localhost:5160";

  // Agrupa os usuários por tipoUsuarioId
  const usuariosPorTipo = usuarios.reduce<Record<number, Usuario[]>>((acc, usuario) => {
    const tipo = usuario.tipoUsuarioId || 3; // Padrão Cliente (3)
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(usuario);
    return acc;
  }, {});

  // Ordem de exibição dos grupos
  const ordemTipos = [1, 2, 3];

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Lista de Usuários por Categoria</h1>

      {ordemTipos.map((tipoId) => {
        const lista = usuariosPorTipo[tipoId] || [];
        const infoTipo = TIPOS_USUARIO[tipoId] || {
          titulo: `Outros (Tipo #${tipoId})`,
          corBadge: "bg-gray-100 text-gray-800 border-gray-200",
        };

        if (lista.length === 0) return null; // Esconde seções sem usuários

        return (
          <section key={tipoId} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">{infoTipo.titulo}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${infoTipo.corBadge}`}>
                {lista.length} {lista.length === 1 ? "usuário" : "usuários"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lista.map((usuario) => {
                const avatar = usuario.avatarUrl?.trim();
                const temAvatar = avatar && avatar !== "string";
                const isUrlCompleta =
                  temAvatar && (avatar.startsWith("http://") || avatar.startsWith("https://"));

                const srcFinal = isUrlCompleta
                  ? `${avatar}?t=${new Date().getTime()}`
                  : `${baseUrl}${avatar?.startsWith("/") ? avatar : `/${avatar}`}?t=${new Date().getTime()}`;

                return (
                  <div
                    key={usuario.id}
                    className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-black"
                  >
                    {temAvatar ? (
                      <img
                        src={srcFinal}
                        alt={`${usuario.firstName} ${usuario.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {usuario.firstName?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-base">
                        {usuario.firstName} {usuario.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      <span className="text-xs text-gray-400">ID: #{usuario.id} - </span>
                      <span className="text-xs text-gray-400">Contacto: {usuario.contacto1}</span>
                      <UsuarioActions usuario={usuario} currentUser={currentUser} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}