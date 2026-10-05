import DeletePropertyForm from "./DeletePropertyForm";
import { Propriedade } from "@/types/Propriedade";
import { Usuario } from "@/types/Usuario";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

const  DeletePropertyPage = async ({ params }: Props) => {
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

    return (<DeletePropertyForm propertyId={Number(resolvedParams.id)} propertyName={property.name} />);
}

export default DeletePropertyPage