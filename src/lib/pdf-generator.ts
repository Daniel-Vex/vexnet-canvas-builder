import jsPDF from 'jspdf';
import logoBranco from '@/assets/vexnet-logo-branco.png';

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

// Função para converter imagem para Data URI para evitar problemas de CORS
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

  // Paleta de Cores Vexnet Atualizada
  const colors = {
    headerBg: '#1E293B',
    cardBg: '#2C3E50',
    cardBorder: '#475569',
    cardTitle: '#FFFFFF',
    accent: '#09BBB5',
    accentLight: '#A0E5E3', // CORREÇÃO: Substituído RGBA por uma cor sólida
    primary: '#005BAA',
    secondary: '#70A6FF',
    white: '#FFFFFF',
    muted: '#94A3B8',
    inputBg: '#374151'
  };
  
  // Adiciona a fonte Montserrat (com fallback para helvetica)
  // Nota: Para que a fonte apareça, o navegador do usuário precisa tê-la instalada.
  try {
      doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
      doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');
      doc.setFont('Montserrat', 'normal');
  } catch(e) {
      console.warn("Fonte Montserrat não encontrada, usando Helvetica.");
      doc.setFont('helvetica', 'normal');
  }

  // --- LAYOUT DO PDF ---

  // Cabeçalho
  const headerHeight = 40;
  doc.setFillColor(colors.headerBg);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  const logoHeight = 20;
  const logoWidth = (logoHeight * 218) / 46;
  doc.addImage(logoDataUri, 'PNG', 15, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);

  const headerInputY = (headerHeight / 2) - 8;
  const headerInputWidth = 80;
  const headerInputHeight = 16;
  
  doc.setFontSize(14); // CORREÇÃO: Tamanho da fonte aumentado
  doc.setTextColor(colors.muted);
  doc.text("GP:", pageWidth - 220, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(pageWidth - 200, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  
  const gpField = new (jsPDF as any).AcroForm.TextField();
  gpField.value = data.gp || '';
  gpField.fieldName = "gp";
  gpField.Rect = [pageWidth - 200, headerInputY, headerInputWidth, headerInputHeight];
  gpField.color = colors.white; // CORREÇÃO: Cor do texto do campo
  doc.addField(gpField);

  doc.text("Projeto:", pageWidth - 110, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(pageWidth - 80, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  
  const projetoField = new (jsPDF as any).AcroForm.TextField();
  projetoField.value = data.projeto || '';
  projetoField.fieldName = "projeto";
  projetoField.Rect = [pageWidth - 80, headerInputY, headerInputWidth, headerInputHeight];
  projetoField.color = colors.white; // CORREÇÃO: Cor do texto do campo
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

      const cardHeaderY = y + 12;
      doc.setFont('Montserrat', 'bold');
      doc.setFontSize(14); // CORREÇÃO: Tamanho da fonte aumentado
      doc.setTextColor(colors.cardTitle); // CORREÇÃO: Cor da fonte definida como branca
      doc.text(cardDef.title, x + 10, cardHeaderY);

      const circleRadius = 5;
      const circleX = x + w - 15;
      const circleY = cardHeaderY - 2;
      doc.setFillColor(colors.accentLight);
      doc.circle(circleX, circleY, circleRadius, 'F');
      
      doc.setFont('Montserrat', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.accent);
      doc.text(String(cardDef.n), circleX, circleY + 3.5, { align: 'center' });
      
      const textAreaY = y + 25;
      const textAreaHeight = h - 30;
      const textField = new (jsPDF as any).AcroForm.TextField();
      textField.value = data[cardDef.key as keyof CanvasData] || '';
      textField.fieldName = cardDef.key;
      textField.multiline = true;
      textField.Rect = [x + 5, textAreaY, w - 10, textAreaHeight];
      textField.color = colors.white; // CORREÇÃO: Cor do texto do campo
      doc.addField(textField);
  });
  
  doc.save('TAP_Vexnet.pdf');
};
