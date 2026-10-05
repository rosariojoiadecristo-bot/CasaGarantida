export type TipoUsuario = {
  id: number;
  value: 'Administrador' | 'Gestor' | 'Cliente';
};

export interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  TipoUsuarioId: number;          // Deve ser number (para corresponder ao int do C# e ao valor 3)
  tipoUsuario?: TipoUsuario;      // Objeto opcional caso faça um JOIN na query SQL
}