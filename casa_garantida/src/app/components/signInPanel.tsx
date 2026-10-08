import React from 'react';
import { Button } from '@heroui/button';
import {
  getKindeServerSession,
  LoginLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import UserProfilePanel from './UserProfilePanel';
import { Usuario } from '@/types/Usuario';

const SignInPanel = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  const user = await getUser();

  if (isAuth && user?.email) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';
    
    // Busca o usuário na sua API C# pelo e-mail
    let dbUser: Usuario | null = null;
    try {
      const response = await fetch(`${apiUrl}/Usuario/by-email?email=${encodeURIComponent(user.email)}`, {
        cache: 'no-store', // Garante dados sempre atualizados
      });

      if (response.ok) {
        dbUser = await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário no backend C#:', error);
    }

    // Fallback: se a API ainda não respondeu, utiliza os dados da sessão Kinde
    const activeUser: Usuario = dbUser ?? {
      id: 0,
      firstName: user.given_name ?? '',
      lastName: user.family_name ?? '',
      email: user.email,
      tipoUsuarioId: 3, // 3 = Cliente por padrão
      avatarUrl: user.picture ?? '',
    };

    return <UserProfilePanel user={activeUser} />;
  }

  return (
    <div className='flex gap-3'>
        <Button color="primary">
            <LoginLink>Sign In</LoginLink>
        </Button>
        <Button>
            <RegisterLink>Sign Up</RegisterLink>
        </Button>
    </div>
  );
};

export default SignInPanel;