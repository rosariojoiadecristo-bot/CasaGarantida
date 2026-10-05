import React from 'react';
import { Propriedade } from "@/types/Propriedade";
import PropertyCard from '@/app/components/PropertyCard';

interface MinhasPropriedadesProps {
  properties: Propriedade[];
}

export default function MinhasPropriedades({ properties }: MinhasPropriedadesProps) {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Suas Propriedades</h1>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">
            O senhor ainda não possui nenhuma propriedade associada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}