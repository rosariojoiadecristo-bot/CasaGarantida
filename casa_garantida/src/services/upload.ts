/*export async function uploadPropriedadeImages(images: File[]){
    const formData = new FormData();
    formData.append("file", images);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

    const response = await fetch(`${apiUrl}/Propriedade/upload-images`, {
        method: "POST",
        body: formData, // O navegador define automaticamente o Content-Type como multipart/form-data
    });

    const supabase = createClient(supabaseUrl, supabaseKey);

    const data = await Promise.all(
        images.map((file) =>
            supabase.storage.from("propertyImages").upload(`${file.name}_${Date.now()}`, file)
        )
    );

    const urls = data.map((item) =>
        supabase.storage.from("propertyImages").getPublicUrl(item.data?.path ?? "").data.publicUrl
    );

    return urls;
}*/


export async function uploadAvatarFile(image: File, email: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("email", email);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

    const response = await fetch(`${apiUrl}/Usuario/upload-avatar-file`, {
        method: "POST",
        body: formData, // O navegador define automaticamente o Content-Type como multipart/form-data
    });

    if (!response.ok) {
        throw new Error("Falha ao fazer upload da imagem");
    }

    if (!response.ok) {
        // Tente ler a mensagem de erro do servidor
        const errorText = await response.text();
        console.error("Erro do servidor:", errorText); 
        throw new Error(`Falha no upload: ${response.status} - ${errorText}`);
    }

    return await response.json();
}