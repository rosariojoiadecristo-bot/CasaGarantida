"use client";

import FileInput from '@/app/components/fileUpload';
import { Card, cn } from '@heroui/react';
import React, { useState } from 'react';
import PictureCard from './PictureCard';
import { Button } from '@heroui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  images: File[];
  setImages: (images: File[]) => void;
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
}

// Domínio backend para renderizar URLs relativas (ex: /uploads/img.jpg)
const SERVER_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5160/api").replace(/\/api$/, '');

/* ---------- Configuração de validação ---------- */
const EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.svg'];
const TAMANHO_MAXIMO_MB = 5; // 👈 opcional: limite de 5 MB por ficheiro
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

const Picture = ({
  next,
  prev,
  className,
  images,
  setImages,
  existingImages = [],
  onRemoveExistingImage,
}: Props) => {
  const [erro, setErro] = useState<string | null>(null);

  /* Helper para formatar a URL caso venha relativa ou absoluta */
  const formatImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${SERVER_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  /* ---------- Validação de ficheiro ---------- */
  const validarFicheiro = (file: File): string | null => {
    // 1. Extensão
    const extensao = '.' + (file.name.split('.').pop() || '').toLowerCase();

    if (!EXTENSOES_PERMITIDAS.includes(extensao)) {
      return `Formato não suportado. Use apenas: ${EXTENSOES_PERMITIDAS.join(', ')}.`;
    }

    // 2. Tamanho (opcional)
    if (file.size > TAMANHO_MAXIMO_BYTES) {
      return `O ficheiro "${file.name}" excede ${TAMANHO_MAXIMO_MB} MB.`;
    }

    return null;
  };

  /* ---------- Handler de seleção ---------- */
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErro(null);

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const novosFicheiros: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const erroFile = validarFicheiro(file);

      if (erroFile) {
        setErro(erroFile);
        // Limpa o input para permitir re-selecionar o mesmo ficheiro
        e.target.value = '';
        return; // ❌ bloqueia o lote inteiro se algum for inválido
      }

      novosFicheiros.push(file);
    }

    // Se passou em todas as validações, adiciona
    setImages([...novosFicheiros, ...images]);

    // Limpa o input para permitir selecionar o mesmo ficheiro novamente
    e.target.value = '';
  };

  return (
    <Card className={cn("p-4 gap-4", className)}>
      <h3 className="font-semibold text-lg text-default-700">
        Fotos da Propriedade
      </h3>

      {/* Componente de Seleção de Novos Ficheiros */}
      <FileInput onSelect={handleSelect} accept={EXTENSOES_PERMITIDAS.join(',')} />

      {/* Mensagem de erro */}
      {erro && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      {/* Info sobre formatos aceitos */}
      <p className="text-xs text-default-400">
        Formatos aceitos: <strong>.jpg, .jpeg, .png, .svg</strong> (máx. {TAMANHO_MAXIMO_MB} MB)
      </p>

      <div className='flex gap-3 flex-wrap mt-2'>
        {/* 1. Imagens Existentes (do Banco de Dados) */}
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
            <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
              Existente
            </span>
          </div>
        ))}

        {/* 2. Novas Imagens Selecionadas (Preview Local) */}
        {images.map((image, index) => {
          const srcUrl = URL.createObjectURL(image);
          return (
            <PictureCard
              key={`new-${image.name}-${index}`}
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

/*"use client";

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
            <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
              Existente
            </span>
          </div>
        ))}

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

export default Picture;*/