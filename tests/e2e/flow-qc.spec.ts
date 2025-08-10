import { test, expect } from '@playwright/test'
import { goToWizard } from './_helpers'

test('Quebec TAL banner and disabled Generate', async ({ page }) => {
  await goToWizard(page)
  await page.getByRole('heading', { name: /jurisdiction/i }).waitFor()
  await page.getByTestId('province-select').click()
  await page.getByRole('option', { name: 'Quebec' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  // Fast-forward through steps with minimal inputs
  await page.getByLabel(/full name/i).first().fill('LL')
  await page.getByLabel(/phone number/i).first().fill('555-111')
  await page.getByLabel(/mailing address/i).fill('123 Any St')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByLabel(/full name/i).last().fill('TT')
  await page.getByLabel(/email address/i).last().fill('tt@example.com')
  await page.getByLabel(/emergency contact name/i).fill('EC')
  await page.getByLabel(/emergency contact phone/i).fill('555-2222')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByLabel(/property address/i).fill('Unit 1')
  for (const id of ['property-type','bedrooms','bathrooms','furnished','parking']) {
    await page.getByTestId(id).click(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByLabel(/monthly rent amount/i).fill('1800')
  await page.getByLabel(/lease start date/i).fill('2025-01-01')
  await page.getByLabel(/lease end date/i).fill('2025-12-31')
  await page.getByTestId('rent-due').click(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Next' }).click()
  // TAL banner visible and Generate disabled
  await expect(page.getByText(/TAL lease is mandatory/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /generate pdf/i })).toBeDisabled()
})


