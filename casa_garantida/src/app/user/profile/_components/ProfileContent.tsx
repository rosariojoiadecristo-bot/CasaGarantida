"use client";

import React, { ReactNode } from 'react';
import { Avatar, Card } from '@heroui/react';
import SectionTitle from './sectionTitle';
import { Usuario } from '@/types/Usuario';
import UploadAvatar from './UploadAvatar';

interface ProfileContentProps {
    dbUser: Usuario | null;
    kindeUser: any;
}

export default function ProfileContent({ dbUser, kindeUser }: ProfileContentProps) {
    const baseUrl = "http://localhost:5160";
    return (
        <Card className='m-4 p-4'>
            <SectionTitle title='Basic Information' />
            <div className='flex'>
                <div className='flex flex-col items-center'>
                <Avatar className="w-20 h-20 flex-shrink-0">
                    <Avatar.Image
                    alt="/avatar.png"
                    src={`${baseUrl}${dbUser?.avatarUrl?.trim() || "/avatar.png"}?t=${new Date().getTime()}`}
                    className="object-cover w-full h-full rounded-full"/>
                </Avatar>
                <UploadAvatar email={dbUser?.email!}/>
            </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Attribute title='Nome' value={`${dbUser?.firstName} ${dbUser?.lastName}`}/>
                <Attribute title='Email' value={dbUser?.email}/>
            </div>
        </Card>
    );
}

const Attribute = ({title, value}: {title: string; value: ReactNode}) => (
    <div className='flex flex-col text-sm'>
        <span className='text-slate-800 font-semibold'>{title}</span>
        <span className='text-slate-600'>{value}</span>
    </div>
);