"use client";

import { deleteProperty } from "@/services/actions/propriedade";
import { TrashIcon } from "@heroicons/react/16/solid";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  propertyId: number;
}

export default function ModalDeleteProperty({ propertyId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleDelete(onClose: () => void) {
    if (loading) return;

    try {
      setLoading(true);
      setToast(null);

      await deleteProperty(propertyId);

      setToast({
        type: "success",
        message: "Propriedade eliminada com sucesso.",
      });

      setTimeout(() => {
        onClose();
        router.back();
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Erro ao eliminar propriedade:", error);

      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível eliminar a propriedade.",
      });

      setLoading(false);
    }
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed right-5 top-5 z-[9999] rounded-lg px-5 py-4 shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* isOpen={true} força a exibição imediata ao carregar a rota interceptada */}
      <Modal
        isOpen={true}
        onOpenChange={(open) => {
          if (!open && !loading) {
            router.back();
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <TrashIcon className="w-5 h-5 text-danger" />
                <span>Eliminar Propriedade</span>
              </ModalHeader>

              <ModalBody>
                <p className="text-sm text-default-600">
                  Tem certeza de que deseja excluir esta propriedade? Esta ação
                  não pode ser desfeita.
                </p>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    if (!loading) router.back();
                  }}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  color="danger"
                  onPress={() => handleDelete(onClose)}
                  isLoading={loading}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}