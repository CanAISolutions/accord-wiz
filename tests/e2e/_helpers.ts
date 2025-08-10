import { Page } from '@playwright/test'

export async function goToWizard(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const cta = page.getByRole('button', { name: /create agreement|start creating|get started|create|start/i }).first();
  try {
    await cta.waitFor({ state: 'visible', timeout: 3000 });
    await cta.click();
  } catch {
    await page.goto('/#/wizard');
  }
  // Ensure wizard is visible
  await page.getByRole('heading', { name: /jurisdiction|rental terms|tenant information|landlord information/i }).waitFor({ state: 'visible' });
}


