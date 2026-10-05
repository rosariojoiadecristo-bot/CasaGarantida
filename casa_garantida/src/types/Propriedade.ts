import { PropriedadeStatus } from "./PropriedadeStatus";
import { PropriedadeTipo } from "./PropriedadeTipo";
import { Usuario } from "./Usuario";

export interface Propriedade {
    id: number;
    name: string; // Nota: No C# está "Name", garanta que o JSON venha em camelCase "name"
    descricao?: string;
    preco: number;
    userId: number;

    // Novos campos adicionados
    telefone: number;
    email?: string;
    contacto?: string;
    quarto: number;
    quintal: number;
    garagem: number;
    localizacao?: string;
    provincia?: string;
    estado?: string;
    regiao?: string;

    // Array com as URLs das imagens (desserializado do JSON no C#)
    imagensList?: string[];

    typeId: number;
    statusId: number;
    
    // Relacionamentos para facilitar a navegação no Frontend
    usuario?: Usuario;
    tipo?: PropriedadeTipo;
    status?: PropriedadeStatus;
    locatarioId?: number; 
}