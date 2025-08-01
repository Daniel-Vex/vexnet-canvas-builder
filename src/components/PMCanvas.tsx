import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PMCanvasCard } from "./PMCanvasCard";
import { VexnetLogo } from "./VexnetLogo";
import bgImage from '@/assets/background-vex.jpg'; // Importa a imagem de fundo local
import { 
  FileText, Target, TrendingUp, Package, ClipboardList, Users, 
  UserCheck, Cloud, Calendar, AlertTriangle, Shield, Clock, DollarSign, Download 
} from "lucide-react";
import { gerarPDFEditavel } from "@/lib/pdf-generator";

interface CanvasData {
  gp: string; projeto: string; justificativa: string; objSmart: string;
  beneficios: string; produto: string; requisitos: string; stakeholders: string;
  equipe: string; premissas: string; fases: string; restricoes: string;
  riscos: string; linhaTempo: string; custos: string;
}

export const PMCanvas = () => {
  const [data, setData] = useState<CanvasData>({
    gp: "", projeto: "", justificativa: "", objSmart: "", beneficios: "",
    produto: "", requisitos: "", stakeholders: "", equipe: "", premissas: "",
    fases: "", restricoes: "", riscos: "", linhaTempo: "", custos: ""
  });

  const updateField = (field: keyof CanvasData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const gerarPDF = async () => {
    console.log('Gerando PDF editável...');
    try {
      await gerarPDFEditavel(data);
      console.log('PDF editável gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF editável:', error);
    }
  };

  return (
    // Usa a imagem de fundo importada localmente
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{backgroundImage: `url(${bgImage})`}}>
      {/* Header */}
      <div className="bg-vexnet-background/80 backdrop-blur-sm border-b border-border/20 p-4 print:bg-vexnet-background">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <VexnetLogo />
          <div className="flex flex-row items-end gap-4 w-full lg:w-auto">
            <div className="flex flex-row gap-4 text-sm flex-1 lg:flex-initial">
              <div className="flex-1 lg:w-48">
                <Label htmlFor="gp" className="text-muted-foreground">GP:</Label>
                <Input
                  id="gp"
                  value={data.gp}
                  onChange={(e) => updateField("gp", e.target.value)}
                  className="bg-vexnet-secondary/50 border-border/30 text-foreground mt-1"
                  placeholder="Digite o GP"
                />
              </div>
              <div className="flex-1 lg:w-48">
                <Label htmlFor="projeto" className="text-muted-foreground">Projeto:</Label>
                <Input
                  id="projeto"
                  value={data.projeto}
                  onChange={(e) => updateField("projeto", e.target.value)}
                  className="bg-vexnet-secondary/50 border-border/30 text-foreground mt-1"
                  placeholder="Digite o nome do projeto"
                />
              </div>
            </div>
            <Button 
              onClick={gerarPDF}
              className="bg-vexnet-accent hover:bg-vexnet-accent/80 text-vexnet-background print:hidden h-10 px-4 whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Grid */}
      <div id="canvas-content" className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-fr">
          {/* Linha 1 */}
          <PMCanvasCard title="Justificativa" number={1} icon={<FileText className="w-4 h-4" />} value={data.justificativa} onChange={(value) => updateField("justificativa", value)} className="col-span-1" />
          <PMCanvasCard title="Produto" number={4} icon={<Package className="w-4 h-4" />} value={data.produto} onChange={(value) => updateField("produto", value)} className="col-span-1" />
          <PMCanvasCard title="Stakeholders" number={6} icon={<Users className="w-4 h-4" />} value={data.stakeholders} onChange={(value) => updateField("stakeholders", value)} className="col-span-1" />
          <PMCanvasCard title="Premissas" number={8} icon={<Cloud className="w-4 h-4" />} value={data.premissas} onChange={(value) => updateField("premissas", value)} className="col-span-1" />
          <PMCanvasCard title="Riscos" number={11} icon={<Shield className="w-4 h-4" />} value={data.riscos} onChange={(value) => updateField("riscos", value)} className="col-span-1" />

          {/* Linha 2 */}
          <PMCanvasCard title="Obj. SMART" number={2} icon={<Target className="w-4 h-4" />} value={data.objSmart} onChange={(value) => updateField("objSmart", value)} className="col-span-1" />
          <PMCanvasCard title="Requisitos" number={5} icon={<ClipboardList className="w-4 h-4" />} value={data.requisitos} onChange={(value) => updateField("requisitos", value)} className="lg:row-span-2" rows={10} />
          <PMCanvasCard title="Equipe" number={7} icon={<UserCheck className="w-4 h-4" />} value={data.equipe} onChange={(value) => updateField("equipe", value)} className="col-span-1" />
          <PMCanvasCard title="Fases" number={9} icon={<Calendar className="w-4 h-4" />} value={data.fases} onChange={(value) => updateField("fases", value)} className="col-span-1" />
          <PMCanvasCard title="Linha do Tempo" number={12} icon={<Clock className="w-4 h-4" />} value={data.linhaTempo} onChange={(value) => updateField("linhaTempo", value)} className="col-span-1" />

          {/* Linha 3 */}
          <PMCanvasCard title="Benefícios" number={3} icon={<TrendingUp className="w-4 h-4" />} value={data.beneficios} onChange={(value) => updateField("beneficios", value)} className="col-span-1" />
          <PMCanvasCard title="Restrições" number={10} icon={<AlertTriangle className="w-4 h-4" />} value={data.restricoes} onChange={(value) => updateField("restricoes", value)} className="lg:col-span-2" />
          <PMCanvasCard title="Custos" number={13} icon={<DollarSign className="w-4 h-4" />} value={data.custos} onChange={(value) => updateField("custos", value)} className="col-span-1" />
        </div>
      </div>
    </div>
  );
};