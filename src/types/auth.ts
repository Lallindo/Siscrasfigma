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
  cras: CrasName;
}

export interface AuthUser {
  tecnico: Tecnico;
  loginTime: string;
}
