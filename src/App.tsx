import { useState } from 'react';
import { FamilyList } from './components/FamilyList';
import { FamilySearch } from './components/FamilySearch';
import { FamilyForm } from './components/FamilyForm';
import { LoginForm } from './components/LoginForm';
import { TechnicianManagement } from './components/TechnicianManagement';
import { Family, FamilyMember } from './types/family';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { toast, Toaster } from 'sonner';

type Page = 'list' | 'search' | 'form' | 'technicians';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { currentPage, navigateTo, goBack } = useNavigation();
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);

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
    setCurrentFamily(null);
    navigateTo('search');
  };

  const handleCreateFromSearch = (searchData: { nome: string; cpf: string; nis: string }) => {
    if (!user) return;

    // Criar o responsável familiar como primeiro membro
    const responsavel: FamilyMember = {
      id: Date.now().toString(),
      nome: searchData.nome,
      cpf: searchData.cpf,
      nis: searchData.nis,
      isResponsavel: true,
      vinculoComTitular: 'Responsável',
      sexo: '',
      dataNascimento: '',
      estadoCivil: '',
      raca: '',
      grauInstrucao: '',
      profissao: '',
      rendaBruta: 0,
      ativo: true,
    };

    // Criar família temporária com o responsável
    const tempFamily: Family = {
      id: '',
      prontuario: '',
      membros: [responsavel],
      observacoes: '',
      crasId: user.tecnico.cras,
      createdBy: user.tecnico.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentFamily(tempFamily);
    navigateTo('form');
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
    navigateTo('list');
  };

  const handleViewFamily = (family: Family) => {
    setCurrentFamily(family);
    navigateTo('form');
    
    if (user && family.crasId !== user.tecnico.cras) {
      toast.info('Visualizando cadastro em modo somente leitura');
    } else {
      toast.info('Visualizando cadastro da família');
    }
  };

  const canEdit = () => {
    if (!user || !currentFamily || !currentFamily.id) return true;
    return currentFamily.crasId === user.tecnico.cras;
  };

  const handleSaveFamily = (familyData: Omit<Family, 'id' | 'crasId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    const families = JSON.parse(localStorage.getItem('families') || '[]');
    
    const family: Family = {
      id: currentFamily?.id || Date.now().toString(),
      ...familyData,
      crasId: user.tecnico.cras,
      createdBy: currentFamily?.createdBy || user.tecnico.id,
      createdAt: currentFamily?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentFamily?.id) {
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

    navigateTo('list');
    setCurrentFamily(null);
  };

  const handleCancel = () => {
    goBack();
    setCurrentFamily(null);
    toast.info('Operação cancelada');
  };

  const handleNavigateToTechnicians = () => {
    navigateTo('technicians');
  };

  const handleBackFromTechnicians = () => {
    goBack();
  };

  const handleGoBack = () => {
    const previousPage = goBack();
    if (previousPage === 'list' || !previousPage) {
      setCurrentFamily(null);
    }
  };

  return (
    <>
      {currentPage === 'list' && (
        <FamilyList
          onNewFamily={handleNewFamily}
          onViewFamily={handleViewFamily}
          onNavigateToTechnicians={handleNavigateToTechnicians}
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

      {currentPage === 'form' && (
        <FamilyForm
          family={currentFamily}
          onSave={handleSaveFamily}
          onCancel={handleCancel}
          readOnly={!canEdit()}
        />
      )}

      {currentPage === 'technicians' && (
        <TechnicianManagement onBack={handleBackFromTechnicians} />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <NavigationProvider>
          <Toaster position="top-right" richColors />
          <AppContent />
        </NavigationProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}