"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
    images: string[];
}

export function PropriedadeImagesSlider({ images }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:5160";

    const formattedImages = images.map((image) =>
        image.startsWith("http") ? image : `${baseUrl}${image}`
    );

    if (formattedImages.length === 0) {
        return (
            <div className="h-[25rem] flex items-center justify-center rounded-xl bg-gray-100">
                <p className="text-gray-500">
                    Nenhuma imagem disponível
                </p>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentIndex((current) =>
            current === formattedImages.length - 1 ? 0 : current + 1
        );
    };

    const previousImage = () => {
        setCurrentIndex((current) =>
            current === 0 ? formattedImages.length - 1 : current - 1
        );
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
            <div className="relative h-[25rem] w-full">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={formattedImages[currentIndex]}
                        src={formattedImages[currentIndex]}
                        alt={`Imagem ${currentIndex + 1} do imóvel`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </AnimatePresence>

                {formattedImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={previousImage}
                            aria-label="Imagem anterior"
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-xl text-white hover:bg-black/70"
                        >
                            ‹
                        </button>

                        <button
                            type="button"
                            onClick={nextImage}
                            aria-label="Próxima imagem"
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-4 py-2 text-xl text-white hover:bg-black/70"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {formattedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                    {formattedImages.map((image, index) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ver imagem ${index + 1}`}
                            className={`h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                                index === currentIndex
                                    ? "border-primary"
                                    : "border-transparent"
                            }`}
                        >
                            <img
                                src={image}
                                alt={`Miniatura ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}