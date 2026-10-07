"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Lista de províncias (podes ajustar/mover para um ficheiro de constantes)
const PROVINCIAS = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire",
];

// Tipologias: value = id numérico, label = texto mostrado
const TIPOS = [
  { id: 1, label: "T1" },
  { id: 2, label: "T2" },
  { id: 3, label: "T3" },
  { id: 4, label: "T4" },
  { id: 5, label: "T5" },
];

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 🔹 Estado local para cada campo (controlado)
  const [localizacao, setLocalizacao] = useState(searchParams.get("query") || "");
  const [provincia, setProvincia] = useState(searchParams.get("provincia") || "");
  const [tipo, setTipo] = useState(searchParams.get("tipo") || "");
  const [precoMin, setPrecoMin] = useState(searchParams.get("precoMin") || "");
  const [precoMax, setPrecoMax] = useState(searchParams.get("precoMax") || "");

  // 🔹 Sincroniza o estado local quando a URL muda (ex.: voltar/avançar, paginação)
  useEffect(() => {
    setLocalizacao(searchParams.get("query") || "");
    setProvincia(searchParams.get("provincia") || "");
    setTipo(searchParams.get("tipo") || "");
    setPrecoMin(searchParams.get("precoMin") || "");
    setPrecoMax(searchParams.get("precoMax") || "");
  }, [searchParams]);

  // 🔹 Função central que aplica TODOS os filtros à URL
  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Sempre volta à página 1 quando os filtros mudam
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handlers individuais (cada um mexe apenas no seu parâmetro)
  const handleLocalizacao = (term: string) => {
    setLocalizacao(term);
    applyFilters({ query: term });
  };

  const handleProvincia = (value: string) => {
    setProvincia(value);
    applyFilters({ provincia: value });
  };

  const handleTipo = (value: string) => {
    setTipo(value);
    applyFilters({ tipo: value });
  };

  const handlePrecoMin = (value: string) => {
    setPrecoMin(value);
    applyFilters({ precoMin: value });
  };

  const handlePrecoMax = (value: string) => {
    setPrecoMax(value);
    applyFilters({ precoMax: value });
  };

  // Limpar todos os filtros
  const handleClear = () => {
    setLocalizacao("");
    setProvincia("");
    setTipo("");
    setPrecoMin("");
    setPrecoMax("");
    router.replace(pathname);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">

        {/* 🔍 Campo: Localização (mantido como antes) */}
        <div className="relative w-full lg:col-span-2">
          <label className="block text-white text-xs font-medium mb-1">Localização</label>
          <span className="absolute inset-y-0 left-0 top-5 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => handleLocalizacao(e.target.value)}
            placeholder="Pesquisar por localização..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
          />
        </div>

        {/* 🗺️ Campo: Província */}
        <div className="w-full">
          <label className="block text-white text-xs font-medium mb-1">Província</label>
          <select
            value={provincia}
            onChange={(e) => handleProvincia(e.target.value)}
            className="w-full px-3 py-3 bg-white rounded-xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
          >
            <option value="">Todas</option>
            {PROVINCIAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 🏠 Campo: Tipo */}
        <div className="w-full">
          <label className="block text-white text-xs font-medium mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => handleTipo(e.target.value)}
            className="w-full px-3 py-3 bg-white rounded-xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
          >
            <option value="">Todos</option>
            {TIPOS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* 💰 Campos: Preço Mín / Máx */}
        <div className="w-full flex gap-2">
          <div className="flex-1">
            <label className="block text-white text-xs font-medium mb-1">Preço mín.</label>
            <input
              type="number"
              min={0}
              value={precoMin}
              onChange={(e) => handlePrecoMin(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 bg-white rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-white text-xs font-medium mb-1">Preço máx.</label>
            <input
              type="number"
              min={0}
              value={precoMax}
              onChange={(e) => handlePrecoMax(e.target.value)}
              placeholder="∞"
              className="w-full px-3 py-3 bg-white rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      <div className="max-w-6xl mx-auto mt-3 flex justify-end">
        <button
          onClick={handleClear}
          className="text-white text-xs underline hover:no-underline"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
};

export default Search;