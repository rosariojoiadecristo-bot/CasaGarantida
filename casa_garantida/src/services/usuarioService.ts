// src/services/usuarioService.ts
import { Usuario } from '@/types/Usuario';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5066/api';

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