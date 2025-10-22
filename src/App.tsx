import { useState, useEffect } from 'react';
import { FamilyList } from './components/FamilyList';
import { FamilySearch } from './components/FamilySearch';
import { IdentificationForm } from './components/IdentificationForm';
import { HealthForm } from './components/HealthForm';
import { SocialForm } from './components/SocialForm';
import { ServicesForm } from './components/ServicesForm';
import { EconomicForm } from './components/EconomicForm';
import { LoginForm } from './components/LoginForm';
import { Family, IdentificationData, HealthData, SocialData, ServicesData, EconomicData, FamilyMember } from './types/family';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { toast, Toaster } from 'sonner';

type Page = 'list' | 'search' | 'identification' | 'health' | 'social' | 'services' | 'economic' | 'view';

const initialIdentificationData: IdentificationData = {
  centroReferencia: '',
  prontuario: '',
  data: '',
  formaAcesso: '',
  nis: '',
  telefone1: '',
  telefone2: '',
  responsavelFamiliar: '',
  nomeSocial: '',
  dataNascimento: '',
  rg: '',
  cpf: '',
  localNascimento: '',
  tempoMunicipio: '',
  procedencia: '',
  endereco: '',
  numero: '',
  bairro: '',
  cep: '',
  enderecoResidencia: '',
  observacoes: '',
  rendaPerCapita: '',
  configuracaoFamiliar: '',
  obs: '',
  membros: [],
};

const initialHealthData: HealthData = {
  temPCD: false,
  numeroPessoas: '',
  tipoDeficiencia: {
    fisica: false,
    visual: false,
    baixaVisao: false,
    auditiva: false,
    intelectual: false,
    multipla: false,
    mental: false,
    transtornoEspectroAutista: false,
    emDecorrenciaDoencasCronicas: false,
    outras: false,
    outrasEspecificar: '',
  },
  recebeBeneficio: {
    nao: false,
    sim: false,
    simQual: '',
    emProcesso: false,
    indeferido: false,
    indeferidoMotivo: '',
  },
  observacoesPCD: '',
  pessoaComDoenca: false,
  especifiqueDoencas: '',
  realizaTratamento: {
    sus: false,
    redePrivada: false,
    ambos: false,
    naoRealiza: false,
  },
  acessaMedico: {
    sus: false,
    redePrivada: false,
    naoAcessa: false,
  },
  auxilioDoencaInvalidez: {
    sim: false,
    nao: false,
    emProcesso: false,
    indeferido: false,
  },
  observacoesDoenca: '',
  gestanteNaFamilia: false,
  gestacaoRisco: false,
  realizaPreNatal: false,
  naoRealizaPreNatalMotivo: '',
  dataRegistro: '',
  demaisInformacoesRelevantes: '',
};

const initialSocialData: SocialData = {
  privacoes: {
    assistenciaSocial: false,
    educacao: false,
    previdenciaSocial: false,
    trabalhoRenda: false,
    cultura: false,
    juridicaSociojuridica: false,
    saude: false,
    habitacao: false,
    segurancaAlimentar: false,
    saneamentoBasico: false,
    energiaEletrica: false,
    outras: false,
    outrasEspecificar: '',
  },
  observacoes: '',
  situacao: {
    cdhu: false,
    augSocial: false,
    auxMoradia: false,
    proprio: false,
    financ: false,
    financEspecificar: '',
    mcmv: false,
    ocupacao: false,
    cedido: false,
    alugado: false,
    outros: false,
    outrosEspecificar: '',
  },
  tipoAbastecimentoAgua: {
    redePublica: false,
    irregular: false,
    outros: false,
    outrosEspecificar: '',
    poco: false,
    suspenso: false,
  },
  escoamentoSanitario: {
    redePublica: false,
    ceuAberto: false,
    fossa: false,
    outros: false,
    outrosEspecificar: '',
  },
  numeroComodos: '',
  comodosUtilizadosDormitorio: '',
  numeroBanheiros: '',
  mediaPessoasPorDormitorio: '',
  outros: '',
};

const initialServicesData: ServicesData = {
  tipoIluminacao: {
    relogioProprio: false,
    relogioComunitario: false,
    irregular: false,
    suspenso: false,
    vela: false,
    outros: false,
    outrosEspecificar: '',
  },
  destinoLixo: {
    coletado: false,
    queimado: false,
    enterrado: false,
    ceuAberto: false,
    comunitario: false,
    vala: false,
  },
  condicoesMoradia: {
    boa: false,
    precaria: false,
    insalubre: false,
  },
  acessibilidade: {
    total: false,
    parcial: false,
    naoHa: false,
  },
  tipoConstrucao: '',
  localidade: {
    urbana: false,
    rural: false,
    tijolo: false,
    madeira: false,
    outros: false,
    outrosEspecificar: '',
  },
  programasBeneficios: {
    irc: false,
    aj: false,
    vivaLeite: false,
    bfValorRS: '',
    bpcPcd: false,
    bpcIdoso: false,
    passeLivre: false,
    nenhum: false,
  },
  scfv: {
    cci: false,
    scfvDireta: false,
    fac: false,
    legiaoMirim: false,
    casaCrianca: false,
    colmeia: false,
    proMeninas: false,
    outra: false,
    outraEspecificar: '',
  },
  servicosMediaComplexidade: {
    apae: false,
    escolaAutista: false,
    centroDiaIdoso: false,
    centroPop: false,
    outro: false,
    outroEspecificar: '',
  },
  servicosAltaComplexidade: {
    vilaSaoVicentePaula: false,
    saoLourenco: false,
    vilaDignidade: false,
    nossoLarI: false,
    nossoLarII: false,
    acolhimentoAdultos: false,
    republicaJovensFeminino: false,
  },
  descontosTarifarios: {
    tarifaSocialEnergia: false,
    tarifaSocialAgua: false,
  },
  educacaoRegular: {
    criancasAdolescentesEscola: false,
    publica: false,
    particular: false,
    evasaoEscolarCrianca: false,
    evasaoEscolarAdolescente: false,
  },
  outrasAcoesEducacao: {
    escola: false,
    nao: false,
    regular: false,
    outrosProjetosEducacao: false,
    outraSituacao: false,
    outraSituacaoEspecificar: '',
  },
  acessoSaude: {
    capsAdII: false,
    casaRosa: false,
    sus: false,
    secretariaSaude: false,
    ceo: false,
    prontoSocorro: false,
    bancoLeite: false,
    outros: false,
    policlinica: false,
    pasubs: false,
    nga: false,
    hospitalAmaralCarvalho: false,
    hospitalTerezaPerletti: false,
    santaCasaJahu: false,
    comunidadeTerapeutica: false,
    unimed: false,
    redePrivada: false,
    outrosSaude: false,
  },
  servicosSaudeOutrosMunicipios: '',
  segurancaPublica: {
    regimeAberto: false,
    regimeFechado: false,
    cdp: false,
    cpp: false,
    fundacaoCasa: false,
    unidadeSemiliberdade: false,
    outrosSeguranca: false,
    outrosSegurancaEspecificar: '',
  },
};

const initialEconomicData: EconomicData = {
  outrasPolíticas: {
    acessoProdutosHortas: false,
    timeEmprego: false,
    projetoGuri: false,
    outrosPolíticas: false,
    outrosPolíticasEspecificar: '',
  },
  receitas: {
    numeroPessoasRenda: '',
    perCapitaSemProgramas: '',
    perCapitaComProgramas: '',
    rendaTotalSubtraindoGastos: '',
  },
  despesas: {
    medicamentos: '',
    alimentacao: '',
    emprestimos: '',
    iptu: '',
    transporteColetivo: '',
    transporteProprio: '',
    agua: '',
    energia: '',
    gas: '',
    aluguel: '',
    financiamento: '',
    outrasDespesas: '',
    quaisEmAtraso: '',
  },
  rendaSuficiente: false,
  tecnicoResponsavel: '',
  cressCrp: '',
  familiaSeriaIncluidaAcompanhamento: false,
  dataInclusaoAcompanhamento: '',
  motivoInclusaoAcompanhamento: '',
};

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [identificationData, setIdentificationData] = useState<IdentificationData>(initialIdentificationData);
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [socialData, setSocialData] = useState<SocialData>(initialSocialData);
  const [servicesData, setServicesData] = useState<ServicesData>(initialServicesData);
  const [economicData, setEconomicData] = useState<EconomicData>(initialEconomicData);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleNewFamily = () => {
    setIdentificationData(initialIdentificationData);
    setHealthData(initialHealthData);
    setSocialData(initialSocialData);
    setServicesData(initialServicesData);
    setEconomicData(initialEconomicData);
    setCurrentFamily(null);
    setCurrentPage('search');
  };

  const handleCreateFromSearch = (searchData: { nome: string; cpf: string; nis: string }) => {
    if (!user) return;

    // Criar o responsável familiar como primeiro membro
    const responsavel: FamilyMember = {
      id: Date.now().toString(),
      nome: searchData.nome,
      cpf: searchData.cpf,
      nis: searchData.nis,
      vinculoComTitular: 'Responsável',
      sexo: '',
      orientacaoSexual: '',
      dataNascimento: '',
      estadoCivil: '',
      raca: '',
      grauInstrucao: '',
      profissao: '',
      ocupacao: '',
      rendaBruta: '',
      fonteRenda: '',
    };

    const newIdentificationData = {
      ...initialIdentificationData,
      membros: [responsavel],
    };

    setIdentificationData(newIdentificationData);
    setHealthData(initialHealthData);
    setSocialData(initialSocialData);
    setServicesData(initialServicesData);
    setEconomicData(initialEconomicData);
    setCurrentFamily(null);
    setCurrentPage('identification');
    toast.success('Cadastro iniciado para ' + searchData.nome);
  };

  const handleEditFromSearch = (family: Family) => {
    handleViewFamily(family);
  };

  const handleTransferFamily = (family: Family) => {
    if (!user) return;

    const families = JSON.parse(localStorage.getItem('families') || '[]');
    
    const updatedFamily: Family = {
      ...family,
      crasId: user.tecnico.cras,
      updatedAt: new Date().toISOString(),
    };

    const updatedFamilies = families.map((f: Family) => 
      f.id === family.id ? updatedFamily : f
    );

    localStorage.setItem('families', JSON.stringify(updatedFamilies));
    toast.success(`Família transferida para ${user.tecnico.cras}`);
    setCurrentPage('list');
  };

  const handleViewFamily = (family: Family) => {
    setCurrentFamily(family);
    setIdentificationData(family.identification);
    setHealthData(family.health);
    setSocialData(family.social);
    setServicesData(family.services);
    setEconomicData(family.economic);
    setCurrentPage('identification');
    
    if (user && family.crasId !== user.tecnico.cras) {
      toast.info('Visualizando cadastro em modo somente leitura');
    } else {
      toast.info('Visualizando cadastro da família');
    }
  };

  const canEdit = () => {
    if (!user || !currentFamily) return true;
    return currentFamily.crasId === user.tecnico.cras;
  };

  const handleSaveFamily = () => {
    if (!user) return;
    
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    
    const family: Family = {
      id: currentFamily?.id || Date.now().toString(),
      identification: identificationData,
      health: healthData,
      social: socialData,
      services: servicesData,
      economic: economicData,
      crasId: user.tecnico.cras,
      createdBy: currentFamily?.createdBy || user.tecnico.id,
      createdAt: currentFamily?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentFamily) {
      // Update existing family - só pode atualizar se for do mesmo CRAS
      if (currentFamily.crasId === user.tecnico.cras) {
        const updatedFamilies = families.map((f: Family) => 
          f.id === currentFamily.id ? family : f
        );
        localStorage.setItem('families', JSON.stringify(updatedFamilies));
        toast.success('Família atualizada com sucesso!');
      } else {
        toast.error('Você não tem permissão para editar esta família');
        return;
      }
    } else {
      // Add new family
      families.push(family);
      localStorage.setItem('families', JSON.stringify(families));
      toast.success('Família cadastrada com sucesso!');
    }

    setCurrentPage('list');
  };

  const handleCancel = () => {
    setCurrentPage('list');
    setCurrentFamily(null);
    toast.info('Cadastro cancelado');
  };

  return (
    <>
      {currentPage === 'list' && (
        <FamilyList
          onNewFamily={handleNewFamily}
          onViewFamily={handleViewFamily}
        />
      )}

      {currentPage === 'search' && (
        <FamilySearch
          onCreateNew={handleCreateFromSearch}
          onEditExisting={handleEditFromSearch}
          onTransferFamily={handleTransferFamily}
          onCancel={handleCancel}
        />
      )}

      {currentPage === 'identification' && (
        <IdentificationForm
          data={identificationData}
          onChange={setIdentificationData}
          onNext={() => setCurrentPage('health')}
          onCancel={handleCancel}
          readOnly={!canEdit()}
        />
      )}

      {currentPage === 'health' && (
        <HealthForm
          data={healthData}
          onChange={setHealthData}
          onNext={() => setCurrentPage('social')}
          onBack={() => setCurrentPage('identification')}
          readOnly={!canEdit()}
        />
      )}

      {currentPage === 'social' && (
        <SocialForm
          data={socialData}
          onChange={setSocialData}
          onNext={() => setCurrentPage('services')}
          onBack={() => setCurrentPage('health')}
          readOnly={!canEdit()}
        />
      )}

      {currentPage === 'services' && (
        <ServicesForm
          data={servicesData}
          onChange={setServicesData}
          onNext={() => setCurrentPage('economic')}
          onBack={() => setCurrentPage('social')}
          readOnly={!canEdit()}
        />
      )}

      {currentPage === 'economic' && (
        <EconomicForm
          data={economicData}
          onChange={setEconomicData}
          onSave={handleSaveFamily}
          onBack={() => setCurrentPage('services')}
          readOnly={!canEdit()}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Toaster position="top-right" richColors />
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
