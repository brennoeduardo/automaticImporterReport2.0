import { config } from './config/config.js';
import { obterPeriodoImportacao } from './utils/datas.js';
import { garantirPasta, resolverCaminhoSaida  } from './utils/arquivos.js';
import { abrirProtheus, abrirImportador } from './browser/protheus.js';
import { aplicarFiltros } from './importador/filtros.js';
import { exportarPlanilha } from './importador/exportacao.js';
import { lerAcom075 } from './excel/lerAcom075.js';
import { criarPlanilha } from './excel/formatar.js';

async function run() {
  const periodo = obterPeriodoImportacao();
  console.log(`Período da importação: ${periodo.dataInicial} a ${periodo.dataFinal}`);

  const { browser, page } = await abrirProtheus();
  try {
    await abrirImportador(page);
    await aplicarFiltros(page, periodo);
    await exportarPlanilha(page);
  } finally {
    await browser.close();
  }

  const { dados } = await lerAcom075(config.caminhoAcom075);

  const caminhoSaida = await resolverCaminhoSaida(config.pastaImportador, periodo);
  await garantirPasta(caminhoSaida);
  await criarPlanilha(dados, caminhoSaida);

  console.log(`Concluído: ${dados.length} registros em ${config.pastaImportador}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
