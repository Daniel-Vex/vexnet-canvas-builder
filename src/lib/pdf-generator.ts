import jsPDF from 'jspdf';

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

interface CardLayout {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  field: keyof CanvasData;
}

export const gerarPDFEditavel = async (data: CanvasData): Promise<void> => {
  console.log('Iniciando geração de PDF editável com desenho visual...');
  
  // Inicializar jsPDF em formato A0 paisagem
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a0'
  });

  // Dimensões da página A0 em paisagem
  const pageWidth = doc.internal.pageSize.getWidth(); // ~1189mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~841mm
  
  console.log(`Dimensões da página: ${pageWidth}x${pageHeight}mm`);

  // ===== 1. DESENHO DO FUNDO DA PÁGINA =====
  doc.setFillColor(15, 23, 42); // Cor de fundo escuro (slate-900)
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // ===== 2. DESENHO DO CABEÇALHO =====
  const headerHeight = 100;
  const margin = 40;
  
  // Fundo do cabeçalho
  doc.setFillColor(30, 41, 59); // Cor do cabeçalho (slate-800)
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Título principal
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255); // Branco
  doc.text('VEXNET - TAP (Termo de Abertura do Projeto)', margin, 35);

  // ===== 3. CAMPOS DO CABEÇALHO (GP e PROJETO) =====
  const fieldY = 60;
  const fieldHeight = 20;
  const fieldWidth = 250;
  
  // Campo GP
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // Cinza claro
  doc.text('GP:', margin, fieldY + 15);
  
  // Desenhar fundo do campo GP
  doc.setFillColor(51, 65, 85); // Cor do input (slate-700)
  doc.roundedRect(margin + 50, fieldY, fieldWidth, fieldHeight, 3, 3, 'F');
  
  // Campo editável GP
  const gpField = new (doc as any).AcroFormTextField();
  gpField.fieldName = 'gp';
  gpField.Rect = [margin + 55, fieldY + 3, fieldWidth - 10, fieldHeight - 6];
  gpField.value = data.gp;
  gpField.textColor = [1, 1, 1];
  gpField.fillColor = [0.2, 0.255, 0.333];
  gpField.fontSize = 12;
  doc.addField(gpField);

  // Campo Projeto
  const projetoX = margin + fieldWidth + 100;
  doc.text('Projeto:', projetoX, fieldY + 15);
  
  // Desenhar fundo do campo Projeto
  doc.setFillColor(51, 65, 85);
  doc.roundedRect(projetoX + 80, fieldY, fieldWidth, fieldHeight, 3, 3, 'F');
  
  // Campo editável Projeto
  const projetoField = new (doc as any).AcroFormTextField();
  projetoField.fieldName = 'projeto';
  projetoField.Rect = [projetoX + 85, fieldY + 3, fieldWidth - 10, fieldHeight - 6];
  projetoField.value = data.projeto;
  projetoField.textColor = [1, 1, 1];
  projetoField.fillColor = [0.2, 0.255, 0.333];
  projetoField.fontSize = 12;
  doc.addField(projetoField);

  // ===== 4. CONFIGURAÇÃO DA GRADE DE CARTÕES =====
  const gridStartY = headerHeight + 30;
  const cardMargin = 15;
  const cols = 5;
  const rows = 3;
  const cardWidth = (pageWidth - margin * 2 - cardMargin * (cols - 1)) / cols;
  const cardHeight = (pageHeight - gridStartY - margin - cardMargin * (rows - 1)) / rows;

  // ===== 5. DEFINIÇÃO DOS CARTÕES COM NUMERAÇÃO CORRETA =====
  const cardsLayout: CardLayout[] = [
    // Linha 1
    { title: 'Justificativa', x: margin, y: gridStartY, width: cardWidth, height: cardHeight, field: 'justificativa' },
    { title: 'Produto', x: margin + (cardWidth + cardMargin), y: gridStartY, width: cardWidth, height: cardHeight, field: 'produto' },
    { title: 'Stakeholders', x: margin + 2 * (cardWidth + cardMargin), y: gridStartY, width: cardWidth, height: cardHeight, field: 'stakeholders' },
    { title: 'Premissas', x: margin + 3 * (cardWidth + cardMargin), y: gridStartY, width: cardWidth, height: cardHeight, field: 'premissas' },
    { title: 'Riscos', x: margin + 4 * (cardWidth + cardMargin), y: gridStartY, width: cardWidth, height: cardHeight, field: 'riscos' },
    
    // Linha 2
    { title: 'Obj. SMART', x: margin, y: gridStartY + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'objSmart' },
    { title: 'Requisitos', x: margin + (cardWidth + cardMargin), y: gridStartY + cardHeight + cardMargin, width: cardWidth, height: cardHeight * 2 + cardMargin, field: 'requisitos' },
    { title: 'Equipe', x: margin + 2 * (cardWidth + cardMargin), y: gridStartY + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'equipe' },
    { title: 'Fases', x: margin + 3 * (cardWidth + cardMargin), y: gridStartY + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'fases' },
    { title: 'Linha do Tempo', x: margin + 4 * (cardWidth + cardMargin), y: gridStartY + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'linhaTempo' },
    
    // Linha 3
    { title: 'Benefícios', x: margin, y: gridStartY + 2 * (cardHeight + cardMargin), width: cardWidth, height: cardHeight, field: 'beneficios' },
    { title: 'Restrições', x: margin + 2 * (cardWidth + cardMargin), y: gridStartY + 2 * (cardHeight + cardMargin), width: cardWidth * 2 + cardMargin, height: cardHeight, field: 'restricoes' },
    { title: 'Custos', x: margin + 4 * (cardWidth + cardMargin), y: gridStartY + 2 * (cardHeight + cardMargin), width: cardWidth, height: cardHeight, field: 'custos' }
  ];

  // Numeração dos cartões conforme layout original
  const cardNumbers = [1, 4, 6, 8, 11, 2, 5, 7, 9, 12, 3, 10, 13];

  // ===== 6. DESENHO DOS CARTÕES =====
  cardsLayout.forEach((card, index) => {
    // Desenhar fundo do cartão com gradiente simulado
    doc.setFillColor(51, 65, 85); // Base do cartão (slate-700)
    doc.roundedRect(card.x, card.y, card.width, card.height, 8, 8, 'F');
    
    // Desenhar borda sutil
    doc.setDrawColor(71, 85, 105); // Cor da borda (slate-600)
    doc.setLineWidth(0.5);
    doc.roundedRect(card.x, card.y, card.width, card.height, 8, 8, 'S');

    // Desenhar área do cabeçalho do cartão
    doc.setFillColor(30, 41, 59); // Cabeçalho mais escuro (slate-800)
    doc.roundedRect(card.x, card.y, card.width, 45, 8, 8, 'F');
    doc.rect(card.x, card.y + 37, card.width, 8, 'F'); // Para manter bordas retas na parte inferior do cabeçalho

    // Desenhar título do cartão
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // Branco
    doc.text(card.title, card.x + 20, card.y + 25);

    // Desenhar círculo com número
    const circleX = card.x + card.width - 25;
    const circleY = card.y + 22;
    const circleRadius = 12;
    
    doc.setFillColor(59, 130, 246); // Azul (blue-500)
    doc.circle(circleX, circleY, circleRadius, 'F');
    
    // Número no círculo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const numberText = cardNumbers[index].toString();
    const textWidth = doc.getTextWidth(numberText);
    doc.text(numberText, circleX - textWidth/2, circleY + 4);

    // ===== 7. CAMPO DE TEXTO EDITÁVEL MULTILINHA =====
    const textAreaY = card.y + 55;
    const textAreaHeight = card.height - 65;
    
    // Desenhar fundo da área de texto
    doc.setFillColor(30, 41, 59); // Fundo da textarea (slate-800)
    doc.roundedRect(card.x + 10, textAreaY, card.width - 20, textAreaHeight, 5, 5, 'F');
    
    // Criar campo editável multilinha
    const textField = new (doc as any).AcroFormTextField();
    textField.fieldName = card.field;
    textField.Rect = [card.x + 15, textAreaY + 5, card.width - 30, textAreaHeight - 10];
    textField.value = data[card.field];
    textField.multiline = true;
    textField.scrollable = true;
    textField.textColor = [1, 1, 1]; // Branco
    textField.fillColor = [0.118, 0.161, 0.231]; // Fundo transparente
    textField.fontSize = 11;
    textField.fontName = 'helvetica';
    textField.borderColor = [0.278, 0.333, 0.412]; // Borda sutil
    textField.borderWidth = 1;
    
    doc.addField(textField);
  });

  // ===== 8. RODAPÉ =====
  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184); // Cinza médio (slate-400)
  const footerText = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`;
  doc.text(footerText, margin, pageHeight - 30);
  
  // Logo/marca d'água
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Cinza mais claro (slate-500)
  doc.text('VEXNET Telecom - Sistema de Gestão de Projetos', pageWidth - 300, pageHeight - 30);

  console.log('PDF editável com layout visual gerado com sucesso');
  
  // Salvar o PDF
  doc.save('TAP_Vexnet.pdf');
};