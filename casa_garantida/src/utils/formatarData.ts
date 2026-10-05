export function formatarData(data: string | Date | null | undefined): string {
  if (!data) return "-";

  const date = typeof data === "string" ? new Date(data) : data;

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}