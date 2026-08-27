export interface Periodo {
  dataInicial: string;
  dataFinal: string;
}

function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export function obterPeriodoImportacao(inicial?: string, final?: string): Periodo {
  // se passar as duas datas manualmente, usa elas (modo retroativo)
  if (inicial && final) {

    console.log("--- RODANDO PERIODO RETROATIVO ---", `${inicial} A ${final}`)

    return { dataInicial: inicial, dataFinal: final };
  }

  const hoje = new Date();
  const diasParaInicio = hoje.getDay() === 1 ? 3 : 1;

  const dataInicial = new Date(hoje);
  dataInicial.setDate(hoje.getDate() - diasParaInicio);

  const dataFinal = new Date(hoje);
  dataFinal.setDate(hoje.getDate() - 1);

  return {
    dataInicial: formatarData(dataInicial),
    dataFinal: formatarData(dataFinal),
  };
}
