import jsPDF from 'jspdf';
import logoBranco from '@/assets/vexnet-logo-branco.png'; // Importa a imagem local

// Tipagem dos dados que a função recebe
interface CanvasData {
  gp: string; projeto: string; justificativa: string; objSmart: string;
  beneficios: string; produto: string; requisitos: string; stakeholders: string;
  equipe: string; premissas: string; fases: string; restricoes: string;
  riscos: string; linhaTempo: string; custos: string;
}

// Função auxiliar para carregar a imagem e convertê-la para um formato que o jsPDF entende
const getImageDataUri = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Não foi possível obter o contexto do canvas'));
      }
    };
    image.onerror = (error) => reject(error);
    image.src = url;
  });
};

export const gerarPDFEditavel = async (data: CanvasData) => {
  console.log("Iniciando a geração do PDF com renderização de alta fidelidade...");

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a0' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Carrega a imagem do logo
  const logoDataUri = await getImageDataUri(logoBranco);

  // Cores exatas baseadas no seu arquivo index.css
  const colors = {
    headerBg: '#1E293B',        // Cor de fundo do cabeçalho
    cardBg: 'rgba(30, 41, 59, 0.8)', // Fundo do card com transparência
    cardBorder: '#475569',      // Borda do card
    cardTitle: '#FFFFFF',       // Título branco
    cardNumberCircleBg: 'rgba(9, 187, 181, 0.2)', // Fundo do círculo do número
    cardNumberText: '#09BBB5',   // Cor do número
    white: '#FFFFFF',
    muted: '#94A3B8',           // Texto cinza para labels
    inputBg: 'rgba(100, 116, 139, 0.5)' // Fundo do input
  };
  
  // Adiciona a fonte Montserrat (se disponível no sistema do usuário)
  try {
    // Nota: Para usar fontes customizadas, elas precisam estar acessíveis.
    // Este é um exemplo e pode não funcionar sem a configuração de fontes no projeto.
    // doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
    // doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');
    // doc.setFont('Montserrat', 'normal');
    doc.setFont('helvetica', 'normal');
  } catch (e) {
    console.warn("Fonte customizada não encontrada, usando Helvetica.");
    doc.setFont('helvetica', 'normal');
  }


  // --- DESENHO DO LAYOUT ---
  
  // 1. Cabeçalho
  const headerHeight = 40;
  doc.setFillColor(colors.headerBg);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  const logoHeight = 20;
  const logoWidth = (logoHeight * 218) / 46; // Mantém a proporção da imagem original
  doc.addImage(logoDataUri, 'PNG', 15, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);

  // Campos do Cabeçalho
  const headerInputY = (headerHeight / 2) - 8;
  const headerInputWidth = 80;
  const headerInputHeight = 16;
  
  doc.setFontSize(12);
  doc.setTextColor(colors.muted);
  doc.text("GP:", pageWidth - 220, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(pageWidth - 200, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  const gpField = new (jsPDF as any).AcroForm.TextField();
  gpField.value = data.gp || '';
  gpField.fieldName = "gp";
  // CORREÇÃO: Define as coordenadas no objeto do campo
  gpField.Rect = [pageWidth - 200, headerInputY, headerInputWidth, headerInputHeight];
  doc.addField(gpField);

  doc.text("Projeto:", pageWidth - 110, headerInputY + 10);
  doc.setFillColor(colors.inputBg);
  doc.roundedRect(pageWidth - 80, headerInputY, headerInputWidth, headerInputHeight, 3, 3, 'F');
  const projetoField = new (jsPDF as any).AcroForm.TextField();
  projetoField.value = data.projeto || '';
  projetoField.fieldName = "projeto";
  // CORREÇÃO: Define as coordenadas no objeto do campo
  projetoField.Rect = [pageWidth - 80, headerInputY, headerInputWidth, headerInputHeight];
  doc.addField(projetoField);

  // 2. Grade de Cartões
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

    // Desenha o corpo do card
    doc.setFillColor(colors.cardBg);
    doc.setDrawColor(colors.cardBorder);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, w, h, 6, 6, 'FD');

    // Cabeçalho do Card
    const cardHeaderY = y + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.cardTitle);
    doc.text(cardDef.title, x + 10, cardHeaderY);

    // Círculo com número
    const circleRadius = 5;
    const circleX = x + w - 15;
    const circleY = cardHeaderY - 2;
    doc.setFillColor(colors.cardNumberCircleBg);
    doc.circle(circleX, circleY, circleRadius, 'F');
    doc.setFontSize(10);
    doc.setTextColor(colors.cardNumberText);
    doc.text(String(cardDef.n), circleX, circleY + 3.5, { align: 'center' });

    // Campo de texto editável
    const textAreaY = y + 25;
    const textAreaHeight = h - 30;
    const textField = new (jsPDF as any).AcroForm.TextField();
    textField.value = data[cardDef.key as keyof CanvasData] || '';
    textField.fieldName = cardDef.key;
    textField.multiline = true;
    // CORREÇÃO: Define as coordenadas no objeto do campo
    textField.Rect = [x + 5, textAreaY, w - 10, textAreaHeight];
    doc.addField(textField);
  });
  
  doc.save('TAP_Vexnet_Corrigido.pdf');
};