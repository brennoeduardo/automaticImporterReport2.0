import ExcelJS from 'exceljs';
import type { RegistroAcom075 } from './lerAcom075.js';

const CABECALHOS = [
  'Nota', 'Valor', 'Dt.Emissao', 'CNPJ', 'Razao Social', 'Natureza', 'RESP', 'OBSERVAÇÃO',
];

const VERDE_ESCURO = 'FF1E5631';
const VERDE_CLARO = 'FFD9EAD3';
const BRANCO = 'FFFFFFFF';

function preencher(argb: string): ExcelJS.Fill {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

export async function criarPlanilha(dados: RegistroAcom075[], caminhoSaida: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Importador');

  worksheet.addRow(CABECALHOS);
  for (const r of dados) {
    worksheet.addRow([r.Nota, r.Valor, r.DtEmissao, r.CNPJ, r.RazaoSocial, r.Natureza, '', '']);
  }

  const cabecalho = worksheet.getRow(1);
  cabecalho.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: BRANCO } };
    cell.fill = preencher(VERDE_ESCURO);
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  for (let i = 2; i <= worksheet.rowCount; i++) {
    worksheet.getRow(i).eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 11 };
      cell.fill = preencher(VERDE_CLARO);
      cell.alignment = { vertical: 'middle' };
    });
  }

  ajustarLarguras(worksheet);
  worksheet.getColumn(2).numFmt = 'R$ #,##0.00';
  worksheet.getColumn(3).numFmt = 'dd/mm/yyyy';
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  await workbook.xlsx.writeFile(caminhoSaida);
}

function ajustarLarguras(worksheet: ExcelJS.Worksheet): void {
  worksheet.columns.forEach((coluna) => {
    let largura = 10;
    coluna.eachCell?.({ includeEmpty: false }, (cell) => {
      // Datas são medidas pelo texto formatado, não pelo objeto Date inteiro.
      const texto = cell.value instanceof Date ? 'dd/mm/yyyy' : String(cell.value ?? '');
      largura = Math.max(largura, texto.length + 2);
    });
    coluna.width = largura;
  });
}
