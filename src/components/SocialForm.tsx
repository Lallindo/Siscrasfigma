import { useState } from 'react';
import { SocialData } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';

interface SocialFormProps {
  data: SocialData;
  onChange: (data: SocialData) => void;
  onNext: () => void;
  onBack: () => void;
  readOnly?: boolean;
}

export function SocialForm({ data, onChange, onNext, onBack, readOnly = false }: SocialFormProps) {
  const [localData, setLocalData] = useState<SocialData>(data);

  const updateField = (field: keyof SocialData, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const updateNestedField = (parent: keyof SocialData, field: string, value: any) => {
    const updated = {
      ...localData,
      [parent]: {
        ...(localData[parent] as any),
        [field]: value,
      },
    };
    setLocalData(updated);
    onChange(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-blue-900 mb-2">IV - Aspectos Referentes às Desproteções Sociais</h1>
          </div>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">Privações das Famílias e/ou de um ou mais Integrante na(s) Área(s) de:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.assistenciaSocial}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'assistenciaSocial', checked)}
                  />
                  <Label>I - Serviços, programas, projetos e benefícios da área da assistência social</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.trabalhoRenda}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'trabalhoRenda', checked)}
                  />
                  <Label>IV - Serviços, programas e projetos na área de trabalho e renda</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.saude}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'saude', checked)}
                  />
                  <Label>VII - Serviços, programas, projetos e benefícios da área da saúde</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.saneamentoBasico}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'saneamentoBasico', checked)}
                  />
                  <Label>X - Serviços, programas, projetos e benefícios da política de saneamento básico</Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.educacao}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'educacao', checked)}
                  />
                  <Label>II - Serviços, programas, projetos e benefícios da área da educação</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.cultura}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'cultura', checked)}
                  />
                  <Label>V - Serviços, programas e projetos na área da cultura e lazer</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.habitacao}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'habitacao', checked)}
                  />
                  <Label>VIII - Serviços, programas, projetos e benefícios da área da habitação</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.energiaEletrica}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'energiaEletrica', checked)}
                  />
                  <Label>XI - Serviços, programas, projetos e benefícios das políticas públicas relacionadas à energia elétrica</Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.previdenciaSocial}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'previdenciaSocial', checked)}
                  />
                  <Label>III - Serviços, programas, projetos e benefícios da área da previdência social</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.juridicaSociojuridica}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'juridicaSociojuridica', checked)}
                  />
                  <Label>VI - Serviços, programas, projetos e benefícios da área Jurídica/Sociojurídica</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.segurancaAlimentar}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'segurancaAlimentar', checked)}
                  />
                  <Label>IX - Serviços, programas, projetos e benefícios da política de segurança alimentar</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.privacoes.outras}
                    onCheckedChange={(checked) => updateNestedField('privacoes', 'outras', checked)}
                  />
                  <Label>XII - Serviços, programas, projetos e benefícios de outras áreas</Label>
                </div>
              </div>
            </div>

            {localData.privacoes.outras && (
              <div>
                <Label>Especificar outras áreas:</Label>
                <Input
                  value={localData.privacoes.outrasEspecificar}
                  onChange={(e) => updateNestedField('privacoes', 'outrasEspecificar', e.target.value)}
                  placeholder="Especifique outras áreas"
                />
              </div>
            )}

            <div>
              <Label>Observações:</Label>
              <Textarea
                value={localData.observacoes}
                onChange={(e) => updateField('observacoes', e.target.value)}
                placeholder="Observações sobre desproteções sociais"
                rows={3}
              />
            </div>
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">V - Aspectos Referentes às Condições de Moradia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div>
              <Label className="mb-3 block">Situação:</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.cdhu}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'cdhu', checked)}
                  />
                  <Label>CDHU</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.mcmv}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'mcmv', checked)}
                  />
                  <Label>MCMV</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.augSocial}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'augSocial', checked)}
                  />
                  <Label>Aug. Social</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.ocupacao}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'ocupacao', checked)}
                  />
                  <Label>Ocupação</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.auxMoradia}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'auxMoradia', checked)}
                  />
                  <Label>Aux. Moradia</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.cedido}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'cedido', checked)}
                  />
                  <Label>Cedido</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.proprio}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'proprio', checked)}
                  />
                  <Label>Próprio</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.alugado}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'alugado', checked)}
                  />
                  <Label>Alugado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.financ}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'financ', checked)}
                  />
                  <Label>Financ.:</Label>
                  <Input
                    value={localData.situacao.financEspecificar}
                    onChange={(e) => updateNestedField('situacao', 'financEspecificar', e.target.value)}
                    placeholder="Especifique"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.situacao.outros}
                    onCheckedChange={(checked) => updateNestedField('situacao', 'outros', checked)}
                  />
                  <Label>Outros:</Label>
                  <Input
                    value={localData.situacao.outrosEspecificar}
                    onChange={(e) => updateNestedField('situacao', 'outrosEspecificar', e.target.value)}
                    placeholder="Especifique"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-3 block">Tipo de Abastecimento de Água:</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoAbastecimentoAgua.redePublica}
                      onCheckedChange={(checked) => updateNestedField('tipoAbastecimentoAgua', 'redePublica', checked)}
                    />
                    <Label>Rede Pública</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoAbastecimentoAgua.poco}
                      onCheckedChange={(checked) => updateNestedField('tipoAbastecimentoAgua', 'poco', checked)}
                    />
                    <Label>Poço</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoAbastecimentoAgua.irregular}
                      onCheckedChange={(checked) => updateNestedField('tipoAbastecimentoAgua', 'irregular', checked)}
                    />
                    <Label>Irregular</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoAbastecimentoAgua.suspenso}
                      onCheckedChange={(checked) => updateNestedField('tipoAbastecimentoAgua', 'suspenso', checked)}
                    />
                    <Label>Suspenso</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoAbastecimentoAgua.outros}
                      onCheckedChange={(checked) => updateNestedField('tipoAbastecimentoAgua', 'outros', checked)}
                    />
                    <Label>Outros:</Label>
                    <Input
                      value={localData.tipoAbastecimentoAgua.outrosEspecificar}
                      onChange={(e) => updateNestedField('tipoAbastecimentoAgua', 'outrosEspecificar', e.target.value)}
                      placeholder="Especifique"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Escoamento Sanitário:</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.escoamentoSanitario.redePublica}
                      onCheckedChange={(checked) => updateNestedField('escoamentoSanitario', 'redePublica', checked)}
                    />
                    <Label>Rede Pública</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.escoamentoSanitario.ceuAberto}
                      onCheckedChange={(checked) => updateNestedField('escoamentoSanitario', 'ceuAberto', checked)}
                    />
                    <Label>Céu Aberto</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.escoamentoSanitario.fossa}
                      onCheckedChange={(checked) => updateNestedField('escoamentoSanitario', 'fossa', checked)}
                    />
                    <Label>Fossa</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.escoamentoSanitario.outros}
                      onCheckedChange={(checked) => updateNestedField('escoamentoSanitario', 'outros', checked)}
                    />
                    <Label>Outros:</Label>
                    <Input
                      value={localData.escoamentoSanitario.outrosEspecificar}
                      onChange={(e) => updateNestedField('escoamentoSanitario', 'outrosEspecificar', e.target.value)}
                      placeholder="Especifique"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Nº de Cômodos:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Total de cômodos:</Label>
                  <Input
                    type="number"
                    value={localData.numeroComodos}
                    onChange={(e) => updateField('numeroComodos', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Cômodos para dormitório:</Label>
                  <Input
                    type="number"
                    value={localData.comodosUtilizadosDormitorio}
                    onChange={(e) => updateField('comodosUtilizadosDormitorio', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Nº de banheiros:</Label>
                  <Input
                    type="number"
                    value={localData.numeroBanheiros}
                    onChange={(e) => updateField('numeroBanheiros', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Média de pessoas por dormitório:</Label>
                  <Input
                    type="number"
                    value={localData.mediaPessoasPorDormitorio}
                    onChange={(e) => updateField('mediaPessoasPorDormitorio', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Outros:</Label>
              <Textarea
                value={localData.outros}
                onChange={(e) => updateField('outros', e.target.value)}
                placeholder="Outras informações sobre as condições de moradia"
                rows={3}
              />
            </div>
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

          <div className="flex justify-between">
            <Button onClick={onBack} variant="outline" className="gap-2 border-gray-300">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button onClick={onNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
              Próximo: Serviços e Programas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
