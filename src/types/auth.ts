export type CrasName = 
  | 'Dona Tita'
  | 'Pedro Ometto'
  | 'Cila Bauab'
  | 'Altos da Cidade'
  | 'Central'
  | 'Distrito de Potunduva';

export interface Tecnico {
  id: string;
  nome: string;
  username: string;
  password: string;
  cras: CrasName;
  isAdmin: boolean;
}

export interface AuthUser {
  tecnico: Tecnico;
  loginTime: string;
}
