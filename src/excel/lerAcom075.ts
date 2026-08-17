import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const COLUNAS = ['Nota', 'Valor', 'Dt.Emissao', 'CNPJ', 'Razao Social', 'Natureza'] as const;
const LINHA_CABECALHO = 1;

export interface RegistroAcom075 {
  Nota: string;
  Valor: number;
  DtEmissao: Date | null;
  CNPJ: string;
  RazaoSocial: string;
  Natureza: string;
}

export interface ResultadoAcom075 {
  cabecalhos: readonly string[];
  dados: RegistroAcom075[];
}

function paraArray<T>(valor: T | T[] | undefined | null): T[] {
  if (valor == null) return [];
  return Array.isArray(valor) ? valor : [valor];
}

function textoDaCelula(cell: any): string {
  return String(cell?.Data?.['#text'] ?? '').trim();
}

// No XML do Excel células vazias são omitidas, e a próxima traz o atributo
// ss:Index (1-based) com sua coluna real. Reconstruímos o array denso a partir
// disso, senão colunas ficam desalinhadas quando há vazios no meio da linha.
function celulasAlinhadas(linha: any): string[] {
  const resultado: string[] = [];
  let coluna = 0;

  for (const cell of paraArray(linha?.Cell)) {
    const index = cell?.['@_Index'];
    if (index !== undefined) {
      coluna = Number(index) - 1;
    }
    resultado[coluna] = textoDaCelula(cell);
    coluna++;
  }

  return resultado;
}

function parseNumeroBR(valor: string): number {
  const s = valor.trim();
  if (!s) return 0;

  const limpo = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = Number(limpo);

  return Number.isNaN(n) ? 0 : n;
}

function parseDataBR(valor: string): Date | null {
  const s = valor.trim();
  if (!s) return null;

  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    const [, dia = '', mes = '', ano = '', hora = '0', min = '0', seg = '0'] = m;
    const d = new Date(+ano, +mes - 1, +dia, +hora, +min, +seg);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function removerDuplicatas(dados: RegistroAcom075[]): RegistroAcom075[] {
  const vistos = new Set<string>();

  return dados.filter((r) => {
    const chave = [r.Nota, r.Valor, r.DtEmissao?.getTime() ?? '', r.CNPJ, r.RazaoSocial, r.Natureza].join('|');
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

export async function lerAcom075(caminho: string): Promise<ResultadoAcom075> {
  let xml: string;
  try {
    xml = await fs.readFile(caminho, 'utf-8');
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      throw new Error(`Arquivo ACOM075 não encontrado: ${caminho}`);
    }
    throw err;
  }

  const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
  const documento = parser.parse(xml);

  const worksheets = paraArray(documento?.Workbook?.Worksheet);
  const tabela = (worksheets.find((w: any) => w?.Table) ?? worksheets[0])?.Table;
  if (!tabela) {
    throw new Error('Estrutura inválida: não encontrei Workbook > Worksheet > Table no ACOM075.');
  }

  const linhas = paraArray(tabela.Row);
  const linhaCabecalho = linhas[LINHA_CABECALHO];
  if (!linhaCabecalho) {
    throw new Error(`Linha de cabeçalho (índice ${LINHA_CABECALHO}) não encontrada no ACOM075.`);
  }

  const cabecalhos = celulasAlinhadas(linhaCabecalho);
  const indices = COLUNAS.map((nome) => {
    const indice = cabecalhos.indexOf(nome);
    if (indice === -1) {
      throw new Error(
        `Coluna não encontrada no ACOM075: "${nome}". Disponíveis: ${cabecalhos.filter(Boolean).join(', ')}`,
      );
    }
    return indice;
  });

  const [iNota, iValor, iData, iCnpj, iRazao, iNatureza] = indices as [
    number, number, number, number, number, number,
  ];

  const dados = linhas
    .slice(LINHA_CABECALHO + 1)
    .map((linha): RegistroAcom075 => {
      const c = celulasAlinhadas(linha);
      return {
        Nota: c[iNota] ?? '',
        Valor: parseNumeroBR(c[iValor] ?? '0'),
        DtEmissao: parseDataBR(c[iData] ?? ''),
        CNPJ: c[iCnpj] ?? '',
        RazaoSocial: c[iRazao] ?? '',
        Natureza: c[iNatureza] ?? '',
      };
    })
    .filter((r) => r.Nota || r.CNPJ || r.Valor !== 0);

  return {
    cabecalhos: COLUNAS,
    dados: removerDuplicatas(dados),
  };
}
