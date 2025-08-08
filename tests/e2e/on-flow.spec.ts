/** @vitest-environment node */
// Note: Playwright tests must be run via `npm run test:e2e`, not Vitest.
import { test, expect } from '@playwright/test'

test('Ontario flow hides security deposit and disables late fee', async ({ page }) => {
  await page.goto('/')
  // Launch wizard from home CTA
  const launch = page.getByRole('button', { name: /create agreement|start creating|get started/i }).first()
  await launch.waitFor({ state: 'visible' })
  await launch.click()
  // Jurisdiction
  const provinceCombo = page.getByTestId('province-select')
  await provinceCombo.click()
  await page.getByRole('option', { name: 'Ontario' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  // Landlord (minimal)
  await page.getByLabel('Full Name', { exact: false }).first().fill('LL')
  await page.getByLabel('Phone Number', { exact: false }).first().fill('555-111-2222')
  await page.getByLabel('Email Address', { exact: false }).first().fill('ll@example.com')
  await page.getByLabel('Mailing Address').fill('123 Any St')
  await page.getByRole('button', { name: 'Next' }).click()
  // Tenant
  await page.getByLabel('Full Name', { exact: false }).last().fill('TT')
  await page.getByLabel('Emergency Contact Name').fill('EC')
  await page.getByLabel('Emergency Contact Phone').fill('555-5555')
  await page.getByRole('button', { name: 'Next' }).click()
  // Property
  await page.getByLabel('Property Address').fill('Unit 1')
  await page.getByLabel('Property Type').click()
  await page.getByRole('button', { name: 'Next' }).click()
  // Terms
  await page.getByLabel('Monthly Rent Amount').fill('1800')
  await expect(page.getByLabel('Security Deposit')).toHaveCount(0)
  const lateFee = page.getByLabel('Late Fee Amount')
  await expect(lateFee).toBeDisabled()
  // Rent Deposit visible with note
  await expect(page.getByLabel('Rent Deposit (Last Month’s Rent)')).toBeVisible()
})

