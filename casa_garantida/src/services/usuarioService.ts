import { Usuario } from '@/types/Usuario';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5160/api';

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const response = await fetch(`${API_URL}/Usuario`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Erro em getUsuarios:', error);
    return [];
  }
}

export interface AtualizarPerfilData {

    firstName: string;

    lastName: string;

    contacto1: number | null;

    contacto2: number | null;

    provincia: string | null;

}


/**
 * Atualizar perfil do usuário
 */
export async function atualizarPerfil(
    usuarioId: number,
    dados: AtualizarPerfilData
): Promise<Usuario> {

    const response = await fetch(
        `${API_URL}/Usuario/${usuarioId}/perfil`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(dados),
        }
    );


    if (!response.ok) {

        const mensagem =
            await response.text();

        throw new Error(
            mensagem ||
            'Erro ao atualizar o perfil.'
        );

    }


    return await response.json();
}