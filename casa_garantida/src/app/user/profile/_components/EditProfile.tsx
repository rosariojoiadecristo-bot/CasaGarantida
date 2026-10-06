"use client";

import { Modal } from "@heroui/react";
import { useState } from "react";
import { PencilIcon, UserIcon, PhoneIcon, MapPinIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Usuario } from "@/types/Usuario";
import { atualizarPerfil } from "@/services/usuarioService";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface EditProfileProps {
  usuario: Usuario;
}

const EditProfile = ({ usuario }: EditProfileProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    firstName: usuario.firstName || "",
    lastName: usuario.lastName || "",
    contacto1: usuario.contacto1?.toString() ?? "",
    contacto2: usuario.contacto2?.toString() ?? "",
    provincia: usuario.provincia || "",
  });

  const setField = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const abrirModal = () => {
    setForm({
      firstName: usuario.firstName || "",
      lastName: usuario.lastName || "",
      contacto1: usuario.contacto1?.toString() ?? "",
      contacto2: usuario.contacto2?.toString() ?? "",
      provincia: usuario.provincia || "",
    });
    setErro("");
    setIsOpen(true);
  };

  const salvarAlteracoes = async () => {
    setErro("");

    if (!form.firstName.trim()) return setErro("O nome é obrigatório.");
    if (!form.lastName.trim()) return setErro("O apelido é obrigatório.");
    if (!form.contacto1.trim()) return setErro("O contacto é obrigatório.");

    setIsSubmitting(true);
    try {
      await atualizarPerfil(usuario.id, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        contacto1: form.contacto1.trim() !== "" ? Number(form.contacto1) : null,
        contacto2: form.contacto2.trim() !== "" ? Number(form.contacto2) : null,
        provincia: form.provincia.trim() !== "" ? form.provincia.trim() : null,
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setErro(
        error instanceof Error ? error.message : "Erro ao atualizar o perfil."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const iniciais =
    `${usuario.firstName?.[0] ?? ""}${usuario.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  return (
    <div>
      {/* ============================ */}
      {/* BOTÃO DE ACIONAMENTO */}
      {/* ============================ */}
      <Button
        variant="flat"
        color="primary"
        className="font-medium flex items-center gap-2 transition-transform active:scale-95"
        onPress={abrirModal}
      >
        <PencilIcon className="w-4 h-4 text-primary" />
        Editar perfil
      </Button>

      {/* ============================ */}
      {/* MODAL */}
      {/* ============================ */}
      <Modal>
        <Modal.Backdrop
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Modal.Container className="flex items-center justify-center w-full">
            <Modal.Dialog
              className="
                sm:max-w-[580px]
                w-full
                bg-white dark:bg-zinc-900
                rounded-2xl
                shadow-2xl
                border border-slate-200/80 dark:border-zinc-800
                overflow-hidden
                transition-all
              "
            >
              <Modal.CloseTrigger>
                <XMarkIcon className="w-5 h-5" />
              </Modal.CloseTrigger>

              {/* ============================ */}
              {/* HEADER */}
              {/* ============================ */}
              <Modal.Header className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 shrink-0">
                    {iniciais}
                  </div>

                  <div className="flex flex-col">
                    <Modal.Heading className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                      Editar perfil
                    </Modal.Heading>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Atualize as suas informações de contacto e localização
                    </p>
                  </div>
                </div>
              </Modal.Header>

              {/* ============================ */}
              {/* BODY */}
              {/* ============================ */}
              <Modal.Body className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* -------- Dados pessoais -------- */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    <UserIcon className="w-4 h-4" />
                    <span>Dados pessoais</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome"
                      placeholder="Introduza o nome"
                      variant="bordered"
                      value={form.firstName}
                      onValueChange={(val) => setField("firstName", val)}
                      isRequired
                    />
                    <Input
                      label="Apelido"
                      placeholder="Introduza o apelido"
                      variant="bordered"
                      value={form.lastName}
                      onValueChange={(val) => setField("lastName", val)}
                      isRequired
                    />
                  </div>
                </section>

                {/* -------- Contactos -------- */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Contactos</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contacto 1"
                      placeholder="Ex: 923000000"
                      type="tel"
                      variant="bordered"
                      value={form.contacto1}
                      onValueChange={(val) => setField("contacto1", val)}
                      isRequired
                      startContent={
                        <span className="text-xs text-slate-400 font-medium">
                          +244
                        </span>
                      }
                    />
                    <Input
                      label="Contacto 2"
                      placeholder="Ex: 912000000"
                      type="tel"
                      variant="bordered"
                      value={form.contacto2}
                      onValueChange={(val) => setField("contacto2", val)}
                      startContent={
                        <span className="text-xs text-slate-400 font-medium">
                          +244
                        </span>
                      }
                    />
                  </div>
                </section>

                {/* -------- Localização -------- */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Localização</span>
                  </div>

                  <Input
                    label="Província"
                    placeholder="Ex: Luanda"
                    variant="bordered"
                    value={form.provincia}
                    onValueChange={(val) => setField("provincia", val)}
                  />
                </section>

                {/* -------- Alerta de erro -------- */}
                {erro && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3.5">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      {erro}
                    </p>
                  </div>
                )}
              </Modal.Body>

              {/* ============================ */}
              {/* FOOTER */}
              {/* ============================ */}
              <Modal.Footer className="px-6 py-4 bg-slate-50 dark:bg-zinc-900/80 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
                <Button
                  variant="flat"
                  color="default"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isSubmitting}
                >
                  Cancelar
                </Button>

                <Button
                  color="primary"
                  className="font-medium px-6 shadow-sm shadow-blue-500/20"
                  isLoading={isSubmitting}
                  onPress={salvarAlteracoes}
                >
                  Salvar alterações
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default EditProfile;