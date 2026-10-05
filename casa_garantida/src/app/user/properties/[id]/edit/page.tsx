import { notFound, redirect } from "next/navigation";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { Propriedade } from "@/types/Propriedade";
import { PropriedadeStatus } from "@/types/PropriedadeStatus";
import { PropriedadeTipo } from "@/types/PropriedadeTipo";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Usuario } from "@/types/Usuario";

interface Props {
  params: Promise<{ id: string }>; // Em versões recentes do Next.js (App Router), `params` é uma Promise
}

const EditPropertyPage = async ({ params }: Props) => {
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

  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  const res = await fetch(`${baseUrl}/Propriedade/${Number(resolvedParams.id)}`, {
    cache: 'no-store'
  });

  if (!res.ok) return notFound();

  const property: Propriedade = await res.json();

  const {isAuthenticated, getUser } = await getKindeServerSession();
  const isAuth = await isAuthenticated();
  const user = await getUser();

  if (!property) 
    return notFound();

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

  // ✅ AGORA usamos o Id DO BANCO DE DADOS (dbUser.id), não o do Kinde
  if (property.userId !== dbUser.id) {
    redirect("/unauthorized");
  }

    return (
      <AddPropertyForm
        types={propriedadeTipo}
        statuses={propriedadeStatus}
        property={property}
        isEdit={true}
        currentUserId={dbUser.id} 
      />
    );
  
};

export default EditPropertyPage;