import { getPropriedade } from "@/services/propriedadeService";
import { Propriedade } from "@/types/Propriedade";
import PropertyCard from "./components/PropertyCard";
import Link from "next/link";
import Search from "./components/Search";

type SearchParams = Promise<{
  page?: string;
  query?: string;
  provincia?: string;
  tipo?: number;
  precoMin?: string;
  precoMax?: string;
}>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.query || "";
  const provinciaQuery = resolvedParams?.provincia || "";
  const tipoQuery = resolvedParams?.tipo || "";
  const precoMin = resolvedParams?.precoMin ? Number(resolvedParams.precoMin) : undefined;
  const precoMax = resolvedParams?.precoMax ? Number(resolvedParams.precoMax) : undefined;

  const pageSize = 9;

  const propriedades: Propriedade[] = await getPropriedade();

  // 🔍 Filtragem combinada (AND): cada critério só filtra se tiver valor
  const filteredProperties = propriedades.filter((property) => {
    // Localização (mantido exatamente como estava)
    const matchLocalizacao = searchQuery
      ? property.localizacao?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Província
    const matchProvincia = provinciaQuery
      ? property.provincia?.toLowerCase() === provinciaQuery.toLowerCase()
      : true;

    // Tipo (T1 = 1, T2 = 2, ...)
    const matchTipo = tipoQuery
      ? Number(property.tipo?.id) === Number(tipoQuery)
      : true;

    // Preço mínimo
    const matchPrecoMin = precoMin !== undefined ? property.preco >= precoMin : true;

    // Preço máximo
    const matchPrecoMax = precoMax !== undefined ? property.preco <= precoMax : true;

    return matchLocalizacao && matchProvincia && matchTipo && matchPrecoMin && matchPrecoMax;
  });

  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + pageSize);

  // 🔹 Paginação preserva TODOS os filtros ativos
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (provinciaQuery) params.set("provincia", provinciaQuery);
    //if (tipoQuery) params.set("tipo", tipoQuery);
    // 🛠️ Converte o 'number' para 'string' ao adicionar aos parâmetros da URL
    if (resolvedParams?.tipo !== undefined) {
      params.set("tipo", String(resolvedParams.tipo));
    }
    if (resolvedParams?.precoMin) params.set("precoMin", resolvedParams.precoMin);
    if (resolvedParams?.precoMax) params.set("precoMax", resolvedParams.precoMax);
    params.set("page", pageNumber.toString());
    return `/?${params.toString()}`;
  };

  // Verifica se há filtros ativos (para mensagens contextuais)
  const hasActiveFilters =
    searchQuery || provinciaQuery || tipoQuery || precoMin !== undefined || precoMax !== undefined;

  return (
    <>
      <Search />
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {hasActiveFilters ? "Resultados da Pesquisa" : "Propriedades em Destaque"}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore os imóveis disponíveis com fotos e detalhes completos.
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              {hasActiveFilters
                ? "Nenhuma propriedade encontrada com os filtros aplicados."
                : "Nenhuma propriedade encontrada no momento."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    currentPage <= 1
                      ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Anterior
                </Link>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={createPageUrl(p)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        p === currentPage
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>

                <Link
                  href={createPageUrl(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    currentPage >= totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Seguinte
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}