import fs from 'node:fs/promises';
import path from 'node:path';
import type { Periodo } from './datas.js';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export async function garantirPasta(caminhoArquivo: string): Promise<void> {
  await fs.mkdir(path.dirname(caminhoArquivo), { recursive: true });
}

export async function resolverCaminhoSaida(base: string, periodo: Periodo): Promise<string> {
  const [, mesFinal = '', anoFinal = ''] = periodo.dataFinal.split('/');
  const nomeMes = MESES[Number(mesFinal) - 1] ?? mesFinal;

  const pastaAno = path.join(base, anoFinal);
  const pastaMes = await encontrarPastaMes(pastaAno, nomeMes);

  const inicio = diaMes(periodo.dataInicial);
  const fim = diaMes(periodo.dataFinal);
  const nomeArquivo = inicio === fim ? inicio : `${inicio} a ${fim}`;

  return path.join(pastaMes, `${nomeArquivo}.xlsx`);
}

// Procura uma pasta já existente cujo nome contenha o mês (aceita prefixos como
// "08 - Agosto" e ignora acentos). Se não achar, usa o nome puro do mês.
async function encontrarPastaMes(pastaAno: string, nomeMes: string): Promise<string> {
  let existentes: string[] = [];
  try {
    existentes = await fs.readdir(pastaAno);
  } catch {
    // A pasta do ano ainda não existe; será criada na hora de salvar.
  }

  const alvo = semAcento(nomeMes);
  const encontrada = existentes.find((nome) => semAcento(nome).includes(alvo));

  return path.join(pastaAno, encontrada ?? nomeMes);
}

function diaMes(data: string): string {
  const [dia = '', mes = ''] = data.split('/');
  return `${dia}.${mes}`;
}

function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}