export interface Periodo {
  dataInicial: string;
  dataFinal: string;
}

function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export function obterPeriodoImportacao(): Periodo {
  const hoje = new Date();

  // Na segunda buscamos de sexta a domingo; nos outros dias, só o dia anterior.
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
