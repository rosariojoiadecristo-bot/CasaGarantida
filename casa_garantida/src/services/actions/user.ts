"use server";

export async function getUserByEmail(email: string) {
    if (!email) return null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

    try {
        // Substitua pela URL base correta da sua API C# (ex: https://localhost:7121/api)
        const response = await fetch(`${apiUrl}/Usuario/by-email?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Se precisar desativar o cache para obter sempre o dado atualizado:
            cache: "no-store", 
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // Usuário não encontrado
            }
            throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Erro na comunicação com a API C#:", error);
        return null;
    }
}

export async function updateUserAvatar(avatarUrl: string, email: string) {
    if (!email || !avatarUrl) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

    try {
        const response = await fetch(`${apiUrl}/Usuario/update-avatar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, avatarUrl }),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar avatar: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na comunicação com a API C#:", error);
        return null;
    }
}