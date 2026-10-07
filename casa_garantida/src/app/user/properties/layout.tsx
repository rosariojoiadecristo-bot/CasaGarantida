import { Button } from "@heroui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  contacto1?: number | null;
  tipoUsuarioId: number; // 1 = Administrador, 2 = Gestor, 3 = Cliente
}

const PropertiesLayout = async ({ children}: Props) => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  // 👇 2. await em isAuthenticated() e getUser()
  const authenticated = await isAuthenticated();
  if (!authenticated) redirect("/unauthorized");

  const kindeUser = await getUser();
  if (!kindeUser?.email) redirect("/unauthorized");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  // 👇 3. await no fetch também
  const response = await fetch(
    `${API_URL}/Usuario/by-email?email=${encodeURIComponent(kindeUser.email)}`,
    { cache: "no-store" }
  );

  if (!response.ok) redirect("/unauthorized");

  const usuarioBanco: Usuario = await response.json();

  return (
    <>
      <div className="bg-primary-400 flex justify-between items-center p-2">
        <h2 className="text-white text-xl font-semibold px-2">
          Propriedades
        </h2>

        {usuarioBanco.tipoUsuarioId === 1 && (
        <Button color="secondary" as={Link} href="/user/properties/add">
          + Adicionar imóvel
        </Button>
        )}
      </div>

      {children}
    </>
  );
};

export default PropertiesLayout;