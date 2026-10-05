import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Card, Input, Label, cn } from '@heroui/react';
import React from 'react'

interface Props{
    next: () => void;
    prev: () => void;
    className?: string;
    data: any;
    updateFields: (fields: any) => void;
}

const Features = (props: Props) => {
  return (
    <Card className={cn("p-2 gap-3 grid grid-cols-1 md:grid-cols-3", props.className)}>
        <div className="flex flex-col gap-2">
            <Label>Quantidade de quartos</Label>
            <Input label="Quarto" type="number" value={props.data.quarto.toString()} onChange={(e) => props.updateFields({ quarto: Number(e.target.value) })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder='Digite a quantidade de quartos'/>
        </div>

        <div className="flex flex-col gap-2">
            <Label>Quintal</Label>
            <Input label="Quintal" type="number" value={props.data.quintal.toString()} onChange={(e) => props.updateFields({ quintal: Number(e.target.value) })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder='Quintal'/>
        </div>

        <div className="flex flex-col gap-2">
            <Label>Garagem</Label>
            <Input label="Garagem" type="number" value={props.data.garagem.toString()} onChange={(e) => props.updateFields({ garagem: Number(e.target.value) })}
            className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            placeholder='Digite a quantidade de garagem'/>
        </div>

        <div className='flex justify-center col-span-3 gap-3'>
            <Button onClick={props.prev} startContent={<ChevronLeftIcon className='w-6'/>} color='primary' className='w-36'>Anterior</Button>
            <Button onClick={props.next} endContent={<ChevronRightIcon className='w-6'/>} color='primary' className='w-36'>Proximo</Button>
        </div>
    </Card>
  )
}

export default Features