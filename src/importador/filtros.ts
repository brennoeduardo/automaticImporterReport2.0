import type { Page } from 'playwright';
import type { Periodo } from '../utils/datas.js';

export async function aplicarFiltros(page: Page, periodo: Periodo): Promise<void> {
  await page.getByRole('button', { name: 'Filtrar' }).click();
  await page.getByText('Pendente - Envio para o portal').click();
  await page.waitForTimeout(1000);

  await page.getByText('Dt Emissao').click();
  await page.waitForTimeout(1000);

  await page.getByText("Tp.Xml Igual a '%ZZ6_TPXML0%'").click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Aplicar filtros selecionados' }).click();

  await page.locator('#COMP9003').getByRole('textbox').click();
  await page.locator('#COMP9003').getByRole('textbox').fill(periodo.dataInicial);

  await page.locator('#COMP9005').getByRole('textbox').click();
  await page.locator('#COMP9005').getByRole('textbox').fill(periodo.dataFinal);

  await page.getByRole('button', { name: 'Avançar' }).click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  
  await page.waitForTimeout(2000);
}
