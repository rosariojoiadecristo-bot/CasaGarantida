"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/app/components/SubmitButton";
import { deleteProperty } from "@/services/actions/propriedade";
import { Button } from "@heroui/button";

interface DeletePropertyFormProps {
  propertyId: number;
  propertyName: string;
}

export default function DeletePropertyForm({
  propertyId,
  propertyName,
}: DeletePropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setToast(null);

    try {
      await deleteProperty(propertyId);

      setToast({
        type: "success",
        message: `O imóvel "${propertyName}" foi eliminado com sucesso.`,
      });

      setTimeout(() => {
        router.push("/user/properties");
        router.refresh();
      }, 1500);
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível eliminar o imóvel.",
      });

      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Tem certeza que deseja excluir esta propriedade?</p>

      <p>
        <span className="text-slate-400">Nome: </span>
        <span className="text-slate-700">{propertyName}</span>
      </p>

      {toast && (
        <div
          className={`fixed right-5 top-5 z-50 rounded-lg px-5 py-4 shadow-lg ${
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

      <div className="flex justify-center gap-3">
        <Button
          variant="flat"
          onPress={() => router.push("/user/properties")}
          isDisabled={loading}
        >
          Cancelar
        </Button>

        <SubmitButton
          color="danger"
          variant="light"
          onPress={handleDelete}
          isLoading={loading}
        >
          Eliminar
        </SubmitButton>
      </div>
    </div>
  );
}