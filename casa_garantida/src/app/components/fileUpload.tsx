"use client";

import React, { useState } from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement>{
    children?: React.ReactNode;
    lablText?: string;
    onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, IProps>((
    {
        children, className, lablText, onChange, onSelect, error, ...props
    },
    ref ) => {
        const [fileName, setFileName] = useState("");
        function fileChangedHandler(e: any){
            const file = e.target.files[0];
            if (file) {
                setFileName(file.name);
            }
            onChange && onChange(e);
            onSelect && onSelect(e);
        }

        return (
            <div className={className}>
                {lablText && (
                    <label className='block text-gray-600 text-xs lg:text-sm xl:text-base mb-2' htmlFor='txt'>
                        {lablText}
                    </label>
                )}
                <label className={"w-full relative border flex items-center rounded-md cursor-pointer group overflow-hidden"}>
                    <div className={`inline-block py-2 px-3 text-white transition duration-500 bg-primary-500 hover:bg-primary-700 shadow`}>
                        <input className='hidden' ref={ref} onChange={(e) => fileChangedHandler(e)}
                        {...props} type='file'/>
                        Upload File
                    </div>
                    <span className='mx-2 text-sm text-gray-500 truncate'>{fileName || "Nenhum arquivo selecionado"}</span>
                </label>
            </div>
        );
    });

FileInput.displayName = "FileInput";

export default FileInput;