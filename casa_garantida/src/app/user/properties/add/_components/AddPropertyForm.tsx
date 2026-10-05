"use client";

import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import Basic from './basic';
import { PropriedadeTipo } from '@/types/PropriedadeTipo';
import { PropriedadeStatus } from '@/types/PropriedadeStatus';
import { cn } from '@heroui/react';
import Location from './Location';
import Features from './Features';
import Picture from './Picture';
import Contact from './Contact';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Propriedade } from '@/types/Propriedade';

const steps = [
  { label: "Basic" }, { label: "Location" }, { label: "Features" }, { label: "Pictures" }, { label: "Contact" }
];

interface Props {
  types: PropriedadeTipo[];
  statuses: PropriedadeStatus[];
  property?: Propriedade;
  isEdit?: boolean;
  currentUserId: number;
}

const AddPropertyForm = ({ isEdit = false, property, currentUserId, ...props }: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

  const [formData, setFormData] = useState({
    name: property?.name || "",
    descricao: property?.descricao || "",
    preco: property?.preco || 0,
    telefone: property?.telefone || 0,
    email: property?.email || "",
    contacto: property?.contacto || "",
    quarto: property?.quarto || 0,
    quintal: property?.quintal || 0,
    garagem: property?.garagem || 0,
    localizacao: property?.localizacao || "",
    provincia: property?.provincia || "",
    estado: property?.estado || "",
    regiao: property?.regiao || "",
    userId: property?.userId ?? currentUserId,
    typeId: property?.typeId || props.types[0]?.id || 1,
    statusId: property?.statusId || props.statuses[0]?.id || 1,
    imgUrls: "",
  });

  useEffect(() => {
    if (property && isEdit) {
      let currentImgs: string[] = [];
      
      // Correção do erro do TypeScript: verifica se é array ou string antes do tratamento
      if (Array.isArray(property.imagensList)) {
        currentImgs = property.imagensList;
      } else if (typeof property.imagensList === 'string' && property.imagensList) {
        try {
          const parsed = JSON.parse(property.imagensList);
          if (Array.isArray(parsed)) currentImgs = parsed;
        } catch {
          currentImgs = [];
        }
      }

      setExistingImages(currentImgs);

      setFormData({
        name: property.name || "",
        descricao: property.descricao || "",
        preco: property.preco || 0,
        telefone: property.telefone || 0,
        email: property.email || "",
        contacto: property.contacto || "",
        quarto: property.quarto || 0,
        quintal: property.quintal || 0,
        garagem: property.garagem || 0,
        localizacao: property.localizacao || "",
        provincia: property.provincia || "",
        estado: property.estado || "",
        regiao: property.regiao || "",
        userId: property.userId ?? currentUserId,
        typeId: property.typeId || props.types[0]?.id || 1,
        statusId: property.statusId || props.statuses[0]?.id || 1,
        imgUrls: JSON.stringify(currentImgs),
      });
    }
  }, [property, isEdit, props.types, props.statuses]);

  const handleRemoveExistingImage = async (indexToRemove: number) => {
    const imageToRemove = existingImages[indexToRemove];
    
    // Remove visualmente primeiro (otimista)
    const updated = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(updated);
    
    if (property?.id) {
        try {
            const response = await fetch(`${API_URL}/Propriedade/${property.id}/remove-image`, {
                method: 'POST', // Mudando para POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(imageToRemove)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erro ao remover imagem:", errorText);
                toast.error("Erro ao remover a imagem do servidor.");
                // Reverter a remoção visual se falhar
                setExistingImages(prev => [...prev, imageToRemove]);
            } else {
                const data = await response.json();
                console.log("✅ Imagem removida:", data);
                toast.success("Imagem removida com sucesso!");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro ao conectar ao servidor.");
            // Reverter a remoção visual
            setExistingImages(prev => [...prev, imageToRemove]);
        }
    }
  };
  
  const updateFields = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    if(!isEdit){
      try {
            // 1. Envia os dados básicos da propriedade para a API
            const response = await fetch(`${API_URL}/Propriedade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Erro ao criar propriedade");

            const result = await response.json();
            // Tenta capturar o ID da propriedade recém-criada
            const propriedadeId = Array.isArray(result) ? result[result.length - 1]?.id : result?.id;

            // 2. Se houver imagens e um ID válido, envia as imagens separadamente
            if (images.length > 0 && propriedadeId) {
                const data = new FormData();
                images.forEach(img => data.append("files", img));
                data.append("propriedadeId", propriedadeId.toString());

                await fetch(`${API_URL}/Propriedade/upload-images`, {
                    method: 'POST',
                    body: data
                });
            }

            toast.success("Propriedade atualizada com sucesso!");
            router.push("/user/properties");
            router.refresh();
        } catch (error) {
            console.error("Erro na submissão:", error);
            toast.error("Erro ao guardar propriedade.");
        }
    }else{
    try {
      const endpoint = isEdit ? `${API_URL}/Propriedade/${property?.id}` : `${API_URL}/Propriedade`;
      const method = isEdit ? 'PUT' : 'POST';

      // LOG 1: Verificar o estado atual das imagens
      console.log("📸 Imagens existentes antes do envio:", existingImages);
      console.log("📸 Novas imagens:", images);

      const payload = {
        ...formData,
        id: property?.id,
        imgUrls: JSON.stringify(existingImages),
        imagensList: existingImages 
      };

      // LOG 2: Verificar o payload completo
      console.log("📦 Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // LOG 3: Verificar a resposta
      console.log("📥 Resposta do servidor:", response.status, response.statusText);
      const responseData = await response.json();
      console.log("📥 Dados da resposta:", responseData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar: ${errorText}`);
      }

      let propriedadeId = property?.id;

      // Envio de novas imagens adicionadas no input de ficheiros
      if (images.length > 0 && propriedadeId) {
        const formDataImages = new FormData();
        images.forEach(img => formDataImages.append("files", img));
        formDataImages.append("propriedadeId", propriedadeId.toString());

        await fetch(`${API_URL}/Propriedade/upload-images`, {
          method: 'POST',
          body: formDataImages
        });
      }

      toast.success("Propriedade atualizada com sucesso!");
      router.push("/user/properties");
      router.refresh();

    } catch (error) {
      console.error("Erro no submit:", error);
      toast.error("Erro ao guardar as alterações.");
    }
    }
  };
 
  return (
    <div>
      <Stepper items={steps} activeItem={step} setActiveItem={setStep} />
      <form className='mt-3 p-2' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Basic
          className={cn({ hidden: step !== 0 })}
          next={() => setStep((prev) => prev + 1)}
          types={props.types}
          statuses={props.statuses}
          data={formData}
          updateFields={updateFields}
        />
        <Location
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 1 })}
          data={formData}
          updateFields={updateFields}
        />
        <Features
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 2 })}
          data={formData}
          updateFields={updateFields}
        />
        {/* Passa as imagens existentes e as novas fotos para o Picture */}
        <Picture
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 3 })}
          images={images}
          setImages={setImages}
          existingImages={existingImages}
          onRemoveExistingImage={handleRemoveExistingImage}
        />
        <Contact
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 4 })}
          data={formData}
          updateFields={updateFields}
        />
      </form>
    </div>
  );
};

export default AddPropertyForm;


/*"use client";

import React, { useState, useEffect } from 'react';
import Stepper from './Stepper';
import Basic from './basic';
import { PropriedadeTipo } from '@/types/PropriedadeTipo';
import { PropriedadeStatus } from '@/types/PropriedadeStatus';
import { cn } from '@heroui/react';
import Location from './Location';
import Features from './Features';
import Picture from './Picture';
import Contact from './Contact';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Propriedade } from '@/types/Propriedade';

const steps = [
  { label: "Basic" }, { label: "Location" }, { label: "Features" }, { label: "Pictures" }, { label: "Contact" }
];

interface Props {
  types: PropriedadeTipo[];
  statuses: PropriedadeStatus[];
  property?: Propriedade;
  isEdit?: boolean;
}

const AddPropertyForm = ({ isEdit = false, property, ...props }: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5160/api';

  const [formData, setFormData] = useState({
    name: property?.name || "",
    descricao: property?.descricao || "",
    preco: property?.preco || 0,
    telefone: property?.telefone || 0,
    email: property?.email || "",
    contacto: property?.contacto || "",
    quarto: property?.quarto || 0,
    quintal: property?.quintal || 0,
    garagem: property?.garagem || 0,
    localizacao: property?.localizacao || "",
    provincia: property?.provincia || "",
    estado: property?.estado || "",
    regiao: property?.regiao || "",
    userId: property?.userId || 1,
    typeId: property?.typeId || props.types[0]?.id || 1,
    statusId: property?.statusId || props.statuses[0]?.id || 1,
    imgUrls: "",
  });

  useEffect(() => {
    if (property && isEdit) {
      let currentImgs: string[] = [];
      
      // Correção do erro do TypeScript: verifica se é array ou string antes do tratamento
      if (Array.isArray(property.imagensList)) {
        currentImgs = property.imagensList;
      } else if (typeof property.imagensList === 'string' && property.imagensList) {
        try {
          const parsed = JSON.parse(property.imagensList);
          if (Array.isArray(parsed)) currentImgs = parsed;
        } catch {
          currentImgs = [];
        }
      }

      setExistingImages(currentImgs);

      setFormData({
        name: property.name || "",
        descricao: property.descricao || "",
        preco: property.preco || 0,
        telefone: property.telefone || 0,
        email: property.email || "",
        contacto: property.contacto || "",
        quarto: property.quarto || 0,
        quintal: property.quintal || 0,
        garagem: property.garagem || 0,
        localizacao: property.localizacao || "",
        provincia: property.provincia || "",
        estado: property.estado || "",
        regiao: property.regiao || "",
        userId: property.userId || 1,
        typeId: property.typeId || props.types[0]?.id || 1,
        statusId: property.statusId || props.statuses[0]?.id || 1,
        imgUrls: JSON.stringify(currentImgs),
      });
    }
  }, [property, isEdit, props.types, props.statuses]);

  const handleRemoveExistingImage = async (indexToRemove: number) => {
    const imageToRemove = existingImages[indexToRemove];
    
    // Remove visualmente primeiro (otimista)
    const updated = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(updated);
    
    if (property?.id) {
        try {
            const response = await fetch(`${API_URL}/Propriedade/${property.id}/remove-image`, {
                method: 'POST', // Mudando para POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(imageToRemove)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Erro ao remover imagem:", errorText);
                toast.error("Erro ao remover a imagem do servidor.");
                // Reverter a remoção visual se falhar
                setExistingImages(prev => [...prev, imageToRemove]);
            } else {
                const data = await response.json();
                console.log("✅ Imagem removida:", data);
                toast.success("Imagem removida com sucesso!");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro ao conectar ao servidor.");
            // Reverter a remoção visual
            setExistingImages(prev => [...prev, imageToRemove]);
        }
    }
  };
  
  const updateFields = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isEdit ? `${API_URL}/Propriedade/${property?.id}` : `${API_URL}/Propriedade`;
      const method = isEdit ? 'PUT' : 'POST';

      // LOG 1: Verificar o estado atual das imagens
      console.log("📸 Imagens existentes antes do envio:", existingImages);
      console.log("📸 Novas imagens:", images);

      const payload = {
        ...formData,
        id: property?.id,
        imgUrls: JSON.stringify(existingImages),
        imagensList: existingImages 
      };

      // LOG 2: Verificar o payload completo
      console.log("📦 Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // LOG 3: Verificar a resposta
      console.log("📥 Resposta do servidor:", response.status, response.statusText);
      const responseData = await response.json();
      console.log("📥 Dados da resposta:", responseData);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao atualizar: ${errorText}`);
      }

      let propriedadeId = property?.id;

      // Envio de novas imagens adicionadas no input de ficheiros
      if (images.length > 0 && propriedadeId) {
        const formDataImages = new FormData();
        images.forEach(img => formDataImages.append("files", img));
        formDataImages.append("propriedadeId", propriedadeId.toString());

        await fetch(`${API_URL}/Propriedade/upload-images`, {
          method: 'POST',
          body: formDataImages
        });
      }

      toast.success("Propriedade atualizada com sucesso!");
      router.push("/user/properties");
      router.refresh();

    } catch (error) {
      console.error("Erro no submit:", error);
      toast.error("Erro ao guardar as alterações.");
    }
  };
 
  return (
    <div>
      <Stepper items={steps} activeItem={step} setActiveItem={setStep} />
      <form className='mt-3 p-2' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Basic
          className={cn({ hidden: step !== 0 })}
          next={() => setStep((prev) => prev + 1)}
          types={props.types}
          statuses={props.statuses}
          data={formData}
          updateFields={updateFields}
        />
        <Location
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 1 })}
          data={formData}
          updateFields={updateFields}
        />
        <Features
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 2 })}
          data={formData}
          updateFields={updateFields}
        />
        <Picture
          next={() => setStep(prev => prev + 1)}
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 3 })}
          images={images}
          setImages={setImages}
          existingImages={existingImages}
          onRemoveExistingImage={handleRemoveExistingImage}
        />
        <Contact
          prev={() => setStep(prev => prev - 1)}
          className={cn({ hidden: step !== 4 })}
          data={formData}
          updateFields={updateFields}
        />
      </form>
    </div>
  );
};

export default AddPropertyForm;*/