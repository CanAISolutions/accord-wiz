import { test, expect } from '@playwright/test'
import { goToWizard } from './_helpers'

test('BC deposit caps and hints', async ({ page }) => {
  await goToWizard(page)
  await page.getByRole('heading', { name: /jurisdiction/i }).waitFor()
  await page.getByTestId('province-select').click()
  await page.getByRole('option', { name: 'British Columbia' }).click()
  await page.getByRole('button', { name: 'Next' }).click()

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

  await page.getByLabel(/monthly rent amount/i).fill('2000')
  await page.getByLabel(/security deposit/i).fill('1200')
  // Expect an error since max is 0.5 months ($1000)
  await expect(page.getByText(/exceeds allowed maximum/i)).toBeVisible()
})


