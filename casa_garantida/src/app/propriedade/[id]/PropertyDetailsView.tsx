"use client";

import React from "react";
import { Card } from "@heroui/react";
import PageTitle from "@/app/components/pageTitle";
import { Propriedade } from "@/types/Propriedade";
import { PropriedadeImagesSlider } from "@/app/components/ImageSlider";
import RequestPropertyButton from "@/app/components/RequestPropertyButton";
import { Usuario } from "@/types/Usuario";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

interface Props {
  property: Propriedade;
  currentUser: Usuario | null;
}

export default function PropertyDetailsView({ property, currentUser }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <PageTitle title="Detalhes do Imóvel" href="/" linkCaption="Voltar às Propriedades" />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary my-5">{property.name}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="col-span-2">
            <PropriedadeImagesSlider images={property.imagensList || []} />
            <h2 className="text-2xl font-bold text-gray-700 mt-7">
              {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(property.preco)}
              / {property.status?.value || "Indisponível"}
            </h2>
            <p className="text-sm text-slate-600 mt-7">{property.descricao}</p>
          </div>

          <Card className="p-5 flex flex-col gap-1 border border-gray-200 shadow-sm justify-between">
            <div>
              <Title title="Características" />
              <Attribute label="Quartos" value={property.quarto} />
              <Attribute label="Quintal" value={property.quintal} />
              <Attribute label="Garagem" value={property.garagem} />

              <Title title="Localização" className="mt-7" />
              <Attribute label="Cidade/Local" value={property.localizacao} />
              <Attribute label="Província" value={property.provincia} />
              <Attribute label="Região" value={property.regiao} />

              <Title title="Contactos" className="mt-7" />
              <Attribute label="Email" value={property.email} />
              <Attribute label="Telefone" value={property.telefone} />
            </div>

            {/* Só mostra os botões se houver um usuário logado */}
            {currentUser ? (
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-3">
                <RequestPropertyButton
                  propriedadeId={property.id}
                  usuarioId={currentUser.id}
                  tipo="Compra"
                />
                <RequestPropertyButton
                  propriedadeId={property.id}
                  usuarioId={currentUser.id}
                  tipo="Aluguel"
                />
              </div>
            ) : (
              <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                <LoginLink className="text-primary font-semibold underline">
                  Entrar para solicitar
                </LoginLink>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

const Title = ({ title, className }: { title: string; className?: string }) => (
  <div className={className}>
    <h2 className="text-xl font-bold text-slate-700">{title}</h2>
    <hr className="border border-solid border-slate-300 mt-1 mb-3" />
  </div>
);

const Attribute = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between py-1">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value ?? "N/A"}</span>
  </div>
);

/*"use client";

import React from "react";
import { Card } from "@heroui/react";
import PageTitle from "@/app/components/pageTitle";
import { Propriedade } from "@/types/Propriedade";
import { PropriedadeImagesSlider } from "@/app/components/ImageSlider";
import RequestPropertyButton from "@/app/components/RequestPropertyButton";

interface Props {
    property: Propriedade;
    currentUserId : number;
}

export default function PropertyDetailsView({ property, currentUserId }: Props) {
    // 💡 Dica: Substitua isso pelo ID real do usuário autenticado no seu sistema (ex: via Context/Auth)
    const usuarioLogadoId = currentUserId; 

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <PageTitle title="Detalhes do Imóvel" href="/" linkCaption="Voltar às Propriedades" />
            <div className="p-4">
                <h2 className="text-2xl font-bold text-primary my-5">{property.name}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="col-span-2">
                        <PropriedadeImagesSlider images={property.imagensList || []} />
                        <h2 className="text-2xl font-bold text-gray-700 mt-7">
                            {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(property.preco)} 
                            / {property.status?.value || "Indisponível"}
                        </h2>
                        <p className="text-sm text-slate-600 mt-7">{property.descricao}</p>
                    </div>

                    <Card className="p-5 flex flex-col gap-1 border border-gray-200 shadow-sm justify-between">
                        <div>
                            <Title title="Características" />
                            <Attribute label="Quartos" value={property.quarto} />
                            <Attribute label="Quintal" value={property.quintal} />
                            <Attribute label="Garagem" value={property.garagem} />
                            
                            <Title title="Localização" className="mt-7" />
                            <Attribute label="Cidade/Local" value={property.localizacao} />
                            <Attribute label="Província" value={property.provincia} />
                            <Attribute label="Região" value={property.regiao} />
                            
                            <Title title="Contactos" className="mt-7" />
                            <Attribute label="Email" value={property.email} />
                            <Attribute label="Telefone" value={property.telefone} />
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-3">
                            <RequestPropertyButton 
                                propriedadeId={property.id} 
                                usuarioId={usuarioLogadoId} 
                                tipo="Compra" 
                            />
                            <RequestPropertyButton 
                                propriedadeId={property.id} 
                                usuarioId={usuarioLogadoId} 
                                tipo="Aluguel" 
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Title = ({ title, className }: { title: string; className?: string }) => (
    <div className={className}>
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <hr className="border border-solid border-slate-300 mt-1 mb-3" />
    </div>
);

const Attribute = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex justify-between py-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{value ?? "N/A"}</span>
    </div>
);*/

/*"use client";

import React from "react";
import { Card } from "@heroui/react";
import PageTitle from "@/app/components/pageTitle";
import { Propriedade } from "@/types/Propriedade";
import { PropriedadeImagesSlider } from "@/app/components/ImageSlider";

interface Props {
    property: Propriedade;
}

export default function PropertyDetailsView({ property }: Props) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <PageTitle title="Detalhes do Imóvel" href="/" linkCaption="Voltar às Propriedades" />
            <div className="p-4">
                <h2 className="text-2xl font-bold text-primary my-5">{property.name}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="col-span-2">
                        <PropriedadeImagesSlider images={property.imagensList || []} />
                        <h2 className="text-2xl font-bold text-gray-700 mt-7">
                            {new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(property.preco)} 
                            / {property.status?.value || "Indisponível"}
                        </h2>
                        <p className="text-sm text-slate-600 mt-7">{property.descricao}</p>
                    </div>

                    <Card className="p-5 flex flex-col gap-1 border border-gray-200 shadow-sm">
                        <Title title="Características" />
                        <Attribute label="Quartos" value={property.quarto} />
                        <Attribute label="Quintal" value={property.quintal} />
                        <Attribute label="Garagem" value={property.garagem} />
                        
                        <Title title="Localização" className="mt-7" />
                        <Attribute label="Cidade/Local" value={property.localizacao} />
                        <Attribute label="Província" value={property.provincia} />
                        <Attribute label="Região" value={property.regiao} />
                        
                        <Title title="Contactos" className="mt-7" />
                        <Attribute label="Email" value={property.email} />
                        <Attribute label="Telefone" value={property.telefone} />
                    </Card>
                </div>
            </div>
        </div>
    );
}

const Title = ({ title, className }: { title: string; className?: string }) => (
    <div className={className}>
        <h2 className="text-xl font-bold text-slate-700">{title}</h2>
        <hr className="border border-solid border-slate-300 mt-1 mb-3" />
    </div>
);

const Attribute = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="flex justify-between py-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{value ?? "N/A"}</span>
    </div>
);*/