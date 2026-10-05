import { PlusCircleIcon, ChevronLeftIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Card, cn, Input, Label } from '@heroui/react';
import React from 'react'

interface Props{
    prev: () => void;
    className?: string;
    data: any;
    updateFields: (fields: any) => void;
}

const Contact = ({prev, className, data, updateFields}: Props) => {
  return (
    <Card className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 p-2", className)}>
        <div className="flex flex-col gap-2">
          <Label>Contacto</Label>
          <Input label="Contact Name" value={data.contacto} onChange={(e) => updateFields({ contacto: e.target.value })}
          className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
          placeholder='Digite o contacto'/>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Telefone</Label>
          <Input label="Telefone" type="number" value={data.telefone.toString()} onChange={(e) => updateFields({ telefone: Number(e.target.value) })}
          className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
          placeholder='Digite o numero do telefone'/>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input label="Email" value={data.email} onChange={(e) => updateFields({ email: e.target.value })}
          className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
          placeholder='Digite o email'/>
        </div>
        
        <div className='flex justify-center col-span-3 gap-3'>
            <Button onClick={prev} startContent={<ChevronLeftIcon className='w-6'/>} color='primary' className='w-36'>Anterior</Button>
            <Button endContent={<PlusCircleIcon className='w-6'/>} color='secondary' className='w-36' type='submit'>Salvar</Button>
        </div>
    </Card>
  )
}

export default Contact