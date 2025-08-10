import { test, expect } from '@playwright/test'
import { goToWizard } from './_helpers'

test.describe('Payments gating behavior', () => {
  test('Stripe disabled: Generate PDF enabled and works', async ({ page }) => {
    await goToWizard(page)
    await page.getByRole('heading', { name: /jurisdiction/i }).waitFor()

    // Province
    await page.getByTestId('province-select').click()
    await page.getByRole('option', { name: 'British Columbia' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Landlord
    await page.getByLabel(/full name/i).first().fill('LL')
    await page.getByLabel(/phone number/i).first().fill('555-111-2222')
    await page.getByLabel(/email address/i).first().fill('ll@example.com')
    await page.getByLabel(/mailing address/i).fill('123 Any St')
    await page.getByRole('button', { name: 'Next' }).click()

    // Tenant
    await page.getByLabel(/full name/i).last().fill('TT')
    await page.getByLabel(/email address/i).last().fill('tt@example.com')
    await page.getByLabel(/emergency contact name/i).fill('EC')
    await page.getByLabel(/emergency contact phone/i).fill('555-2222')
    await page.getByRole('button', { name: 'Next' }).click()

    // Property
    await page.getByLabel(/property address/i).fill('Unit 1')
    for (const id of ['property-type','bedrooms','bathrooms','furnished','parking']) {
      await page.getByTestId(id).click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
    }
    await page.getByRole('button', { name: 'Next' }).click()

    // Terms
    await page.getByLabel(/monthly rent amount/i).fill('1800')
    // Use hidden date inputs (wired to Calendar) for speed
    await page.getByLabel(/lease start date/i).fill('2025-01-01')
    await page.getByLabel(/lease end date/i).fill('2025-12-31')
    await page.getByTestId('rent-due').click()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Next' }).click()

    // Clauses
    const selects = ['pets allowed','smoking policy','subletting policy','maintenance responsibility','early termination']
    for (const label of selects) {
      await page.getByLabel(new RegExp(label, 'i')).click()
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
    }
    // Mandatory clauses are prefixed automatically; proceed
    await page.getByRole('button', { name: 'Next' }).click()

    // Finalize (Stripe disabled): generate enabled and works
    const generateBtn = page.getByRole('button', { name: /generate pdf/i })
    await expect(generateBtn).toBeEnabled()
    await generateBtn.click()
    // Expect a download to be initiated
    const [ download ] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
      // Click again to ensure no navigation
      generateBtn.click(),
    ])
    expect(download).not.toBeNull()
  })
})


