import jsPDF from 'jspdf';
import logoBranco from '@/assets/vexnet-logo-branco.png';
import backgroundVex from '@/assets/background-vex.jpg';

// Define a interface para os dados do canvas
interface CanvasData {
  gp: string;
  projeto: string;
  justificativa: string;
  objSmart: string;
  beneficios: string;
  produto: string;
  requisitos: string;
  stakeholders: string;
  equipe: string;
  premissas: string;
  fases: string;
  restricoes: string;
  riscos: string;
  linhaTempo: string;
  custos: string;
}

// Função para converter imagem para Data URI
const toDataURL = (url: string): Promise<string> =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export const gerarPDFEditavel = async (data: CanvasData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a0',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const logoDataUri = await toDataURL(logoBranco);
  const backgroundDataUri = await toDataURL(backgroundVex);

  // Paleta de Cores
  const colors = {
    headerBg: '#003171',
    cardBg: '#003171',
    cardBorder: '#475569',
    cardTitle: '#FFFFFF',
    accent: '#09BBB5',
    accentLight: '#A0E5E3',
    white: '#FFFFFF',
    muted: '#94A3B8',
    inputBg: '#376DBA'
  };

  // --- LAYOUT DO PDF ---

  doc.addImage(backgroundDataUri, 'JPEG', 0, 0, pageWidth, pageHeight);

  // Cabeçalho
  const headerHeight = 40;
  
  const logoHeight = 18; 
  const logoWidth = 80; 
  doc.addImage(logoDataUri, 'PNG', 20, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);

  const headerInputY = (headerHeight / 2) - 8;
  const headerInputWidth = 80;
  const headerInputHeight = 16;
  const gpFieldX = logoWidth + 40;
  const projetoFieldX = gpFieldX + headerInputWidth + 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(colors.muted);
  doc.text("GP:", gpFieldX, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(gpFieldX + 20, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  
  const gpField = new (jsPDF as any).AcroForm.TextField();
  gpField.value = data.gp || '';
  gpField.fieldName = "gp";
  gpField.Rect = [gpFieldX + 20, headerInputY, headerInputWidth, headerInputHeight];
  // CORREÇÃO: Define a aparência padrão para forçar o estilo durante a edição
  (gpField as any).DA = '/Helv 16 Tf 1 1 1 rg'; // Fonte Helvetica, Tamanho 14, Cor Branca
  (gpField as any).fontSize = 16;
  (gpField as any).color = colors.white;
  doc.addField(gpField);

  doc.text("Projeto:", projetoFieldX, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(projetoFieldX + 35, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  
  const projetoField = new (jsPDF as any).AcroForm.TextField();
  projetoField.value = data.projeto || '';
  projetoField.fieldName = "projeto";
  projetoField.Rect = [projetoFieldX + 35, headerInputY, headerInputWidth, headerInputHeight];
  // CORREÇÃO: Define a aparência padrão
  (projetoField as any).DA = '/Helv 14 Tf 1 1 1 rg';
  (projetoField as any).fontSize = 16;
  (projetoField as any).color = colors.white;
  doc.addField(projetoField);
  
  // Grade de Cartões
  const margin = 15;
  const cardGap = 10;
  const gridStartY = headerHeight + 15;

  const cardLayout = [
      { key: 'justificativa', title: 'Justificativa', n: 1, grid: { x: 0, y: 0, w: 1, h: 1 } },
      { key: 'produto', title: 'Produto', n: 4, grid: { x: 1, y: 0, w: 1, h: 1 } },
      { key: 'stakeholders', title: 'Stakeholders', n: 6, grid: { x: 2, y: 0, w: 1, h: 1 } },
      { key: 'premissas', title: 'Premissas', n: 8, grid: { x: 3, y: 0, w: 1, h: 1 } },
      { key: 'riscos', title: 'Riscos', n: 11, grid: { x: 4, y: 0, w: 1, h: 1 } },
      { key: 'objSmart', title: 'Obj. SMART', n: 2, grid: { x: 0, y: 1, w: 1, h: 1 } },
      { key: 'requisitos', title: 'Requisitos', n: 5, grid: { x: 1, y: 1, w: 1, h: 2 } },
      { key: 'equipe', title: 'Equipe', n: 7, grid: { x: 2, y: 1, w: 1, h: 1 } },
      { key: 'fases', title: 'Fases', n: 9, grid: { x: 3, y: 1, w: 1, h: 1 } },
      { key: 'linhaTempo', title: 'Linha do Tempo', n: 12, grid: { x: 4, y: 1, w: 1, h: 1 } },
      { key: 'beneficios', title: 'Benefícios', n: 3, grid: { x: 0, y: 2, w: 1, h: 1 } },
      { key: 'restricoes', title: 'Restrições', n: 10, grid: { x: 2, y: 2, w: 2, h: 1 } },
      { key: 'custos', title: 'Custos', n: 13, grid: { x: 4, y: 2, w: 1, h: 1 } },
  ];
  
  const contentWidth = pageWidth - margin * 2;
  const cardWidth = (contentWidth - cardGap * 4) / 5;
  const cardHeight = (pageHeight - gridStartY - margin - cardGap * 2) / 3;

  cardLayout.forEach(cardDef => {
      const g = cardDef.grid;
      const x = margin + g.x * (cardWidth + cardGap);
      const y = gridStartY + g.y * (cardHeight + cardGap);
      const w = g.w * cardWidth + (g.w - 1) * cardGap;
      const h = g.h * cardHeight + (g.h - 1) * cardGap;

      doc.setFillColor(colors.cardBg);
      doc.setDrawColor(colors.cardBorder);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, w, h, 6, 6, 'FD');

      const cardHeaderY = y + 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(colors.cardTitle);
      doc.text(cardDef.title, x + 10, cardHeaderY);

      const circleRadius = 6;
      const circleX = x + w - 18;
      const circleY = cardHeaderY - 2;
      doc.setFillColor(colors.accentLight);
      doc.circle(circleX, circleY, circleRadius, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(colors.accent);
      doc.text(String(cardDef.n), circleX, circleY + 4, { align: 'center' });
      
      const textAreaY = y + 28;
      const textAreaHeight = h - 35;
      const textField = new (jsPDF as any).AcroForm.TextField();
      textField.value = data[cardDef.key as keyof CanvasData] || '';
      textField.fieldName = cardDef.key;
      textField.multiline = true;
      textField.Rect = [x + 8, textAreaY, w - 16, textAreaHeight];
      // CORREÇÃO: Define a aparência padrão para forçar o estilo durante a edição
      (textField as any).DA = '/Helv 16 Tf 1 1 1 rg'; // Fonte Helvetica, Tamanho 14, Cor Branca
      (textField as any).fontSize = 16;
      (textField as any).color = colors.white;
      doc.addField(textField);
  });
  
  doc.save('TAP_Vexnet.pdf');
};
