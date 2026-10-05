import AddPropertyForm from './_components/AddPropertyForm'
import { PropriedadeTipo } from '@/types/PropriedadeTipo';
import { PropriedadeStatus } from '@/types/PropriedadeStatus';
import { Usuario } from '@/types/Usuario';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5066/api';

async function getTipos(): Promise<PropriedadeTipo[]> {
  try {
    const res = await fetch(`${API_URL}/PropriedadeTipo`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getStatuses(): Promise<PropriedadeStatus[]> {
  try {
    const res = await fetch(`${API_URL}/PropriedadeStatus`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const AddPropertyPage = async () => {
  // Caso ainda não tenha os endpoints de Tipo/Status no C#, podemos passar listas padrão provisórias
  const propriedadeTipo: PropriedadeTipo[] = [
    { id: 1, value: 'T1' },
    { id: 2, value: 'T2' },
    { id: 3, value: 'T3' },
    { id: 4, value: 'T4' },
    { id: 5, value: 'T5' },
  ];

  const propriedadeStatus: PropriedadeStatus[] = [
    { id: 1, value: 'Disponível' },
    { id: 2, value: 'Indisponível' },
    { id: 3, value: 'Vendido' },
    { id: 4, value: 'Arrendado' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";
  const {isAuthenticated, getUser } = await getKindeServerSession();
  const isAuth = await isAuthenticated();
  const user = await getUser();

  if (!isAuth || !user?.email) {
      redirect("/unauthorized");
  }

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

  // 4. Se não existe no banco OU não é o dono da propriedade → unauthorized
  if (!dbUser) {
    redirect("/unauthorized");
  }

  return (
    <AddPropertyForm types={propriedadeTipo} statuses={propriedadeStatus} currentUserId={dbUser.id}/>
  )
}

export default AddPropertyPage