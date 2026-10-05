export async function deleteProperty(id: number) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api";

  const response = await fetch(`${API_URL}/Propriedade/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Não foi possível eliminar a propriedade.";

    try {
      const data = await response.json();

      if (typeof data === "string") {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
    } catch {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  return await response.json();
}

/*export async function deleteProperty(id: number) {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5160/api";

    const response = await fetch(
        `${API_URL}/Propriedade/${id}`,
        {
            method: "DELETE",
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText || "Não foi possível eliminar a propriedade."
        );
    }

    return await response.json();
}*/