import { Propriedade } from '@/types/Propriedade';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5066/api';

export async function getPropriedade(): Promise<Propriedade[]> {
  try {
    const response = await fetch(`${API_URL}/Propriedade`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro em getPropriedade:', error);
    return [];
  }
}

export async function getPropriedadesByCliente(clienteId: number): Promise<Propriedade[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  const response = await fetch(`${API_URL}/Propriedade/cliente/${clienteId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getPropriedadesDisponiveis(): Promise<Propriedade[]> {
  try {
    const response = await fetch(`${API_URL}/Propriedade/disponiveis`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro em getPropriedadesDisponiveis:', error);
    return [];
  }
}