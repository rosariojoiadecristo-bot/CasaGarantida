import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Card, cn, Input, Label } from '@heroui/react';
import React from 'react'

interface Props{
    next: () => void;
    prev: () => void;
    className?: string;
    data: any;
    updateFields: (fields: any) => void;
}

const Location = (props: Props) => {
  return (
    <Card className={cn("p-2 gap-3 grid grid-cols-1 md:grid-cols-3", props.className)}>
        <div className="flex flex-col gap-2">
            <Label>Localização</Label>
            <Input label="Localizacao" value={props.data.localizacao} onChange={(e) => props.updateFields({ localizacao: e.target.value })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder=' Digite a Localização do imovel'/>
        </div>

        <div className="flex flex-col gap-2">
            <Label>Província</Label>
            <Input label="Provincia" value={props.data.provincia} onChange={(e) => props.updateFields({ provincia: e.target.value })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder=' Digite a provincia'/>
        </div>

        <div className="flex flex-col gap-2">
            <Label>Estado</Label>
            <Input label="State" value={props.data.estado} onChange={(e) => props.updateFields({ estado: e.target.value })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder=' Digite o estado do imovel'/>
        </div>
        
        <div className="flex flex-col gap-2">
            <Label>Região</Label>
            <Input label="Region" value={props.data.regiao} onChange={(e) => props.updateFields({ regiao: e.target.value })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder=' Digite o estado do imovel'/>
        </div>
        
        <div className='flex justify-center col-span-3 gap-3'>
            <Button onClick={props.prev} startContent={<ChevronLeftIcon className='w-6'/>} color='primary' className='w-36'>Anterior</Button>
            <Button onClick={props.next} endContent={<ChevronRightIcon className='w-6'/>} color='primary' className='w-36'>Proximo</Button>
        </div>
    </Card>
  );
}

export default Location