import { chromium, type Browser, type Page } from 'playwright';
import { config } from '../config/config.js';

export async function abrirProtheus(): Promise<{ browser: Browser; page: Page }> {
  const browser = await chromium.launch({ headless: config.headless });

  try {

    const page = await browser.newPage();

    await page.goto(config.urlProtheus);
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Ok' }).click();

    return { browser, page };

  } catch (error) {
    await browser.close()
    throw error;
  }

}

export async function abrirImportador(page: Page): Promise<void> {
  const busca = page.getByRole('textbox', { name: 'Pesquisar' });

  await busca.click();
  await busca.press('CapsLock');
  await page.waitForTimeout(2000);
  await busca.fill(config.termoBusca);

  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.waitForTimeout(6000);
}