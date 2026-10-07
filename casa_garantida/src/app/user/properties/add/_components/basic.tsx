import { PropriedadeStatus } from '@/types/PropriedadeStatus';
import { PropriedadeTipo } from '@/types/PropriedadeTipo';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Card, cn, Input, Label, TextArea } from '@heroui/react';
import React, { useState } from 'react';

interface Props {
  className?: string;
  types: PropriedadeTipo[];
  statuses: PropriedadeStatus[];
  next: () => void;
  data: any;
  updateFields: (fields: any) => void;
}

/* 👇 Opções fixas de tipo de negócio */
const TIPOS_NEGOCIO = [
  { id: 'vende-se', value: 'Vende-Se' },
  { id: 'aluga-se', value: 'Aluga-Se' },
];

/* 👇 Estilo reutilizável para <select> nativo */
const selectClass =
  'w-full rounded-medium border border-gray-200 bg-default-100 px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50';

const Basic = (props: Props) => {
  const [touched, setTouched] = useState(false);

  /* ---------- Validação ---------- */
  const tipoNegocioPreenchido = Boolean(props.data.name);
  const precoPreenchido =
    props.data.preco !== undefined &&
    props.data.preco !== null &&
    String(props.data.preco).trim() !== '' &&
    Number(props.data.preco) > 0;

  const formValido = tipoNegocioPreenchido && precoPreenchido;

  const handleNext = () => {
    setTouched(true);
    if (!formValido) return; // ❌ bloqueia
    props.next();
  };

  return (
    <Card
      className={cn(
        'p-4 gap-4 grid grid-cols-1 md:grid-cols-3 w-full',
        props.className
      )}
    >
      {/* ============================ */}
      {/* TIPO DE NEGÓCIO (select nativo) */}
      {/* ============================ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">
          Tipo de negócio <span className="text-red-500">*</span>
        </label>

        <select
          value={props.data.name ?? ''}
          onChange={(e) =>
            props.updateFields({ name: e.target.value })
          }
          className={cn(
            selectClass,
            touched && !tipoNegocioPreenchido && 'border-red-500'
          )}
        >
          <option value="">Selecione...</option>
          {TIPOS_NEGOCIO.map((item) => (
            <option key={item.id} value={item.value}>
              {item.value}
            </option>
          ))}
        </select>

        {touched && !tipoNegocioPreenchido && (
          <p className="text-xs text-red-500">
            Selecione o tipo de negócio.
          </p>
        )}
      </div>

      {/* ============================ */}
      {/* PREÇO */}
      {/* ============================ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">
          Preço do Imóvel <span className="text-red-500">*</span>
        </label>

        <Input
          label="Preco"
          type="number"
          value={
            props.data.preco !== undefined && props.data.preco !== null
              ? String(props.data.preco)
              : ''
          }
          onChange={(e) =>
            props.updateFields({ preco: Number(e.target.value) })
          }
          className={cn(
            'rounded border border-gray-200 px-3 py-1.5 text-sm outline-none',
            touched && !precoPreenchido && 'border-red-500'
          )}
          placeholder="Ex: 150000"
        />

        {touched && !precoPreenchido && (
          <p className="text-xs text-red-500">
            Insira um preço válido.
          </p>
        )}
      </div>

      {/* ============================ */}
      {/* TIPO DE IMÓVEL (select nativo) */}
      {/* ============================ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Tipo</label>

        <select
          value={props.data.typeId ? String(props.data.typeId) : ''}
          onChange={(e) =>
            props.updateFields({ typeId: Number(e.target.value) })
          }
          className={selectClass}
        >
          <option value="">Selecione...</option>
          {props.types.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.value}
            </option>
          ))}
        </select>
      </div>

      {/* ============================ */}
      {/* STATUS (select nativo) */}
      {/* ============================ */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Status</label>

        <select
          value={props.data.statusId ? String(props.data.statusId) : ''}
          onChange={(e) =>
            props.updateFields({ statusId: Number(e.target.value) })
          }
          className={selectClass}
        >
          <option value="">Selecione...</option>
          {props.statuses.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.value}
            </option>
          ))}
        </select>
      </div>

      {/* ============================ */}
      {/* DESCRIÇÃO */}
      {/* ============================ */}
      <div className="flex flex-col gap-2 md:col-span-3">
        <Label>Descrição do imóvel</Label>
        <TextArea
          aria-label="Description"
          value={props.data.descricao ?? ''}
          onChange={(e) => props.updateFields({ descricao: e.target.value })}
          className="h-32 w-full rounded border border-gray-200 px-3 py-1.5 text-sm outline-none"
          placeholder="Digite a descrição do imóvel"
        />
      </div>

      {/* ============================ */}
      {/* NAVEGAÇÃO */}
      {/* ============================ */}
      <div className="flex justify-center col-span-3 gap-3 mt-4">
        <Button
          isDisabled
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Próximo
        </Button>
      </div>
    </Card>
  );
};

export default Basic;