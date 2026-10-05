import { getUsuarios } from "@/services/usuarioService";

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();
  const baseUrl = "http://localhost:5160";

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuários</h1>
      {usuarios.map((usuario) => {
        const avatar = usuario.avatarUrl?.trim();

        // Valida se existe um avatar e se não é a string padrao do Swagger/API
        const temAvatar = avatar && avatar !== "string";

        // Se já for uma URL completa (http...), usa direto; se for caminho relativo (/uploads...), adiciona a baseUrl
        const isUrlCompleta =
          temAvatar &&
          (avatar.startsWith("http://") || avatar.startsWith("https://"));
        const meAvatarValido = temAvatar;

        const srcFinal = isUrlCompleta
          ? `${avatar}?t=${new Date().getTime()}`
          : `${baseUrl}${avatar.startsWith("/") ? avatar : `/${avatar}`}?t=${new Date().getTime()}`;

        return (
          <div
            key={usuario.id}
            className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-black"
          >
            {meAvatarValido ? (
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
              <h2 className="font-semibold text-lg">
                {usuario.firstName} {usuario.lastName}
              </h2>
              <p className="text-sm text-gray-600">{usuario.email}</p>
              <span className="text-xs text-gray-400">ID: #{usuario.id}</span>
            </div>
          </div>
        );
      })}
    </main>
  );
}

/*import { getUsuarios } from '@/services/usuarioService';

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();
  const baseUrl = "http://localhost:5160";

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuários</h1>

      {usuarios.length === 0 ? (
        <p className="text-gray-500">Nenhum usuário localizado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {usuarios.map((usuario) => {
            // Valida se avatarUrl é uma URL válida e não a palavra "string"
            const meAvatarValido =
              usuario.avatarUrl &&
              usuario.avatarUrl !== 'string' &&
              (usuario.avatarUrl.startsWith('http://') || usuario.avatarUrl.startsWith('https://'));

            return (
              <div
                key={usuario.id}
                className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-black"
              >
                {meAvatarValido ? (
                  <img
                    src={`${baseUrl}${usuario?.avatarUrl?.trim() || "/avatar.png"}?t=${new Date().getTime()}`}
                    alt={`${usuario.firstName} ${usuario.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {usuario.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-lg">
                    {usuario.firstName} {usuario.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                  <span className="text-xs text-gray-400">ID: #{usuario.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}*/

/*import { getUsuarios } from '@/services/usuarioService';
import Image from 'next/image';

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuários</h1>
      
      {usuarios.length === 0 ? (
        <p className="text-gray-500">Nenhum usuário localizado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {usuarios.map((usuario) => (
            <div 
              key={usuario.id} 
              className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {usuario.avatarUrl ? (
                <img
                  src={usuario.avatarUrl}
                  alt={`${usuario.firstName} ${usuario.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {usuario.firstName?.[0] || 'U'}
                </div>
              )}
              
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {usuario.firstName} {usuario.lastName}
                </h2>
                <p className="text-sm text-gray-500">{usuario.email}</p>
                <span className="text-xs text-gray-400">ID: #{usuario.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/*import { getUsuarios } from '@/services/usuarioService';

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuários</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário localizado.</p>
      ) : (
        <ul className="space-y-2">
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="p-3 bg-gray-100 rounded">
              {usuario.firstName || `Usuário ID: ${usuario.id}`}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}*/
