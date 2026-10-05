import ModalDeleteProperty from "./ModalDeleteProperty";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const propertyId = Number(id);

  if (!Number.isInteger(propertyId)) {
    return null;
  }

  return (
    <ModalDeleteProperty
      propertyId={propertyId}
    />
  );
}

/*import ModalDeleteProperty from "./ModalDeleteProperty";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  return (
    <ModalDeleteProperty
      propertyId={Number(resolvedParams.id)}
    />
  );
}

/*"use client";

import { deleteProperty } from "@/services/actions/propriedade";
import { TrashIcon } from "@heroicons/react/16/solid";
import { Button } from "@heroui/button";
import { Modal } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ModalDeletePropertyPage({ params }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [propertyId, setPropertyId] = useState<number | null>(null);

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setPropertyId(Number(resolvedParams.id));
      setIsOpen(true);
    }

    loadParams();
  }, [params]);

  const handleCancel = () => {
    setIsOpen(false);
    router.back();
  };

  const handleDelete = async () => {
    if (!propertyId) return;

    try {
      setLoading(true);
      setToast(null);

      await deleteProperty(propertyId);

      setToast({
        type: "success",
        message: "Propriedade eliminada com sucesso.",
      });

      setTimeout(() => {
        router.push("/user/properties");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error(error);

      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível eliminar a propriedade.",
      });

      setLoading(false);
    }
  };

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

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);

          if (!open && !loading) {
            router.back();
          }
        }}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-default text-foreground">
                  <TrashIcon className="size-5" />
                </Modal.Icon>

                <Modal.Heading>
                  Eliminar Propriedade
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p>
                  Tem certeza de que deseja excluir esta propriedade?
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  onPress={handleCancel}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>

                <Button
                  onPress={handleDelete}
                  color="danger"
                  variant="light"
                  isLoading={loading}
                >
                  Eliminar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

/*"use client";

import { deleteProperty } from '@/services/actions/propriedade';
import { TrashIcon } from '@heroicons/react/16/solid';
import { Button } from '@heroui/button';
import { Modal } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Props{
    params: Promise<{ id: string }>;
}

function ModalDeletePropertyPage ({params}: Props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => setIsOpen(true), []);

    const handleCancel = () => {
        router.push("/user/properties");
        setIsOpen(false);
    };

    const handleDelete = async() => {
        try{
            await deleteProperty(+params.id);
            router.push("/user/properties");
            setIsOpen(false);
        }catch(e){
            throw e;
        }
    }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleCancel}>
        <Modal.Backdrop>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-[360px]">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Icon className="bg-default text-foreground">
                            <TrashIcon className="size-5" />
                        </Modal.Icon>
                        <Modal.Heading>Eliminar Propriedade</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza de que deseja excluir esta propriedade?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCancel}>Cancelar</Button>
                        <Button onClick={handleDelete} color='danger' variant='light'>Eliminar</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
  );
}

export default ModalDeletePropertyPage;*/