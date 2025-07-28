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
  console.log('Iniciando geração de PDF editável...');
  
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

  // Configurações de layout
  const margin = 20;
  const headerHeight = 80;
  const cardMargin = 10;
  
  // Layout dos cartões (5 colunas x 3 linhas)
  const cols = 5;
  const rows = 3;
  const cardWidth = (pageWidth - margin * 2 - cardMargin * (cols - 1)) / cols;
  const cardHeight = (pageHeight - margin * 2 - headerHeight - cardMargin * (rows - 1)) / rows;

  // Definição do layout dos cartões conforme a estrutura atual
  const cardsLayout: CardLayout[] = [
    // Linha 1
    { title: 'Justificativa', x: margin, y: margin + headerHeight, width: cardWidth, height: cardHeight, field: 'justificativa' },
    { title: 'Produto', x: margin + (cardWidth + cardMargin), y: margin + headerHeight, width: cardWidth, height: cardHeight, field: 'produto' },
    { title: 'Stakeholders', x: margin + 2 * (cardWidth + cardMargin), y: margin + headerHeight, width: cardWidth, height: cardHeight, field: 'stakeholders' },
    { title: 'Premissas', x: margin + 3 * (cardWidth + cardMargin), y: margin + headerHeight, width: cardWidth, height: cardHeight, field: 'premissas' },
    { title: 'Riscos', x: margin + 4 * (cardWidth + cardMargin), y: margin + headerHeight, width: cardWidth, height: cardHeight, field: 'riscos' },
    
    // Linha 2
    { title: 'Obj. SMART', x: margin, y: margin + headerHeight + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'objSmart' },
    { title: 'Requisitos', x: margin + (cardWidth + cardMargin), y: margin + headerHeight + cardHeight + cardMargin, width: cardWidth, height: cardHeight * 2 + cardMargin, field: 'requisitos' },
    { title: 'Equipe', x: margin + 2 * (cardWidth + cardMargin), y: margin + headerHeight + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'equipe' },
    { title: 'Fases', x: margin + 3 * (cardWidth + cardMargin), y: margin + headerHeight + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'fases' },
    { title: 'Linha do Tempo', x: margin + 4 * (cardWidth + cardMargin), y: margin + headerHeight + cardHeight + cardMargin, width: cardWidth, height: cardHeight, field: 'linhaTempo' },
    
    // Linha 3
    { title: 'Benefícios', x: margin, y: margin + headerHeight + 2 * (cardHeight + cardMargin), width: cardWidth, height: cardHeight, field: 'beneficios' },
    { title: 'Restrições', x: margin + 2 * (cardWidth + cardMargin), y: margin + headerHeight + 2 * (cardHeight + cardMargin), width: cardWidth * 2 + cardMargin, height: cardHeight, field: 'restricoes' },
    { title: 'Custos', x: margin + 4 * (cardWidth + cardMargin), y: margin + headerHeight + 2 * (cardHeight + cardMargin), width: cardWidth, height: cardHeight, field: 'custos' }
  ];

  // Configurar cores
  doc.setFillColor(214, 100, 20); // Cor de fundo dos cartões (azul escuro)
  doc.setTextColor(210, 40, 98); // Cor do texto (branco)
  doc.setDrawColor(214, 100, 30); // Cor das bordas

  // Desenhar cabeçalho
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('VEXNET - TAP (Termo de Abertura do Projeto)', margin, margin + 20);

  // Campos do cabeçalho (GP e Projeto)
  const headerFieldWidth = 200;
  const headerFieldHeight = 15;
  const headerY = margin + 35;

  // Campo GP
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('GP:', margin, headerY);
  
  // Criar campo editável para GP
  const gpField = new (doc as any).AcroFormTextField();
  gpField.fieldName = 'gp';
  gpField.Rect = [margin + 30, headerY - 5, headerFieldWidth, headerFieldHeight];
  gpField.value = data.gp;
  gpField.textColor = [1, 1, 1]; // Branco
  gpField.fillColor = [0.1, 0.2, 0.4]; // Azul escuro
  doc.addField(gpField);

  // Campo Projeto
  doc.text('Projeto:', margin + headerFieldWidth + 50, headerY);
  
  const projetoField = new (doc as any).AcroFormTextField();
  projetoField.fieldName = 'projeto';
  projetoField.Rect = [margin + headerFieldWidth + 80, headerY - 5, headerFieldWidth, headerFieldHeight];
  projetoField.value = data.projeto;
  projetoField.textColor = [1, 1, 1]; // Branco
  projetoField.fillColor = [0.1, 0.2, 0.4]; // Azul escuro
  doc.addField(projetoField);

  // Desenhar cartões e criar campos editáveis
  cardsLayout.forEach((card, index) => {
    // Desenhar fundo do cartão
    doc.setFillColor(33, 41, 60); // Cor de fundo do cartão
    doc.rect(card.x, card.y, card.width, card.height, 'F');
    
    // Desenhar borda
    doc.setDrawColor(70, 166, 255); // Cor da borda
    doc.setLineWidth(1);
    doc.rect(card.x, card.y, card.width, card.height, 'S');

    // Desenhar título do cartão
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // Branco
    doc.text(card.title, card.x + 10, card.y + 15);

    // Desenhar número do cartão
    doc.setFontSize(10);
    doc.setTextColor(178, 186, 193); // Cinza claro
    doc.text(`${index + 1}`, card.x + card.width - 15, card.y + 12);

    // Criar campo de texto editável multilinha
    const textField = new (doc as any).AcroFormTextField();
    textField.fieldName = card.field;
    textField.Rect = [card.x + 10, card.y + 25, card.width - 20, card.height - 35];
    textField.value = data[card.field];
    textField.multiline = true;
    textField.scrollable = true;
    textField.textColor = [1, 1, 1]; // Branco
    textField.fillColor = [0.15, 0.18, 0.25]; // Azul mais escuro para o campo de texto
    textField.fontSize = 10;
    textField.fontName = 'helvetica';
    
    doc.addField(textField);
  });

  // Adicionar rodapé
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, pageHeight - 20);

  console.log('PDF editável gerado com sucesso');
  
  // Salvar o PDF
  doc.save('TAP_Vexnet_Editavel.pdf');
};