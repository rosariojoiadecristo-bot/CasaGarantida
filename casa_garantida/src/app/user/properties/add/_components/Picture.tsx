"use client";

import FileInput from '@/app/components/fileUpload';
import { Card, cn } from '@heroui/react';
import React from 'react';
import PictureCard from './PictureCard';
import { Button } from '@heroui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  // Nova prop para receber as URLs vindas do banco de dados na edição
  existingImages?: string[];
  // Callback opcional se desejar remover imagens que já existiam no banco
  onRemoveExistingImage?: (index: number) => void;
}

// Domínio backend para renderizar URLs relativas (ex: /uploads/img.jpg)
const SERVER_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api").replace(/\/api$/, '');

const Picture = ({
  next,
  prev,
  className,
  images,
  setImages,
  existingImages = [],
  onRemoveExistingImage
}: Props) => {

  // Helper para formatar a URL caso venha relativa ou absoluta
  const formatImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${SERVER_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return (
    <Card className={cn("p-4 gap-4", className)}>
      <h3 className="font-semibold text-lg text-default-700">Fotos da Propriedade</h3>

      {/* Componente de Seleção de Novos Ficheiros */}
      <FileInput 
        onSelect={(e) => {
          const files = (e as any).target.files;
          if (files && files.length > 0) {
            // Adiciona o novo ficheiro mantendo a lista existente
            setImages([files[0], ...images]);
          }
        }}
      />

      <div className='flex gap-3 flex-wrap mt-2'>
        {/* 1. Renderizar Imagens Existentes (do Banco de Dados) */}
        {existingImages.map((src, index) => (
          <div key={`existing-${index}`} className="relative group">
            <PictureCard 
              src={formatImageUrl(src)} 
              index={index} 
              onDelete={() => {
                if (onRemoveExistingImage) {
                  onRemoveExistingImage(index);
                }
              }}
            />
            {/* Tag indicativa para saber que a foto já está salva no servidor */}
            <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
              Existente
            </span>
          </div>
        ))}

        {/* 2. Renderizar Novas Imagens Selecionadas (Preview Local) */}
        {images.map((image, index) => {
          const srcUrl = URL.createObjectURL(image);
          return (
            <PictureCard 
              key={`new-${srcUrl}`} 
              src={srcUrl} 
              index={index} 
              onDelete={(i) => {
                setImages([...images.slice(0, i), ...images.slice(i + 1)]);
              }}
            />
          );
        })}
      </div>

      {/* Navegação do Form Step */}
      <div className='flex justify-center col-span-2 gap-3 mt-4'>
        <Button 
          onClick={prev} 
          startContent={<ChevronLeftIcon className='w-5' />} 
          color='primary' 
          variant='flat'
          className='w-36'
        >
          Anterior
        </Button>
        <Button 
          onClick={next} 
          endContent={<ChevronRightIcon className='w-5' />} 
          color='primary' 
          className='w-36'
        >
          Próximo
        </Button>
      </div>
    </Card>
  );
};

export default Picture;