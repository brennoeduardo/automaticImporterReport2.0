import type { Page } from 'playwright';

export async function exportarPlanilha(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Outras Ações' }).click();
  await page.getByText('Imprimir Browse').click();

  await page.getByRole('button', { name: 'Planilha' }).click();
  await page.locator('#COMP6054').getByRole('combobox').selectOption('2');
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Imprimir' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Abrir' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Sim' }).click();
  await page.waitForTimeout(5000);
}
