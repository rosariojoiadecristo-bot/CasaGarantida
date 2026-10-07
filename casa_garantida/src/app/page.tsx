import { getPropriedade } from "@/services/propriedadeService";
import { Propriedade } from "@/types/Propriedade";
import PropertyCard from "./components/PropertyCard";
import Link from "next/link";
import Search from "./components/Search";

type SearchParams = Promise<{ page?: string; query?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  // Aguarda os parâmetros de busca do Next.js
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.query || "";
  const pageSize = 9; // Número de propriedades por página

  // Obtém todas as propriedades da base de dados através do serviço
  const propriedades: Propriedade[] = await getPropriedade();

  // 🔍 Filtrar propriedades pelo nome (com base no 'query')
  const filteredProperties = propriedades.filter((property) =>
    property.localizacao?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cálculos de paginação baseados nos itens filtrados
  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + pageSize);

  // Função auxiliar para manter o parâmetro 'query' nos links de paginação
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    params.set("page", pageNumber.toString());
    return `/?${params.toString()}`;
  };

  return (
    <> 
      <Search />
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Propriedades em Destaque"}
          </h1>
          <p className="text-gray-600 mt-2">Explore os imóveis disponíveis com fotos e detalhes completos.</p>
        </div>

        {/* Se não houver propriedades cadastradas ou encontradas */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              {searchQuery 
                ? `Nenhuma propriedade encontrada na localidade "${searchQuery}".` 
                : "Nenhuma propriedade encontrada no momento."}
            </p>
          </div>
        ) : (
          <>
            {/* Grelha de Cartões (Apenas os itens da página atual) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {/* Botão Anterior */}
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

                {/* Números das Páginas */}
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

                {/* Botão Seguinte */}
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