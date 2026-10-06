"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const Search = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Valor inicial do input vem direto da URL (se houver)
    const defaultValue = searchParams.get("query")?.toString() || "";

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Sempre que pesquisar, volta para a página 1
        params.set("page", "1");

        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }

        // Atualiza a URL sem recarregar a página inteira
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className='p-6 flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md'>
            <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className='w-5 h-5 text-gray-400' />
                </span>
                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={defaultValue}
                    placeholder="Pesquisar propriedade por província..."
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm"
                />
            </div>
        </div>
    );
};

export default Search;