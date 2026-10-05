import { PropriedadeStatus } from '@/types/PropriedadeStatus';
import { PropriedadeTipo } from '@/types/PropriedadeTipo';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Card, cn, Input, Label, ListBox, Select, TextArea } from '@heroui/react';
import React from 'react'

interface Props{
    className?: string;
    types: PropriedadeTipo[];
    statuses: PropriedadeStatus[];
    next: () => void;
    data: any;
    updateFields: (fields: any) => void;
}

const Basic = (props: Props) => {
    const handleNext = () => props.next();
  return (
    <Card className={cn("p-4 gap-4 grid grid-cols-1 md:grid-cols-3 w-full", props.className)}>
        <div className="flex flex-col gap-2">
            <Label>Tipo de negocio</Label>
            <Input 
                label="Name" 
                value={props.data.name}
                onChange={(e) => props.updateFields({ name: e.target.value })}
                className='md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
                placeholder='Tipo de negocio'
            />
        </div>

        <div className="flex flex-col gap-2">
            <Label>Preço do Imovel</Label>
            <Input 
                label="Preco"
                type="number"
                value={props.data.preco.toString()}
                onChange={(e) => props.updateFields({ preco: Number(e.target.value) })}
                className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <Select
            className="w-full"
            value={props.data.typeId ? String(props.data.typeId) : ""}
            onChange={(value) =>
                props.updateFields({
                    typeId: Number(value),
                })
            }
        >
            <Label>Tipo</Label>
            <Select.Trigger className="w-full h-12 border rounded-lg px-3 flex justify-between items-center bg-default-100">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="bg-white shadow-lg rounded-lg p-1 z-50">
                <ListBox>
                    {props.types.map((item) => (
                        <ListBox.Item
                            key={item.id}
                            id={String(item.id)}
                            textValue={item.value}
                            className="p-2 rounded-md cursor-pointer flex justify-between items-center"
                        >
                            {item.value}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
        </div>
        
        <div className="flex flex-col gap-2">
            <Select
            className="w-full"
            value={props.data.statusId ? String(props.data.statusId) : ""}
            onChange={(value) =>
                props.updateFields({
                    statusId: Number(value),
                })
            }
        >
            <Label>Status</Label>
            <Select.Trigger className="w-full border rounded-medium p-2 flex justify-between items-center bg-default-100">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="bg-white shadow-medium rounded-medium p-1 z-50">
                <ListBox>
                    {props.statuses.map((item) => (
                        <ListBox.Item
                            key={item.id}
                            id={String(item.id)}
                            textValue={item.value}
                            className="p-2 hover:bg-default-100 cursor-pointer rounded-small flex justify-between items-center"
                        >
                            {item.value}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
        </div>

        <div className="flex flex-col gap-2">
            <Label>Descrição do imóvel</Label>
            <TextArea
              aria-label="Description"
              value={props.data.descricao} onChange={(e) => props.updateFields({ descricao: e.target.value })}
              className="h-32 w-96 md:col-span-3 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              placeholder="Digite a descrição do imóvel"
            />
        </div>

        <div className='flex justify-center col-span-3 gap-3 mt-4'>
            <Button isDisabled startContent={<ChevronLeftIcon className='w-6'/>} color='primary' className='w-36'>Anterior</Button>
            <Button onClick={handleNext} endContent={<ChevronRightIcon className='w-6'/>} color='primary' className='w-36'>Proximo</Button>
        </div>
    </Card>
  )
}

export default Basic