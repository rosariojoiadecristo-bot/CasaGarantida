import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    throw new Error("Usuário não possui e-mail válido no Kinde.");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  // Envia os dados para verificação/criação via e-mail
  await fetch(`${apiUrl}/Usuario/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: user.given_name ?? "",
      lastName: user.family_name ?? "",
      email: user.email,
    }),
  });

  const redirectUrl = process.env.KINDE_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(redirectUrl);
}