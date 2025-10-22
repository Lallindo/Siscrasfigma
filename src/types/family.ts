export interface FamilyMember {
  id: string;
  nome: string;
  cpf?: string;
  nis?: string;
  vinculoComTitular: string;
  sexo: string;
  orientacaoSexual: string;
  dataNascimento: string;
  estadoCivil: string;
  raca: string;
  grauInstrucao: string;
  profissao: string;
  ocupacao: string;
  rendaBruta: string;
  fonteRenda: string;
}

export interface IdentificationData {
  centroReferencia: string;
  prontuario: string;
  data: string;
  formaAcesso: string;
  nis: string;
  telefone1: string;
  telefone2: string;
  responsavelFamiliar: string;
  nomeSocial: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  localNascimento: string;
  tempoMunicipio: string;
  procedencia: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  enderecoResidencia: string;
  observacoes: string;
  rendaPerCapita: string;
  configuracaoFamiliar: string;
  obs: string;
  membros: FamilyMember[];
}

export interface HealthData {
  temPCD: boolean;
  numeroPessoas: string;
  tipoDeficiencia: {
    fisica: boolean;
    visual: boolean;
    baixaVisao: boolean;
    auditiva: boolean;
    intelectual: boolean;
    multipla: boolean;
    mental: boolean;
    transtornoEspectroAutista: boolean;
    emDecorrenciaDoencasCronicas: boolean;
    outras: boolean;
    outrasEspecificar: string;
  };
  recebeBeneficio: {
    nao: boolean;
    sim: boolean;
    simQual: string;
    emProcesso: boolean;
    indeferido: boolean;
    indeferidoMotivo: string;
  };
  observacoesPCD: string;
  pessoaComDoenca: boolean;
  especifiqueDoencas: string;
  realizaTratamento: {
    sus: boolean;
    redePrivada: boolean;
    ambos: boolean;
    naoRealiza: boolean;
  };
  acessaMedico: {
    sus: boolean;
    redePrivada: boolean;
    naoAcessa: boolean;
  };
  auxilioDoencaInvalidez: {
    sim: boolean;
    nao: boolean;
    emProcesso: boolean;
    indeferido: boolean;
  };
  observacoesDoenca: string;
  gestanteNaFamilia: boolean;
  gestacaoRisco: boolean;
  realizaPreNatal: boolean;
  naoRealizaPreNatalMotivo: string;
  dataRegistro: string;
  demaisInformacoesRelevantes: string;
}

export interface SocialData {
  privacoes: {
    assistenciaSocial: boolean;
    educacao: boolean;
    previdenciaSocial: boolean;
    trabalhoRenda: boolean;
    cultura: boolean;
    juridicaSociojuridica: boolean;
    saude: boolean;
    habitacao: boolean;
    segurancaAlimentar: boolean;
    saneamentoBasico: boolean;
    energiaEletrica: boolean;
    outras: boolean;
    outrasEspecificar: string;
  };
  observacoes: string;
  situacao: {
    cdhu: boolean;
    augSocial: boolean;
    auxMoradia: boolean;
    proprio: boolean;
    financ: boolean;
    financEspecificar: string;
    mcmv: boolean;
    ocupacao: boolean;
    cedido: boolean;
    alugado: boolean;
    outros: boolean;
    outrosEspecificar: string;
  };
  tipoAbastecimentoAgua: {
    redePublica: boolean;
    irregular: boolean;
    outros: boolean;
    outrosEspecificar: string;
    poco: boolean;
    suspenso: boolean;
  };
  escoamentoSanitario: {
    redePublica: boolean;
    ceuAberto: boolean;
    fossa: boolean;
    outros: boolean;
    outrosEspecificar: string;
  };
  numeroComodos: string;
  comodosUtilizadosDormitorio: string;
  numeroBanheiros: string;
  mediaPessoasPorDormitorio: string;
  outros: string;
}

export interface ServicesData {
  tipoIluminacao: {
    relogioProprio: boolean;
    relogioComunitario: boolean;
    irregular: boolean;
    suspenso: boolean;
    vela: boolean;
    outros: boolean;
    outrosEspecificar: string;
  };
  destinoLixo: {
    coletado: boolean;
    queimado: boolean;
    enterrado: boolean;
    ceuAberto: boolean;
    comunitario: boolean;
    vala: boolean;
  };
  condicoesMoradia: {
    boa: boolean;
    precaria: boolean;
    insalubre: boolean;
  };
  acessibilidade: {
    total: boolean;
    parcial: boolean;
    naoHa: boolean;
  };
  tipoConstrucao: string;
  localidade: {
    urbana: boolean;
    rural: boolean;
    tijolo: boolean;
    madeira: boolean;
    outros: boolean;
    outrosEspecificar: string;
  };
  programasBeneficios: {
    irc: boolean;
    aj: boolean;
    vivaLeite: boolean;
    bfValorRS: string;
    bpcPcd: boolean;
    bpcIdoso: boolean;
    passeLivre: boolean;
    nenhum: boolean;
  };
  scfv: {
    cci: boolean;
    scfvDireta: boolean;
    fac: boolean;
    legiaoMirim: boolean;
    casaCrianca: boolean;
    colmeia: boolean;
    proMeninas: boolean;
    outra: boolean;
    outraEspecificar: string;
  };
  servicosMediaComplexidade: {
    apae: boolean;
    escolaAutista: boolean;
    centroDiaIdoso: boolean;
    centroPop: boolean;
    outro: boolean;
    outroEspecificar: string;
  };
  servicosAltaComplexidade: {
    vilaSaoVicentePaula: boolean;
    saoLourenco: boolean;
    vilaDignidade: boolean;
    nossoLarI: boolean;
    nossoLarII: boolean;
    acolhimentoAdultos: boolean;
    republicaJovensFeminino: boolean;
  };
  descontosTarifarios: {
    tarifaSocialEnergia: boolean;
    tarifaSocialAgua: boolean;
  };
  educacaoRegular: {
    criancasAdolescentesEscola: boolean;
    publica: boolean;
    particular: boolean;
    evasaoEscolarCrianca: boolean;
    evasaoEscolarAdolescente: boolean;
  };
  outrasAcoesEducacao: {
    escola: boolean;
    nao: boolean;
    regular: boolean;
    outrosProjetosEducacao: boolean;
    outraSituacao: boolean;
    outraSituacaoEspecificar: string;
  };
  acessoSaude: {
    capsAdII: boolean;
    casaRosa: boolean;
    sus: boolean;
    secretariaSaude: boolean;
    ceo: boolean;
    prontoSocorro: boolean;
    bancoLeite: boolean;
    outros: boolean;
    policlinica: boolean;
    pasubs: boolean;
    nga: boolean;
    hospitalAmaralCarvalho: boolean;
    hospitalTerezaPerletti: boolean;
    santaCasaJahu: boolean;
    comunidadeTerapeutica: boolean;
    unimed: boolean;
    redePrivada: boolean;
    outrosSaude: boolean;
  };
  servicosSaudeOutrosMunicipios: string;
  segurancaPublica: {
    regimeAberto: boolean;
    regimeFechado: boolean;
    cdp: boolean;
    cpp: boolean;
    fundacaoCasa: boolean;
    unidadeSemiliberdade: boolean;
    outrosSeguranca: boolean;
    outrosSegurancaEspecificar: string;
  };
}

export interface EconomicData {
  outrasPolíticas: {
    acessoProdutosHortas: boolean;
    timeEmprego: boolean;
    projetoGuri: boolean;
    outrosPolíticas: boolean;
    outrosPolíticasEspecificar: string;
  };
  receitas: {
    numeroPessoasRenda: string;
    perCapitaSemProgramas: string;
    perCapitaComProgramas: string;
    rendaTotalSubtraindoGastos: string;
  };
  despesas: {
    medicamentos: string;
    alimentacao: string;
    emprestimos: string;
    iptu: string;
    transporteColetivo: string;
    transporteProprio: string;
    agua: string;
    energia: string;
    gas: string;
    aluguel: string;
    financiamento: string;
    outrasDespesas: string;
    quaisEmAtraso: string;
  };
  rendaSuficiente: boolean;
  tecnicoResponsavel: string;
  cressCrp: string;
  familiaSeriaIncluidaAcompanhamento: boolean;
  dataInclusaoAcompanhamento: string;
  motivoInclusaoAcompanhamento: string;
}

export interface Family {
  id: string;
  identification: IdentificationData;
  health: HealthData;
  social: SocialData;
  services: ServicesData;
  economic: EconomicData;
  crasId: string; // CRAS que cadastrou a família
  createdBy: string; // ID do técnico que cadastrou
  createdAt: string;
  updatedAt: string;
}
