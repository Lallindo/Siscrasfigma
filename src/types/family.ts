export interface FamilyMember {
  id: string;
  nome: string;
  cpf?: string;
  nis?: string;
  isResponsavel: boolean; // Marca quem é o responsável
  vinculoComTitular: string; // Ex: "Responsável", "Cônjuge", "Filho(a)", "Pai/Mãe", etc.
  sexo: string;
  dataNascimento: string;
  estadoCivil: string;
  raca: string;
  grauInstrucao: string;
  profissao: string;
}

export interface Family {
  id: string;
  prontuario: string;
  membros: FamilyMember[];
  observacoes?: string;
  crasId: string; // CRAS que cadastrou a família
  createdBy: string; // ID do técnico que cadastrou
  createdAt: string;
  updatedAt: string;
}
