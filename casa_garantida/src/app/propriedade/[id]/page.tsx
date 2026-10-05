// src/app/propriedade/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Propriedade } from '@/types/Propriedade';
import PropertyDetailsView from './PropertyDetailsView';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Usuario } from '@/types/Usuario';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: Props) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160";

  // 1. Buscar a propriedade (público — qualquer um pode ver)
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) return notFound();

  const res = await fetch(`${baseUrl}/propriedade/${id}`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const property: Propriedade = await res.json();

  // 2. Tentar obter a sessão do Kinde (sem bloquear se não estiver logado)
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  const user = await getUser();

  // 3. Se estiver logado, busca o dbUser. Se não, fica null.
  let dbUser: Usuario | null = null;

  if (isAuth && user?.email) {
    try {
      const response = await fetch(
        `${baseUrl}/Usuario/by-email?email=${encodeURIComponent(user.email)}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        dbUser = await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário no backend C#:', error);
    }
  }

  // 4. Sem redirect! Envia a propriedade e o usuário (ou null)
  return <PropertyDetailsView property={property} currentUser={dbUser} />;
}

/*import { notFound } from 'next/navigation';
import { Propriedade } from '@/types/Propriedade';
import PropertyDetailsView from './PropertyDetailsView';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Usuario } from '@/types/Usuario';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PropertyPage({ params }: Props) {
    const resolvedParams = await params;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160";

    const res = await fetch(`${baseUrl}/propriedade/${Number(resolvedParams.id)}`, {
        cache: 'no-store'
    });

    if (!res.ok) return notFound();
    
    const property: Propriedade = await res.json();
    console.log(property);

    const {isAuthenticated, getUser } = await getKindeServerSession();
    const isAuth = await isAuthenticated();
    const user = await getUser();
  
    // 3. Busca o usuário NA BASE DE DADOS pelo e-mail
    let dbUser: Usuario | null = null;
    try {
      const response = await fetch(
        `${baseUrl}/Usuario/by-email?email=${encodeURIComponent(user.email)}`,
        { cache: 'no-store' }
      );
  
      if (response.ok) {
        dbUser = await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário no backend C#:', error);
    }

    return <PropertyDetailsView property={property} currentUserId={dbUser.id} />;
}*/