"use client";

import { PencilIcon } from "@heroicons/react/16/solid";
import { Button, Modal } from "@heroui/react";
import { useState } from "react";
import FileInput from "../../../components/fileUpload";
import Image from "next/image";
import { uploadAvatarFile } from "@/services/upload";
import { useRouter } from "next/navigation";

const UploadAvatar = ({email}: {email: string}) => {
    const [image, setImage] = useState<File>();
    const [isOpen, setIsOpen] = useState(false); // Controle de abertura
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    
    // Cria a URL temporária ou usa o avatar padrão local da pasta public
    const imageSrc = image ? URL.createObjectURL(image) : "/avatar.png";

    return (
        <div>
            <Modal>
                <Button variant="secondary" className="flex" onPress={() => setIsOpen(true)}>
                    <PencilIcon className="w-6 text-slate-400 hover:text-primary transition-colors"/>
                    Alterar foto
                </Button>
                {/* Adicionado flex, items-center e justify-center para centralizar */}
                <Modal.Backdrop className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" isOpen={isOpen} onOpenChange={setIsOpen}>
                    <Modal.Container className="flex items-center justify-center w-full">
                        <Modal.Dialog className="sm:max-w-[360px] w-full bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading className="text-lg font-semibold">Upload your Avatar</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="my-4">
                                <FileInput onChange={(e) => setImage((e as any).target.files[0])}/>
                                <div className="mt-4 flex justify-center">
                                    <Image 
                                        src={imageSrc} 
                                        alt="Avatar Preview" 
                                        width={100} 
                                        height={100} 
                                        className="rounded-full object-cover w-24 h-24 border"
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="flex justify-end gap-2">
                                <Button className="text-danger" onPress={() => setIsOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button 
                                    isLoading={isSubmitting} 
                                    className="mt-2 flex items-center gap-2 px-0 min-w-0 bg-transparent text-slate-600 hover:bg-transparent hover:text-blue-600 transition-colors" 
                                    onPress={async () => {
                                        if (!image) return;
                                    
                                        setIsSubmitting(true);
                                        try {
                                            // Chamada para a nova função que envia o ficheiro físico
                                            await uploadAvatarFile(image, email);
                                            setIsOpen(false);
                                            router.refresh();
                                        } catch (error) {
                                            console.error("Erro no processo:", error);
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        Alterar foto
                                    </span>
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default UploadAvatar;