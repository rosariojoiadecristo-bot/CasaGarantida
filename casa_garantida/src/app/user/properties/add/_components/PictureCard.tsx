import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline'; // Ou o seu ícone de lixeira

interface PictureCardProps {
  src: string;
  index: number;
  onDelete: (index: number) => void;
}

const PictureCard = ({ src, index, onDelete }: PictureCardProps) => {
  return (
    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
      <img src={src} alt="Preview" className="w-full h-full object-cover" />
      
      {/* BOTÃO DE ELIMINAR AQUI */}
      <button
        type="button" // <--- ESSENCIAL: impede o envio/refresh do formulário
        onClick={(e) => {
          e.preventDefault();  // Impede o comportamento padrão
          e.stopPropagation(); // Evita borbulhar o evento para a form
          onDelete(index);
        }}
        className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PictureCard;