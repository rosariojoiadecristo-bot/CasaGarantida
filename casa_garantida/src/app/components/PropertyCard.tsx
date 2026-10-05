import Link from "next/link";
import { Propriedade } from "@/types/Propriedade";

type Props = {
  property: Propriedade;
};

export default function PropertyCard({ property }: Props) {
  // Pega a primeira imagem da lista (se existir) para usar como capa
  const primeiraImagem = property.imagensList && property.imagensList.length > 0 
    ? property.imagensList[0] 
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
      {/* Contentor da Imagem */}
      <div className="relative h-48 w-full bg-gray-100">
        {primeiraImagem ? (
          <img 
            src={`http://localhost:5160${primeiraImagem}`} // Ajuste o domínio/porta da API se necessário
            alt={property.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sem imagem
          </div>
        )}
        
        {/* Badge de Estado opcional */}
        {property.estado && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {property.estado}
          </span>
        )}
      </div>

      {/* Detalhes da Propriedade */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {property.name}
        </h2>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {property.descricao || "Sem descrição informada."}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Preço</span>
            <span className="text-lg font-bold text-indigo-600">
              {property.preco.toLocaleString("pt-AO")} Kz
            </span>
          </div>

          <Link 
            href={`/propriedade/${property.id}`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}