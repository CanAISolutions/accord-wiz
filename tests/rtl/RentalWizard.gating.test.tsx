import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RentalWizard from '@/components/RentalWizard'

describe('RentalWizard gating', () => {
  it('province-first modal: Continue disabled until Jurisdiction selected; Next available after', async () => {
    render(<RentalWizard onBack={() => {}} />)
    const dialog = screen.getByRole('dialog', { name: /select your province or territory/i })
    const continueBtn = within(dialog).getByRole('button', { name: /continue/i })
    expect(continueBtn).toBeDisabled()
    await userEvent.click(within(dialog).getByRole('combobox', { name: /province or territory/i }))
    await userEvent.click(await screen.findByRole('option', { name: 'Ontario' }))
    expect(continueBtn).not.toBeDisabled()
    // Close modal (Escape) to avoid pointer-events issues in tests
    await userEvent.keyboard('{Escape}')
    const next = await screen.findByRole('button', { name: /next/i })
    expect(next).not.toBeDisabled()
  })

  it('requires mandatory clauses before Next on clauses step', async () => {
    render(<RentalWizard onBack={() => {}} />)
    const user = userEvent.setup()
    // Step 1 modal: select ON
    const dialog = screen.getByRole('dialog', { name: /select your province or territory/i })
    await user.click(within(dialog).getByRole('combobox', { name: /province or territory/i }))
    // Select Ontario from the listbox options
    await user.click(await screen.findByRole('option', { name: 'Ontario' }))
    await user.keyboard('{Escape}')
    // wait until Next is enabled
    await screen.findByRole('button', { name: /next/i })
    await new Promise(r => setTimeout(r, 0))
    const next1 = screen.getByRole('button', { name: /next/i })
    // ensure enabled before clicking
    await (async () => {
      for (let i = 0; i < 5 && next1.hasAttribute('disabled'); i++) {
        await new Promise(r => setTimeout(r, 10))
      }
    })()
    await user.click(next1)
    await screen.findByRole('heading', { name: /landlord information/i })
    // Step 2 landlord minimal
    await user.type(screen.getByLabelText(/full name/i), 'LL')
    await user.type(screen.getByLabelText(/phone number/i), '555')
    await user.type(screen.getByLabelText(/email address/i), 'a@b.co')
    await user.type(screen.getByLabelText(/mailing address/i), 'addr')
    // proceed to next step
    const next2 = screen.getByRole('button', { name: /next/i })
    await user.click(next2)
    await screen.findByRole('heading', { name: /tenant information/i })
    // Step 3 tenant minimal
    const inputs = screen.getAllByLabelText(/full name/i)
    await user.type(inputs[inputs.length - 1], 'TT')
    const tenantPhones = screen.getAllByLabelText(/phone number/i)
    await user.type(tenantPhones[tenantPhones.length - 1], '555-0000')
    const tenantEmails = screen.getAllByLabelText(/email address/i)
    await user.type(tenantEmails[tenantEmails.length - 1], 't@t.co')
    await user.type(screen.getByLabelText(/emergency contact name/i), 'EC')
    await user.type(screen.getByLabelText(/emergency contact phone/i), '555')
    const next3 = screen.getByRole('button', { name: /next/i })
    await user.click(next3)
    // Step 4 property minimal (fill all required selects/inputs)
    await screen.findByRole('heading', { name: /property details/i })
    await user.type(screen.getByLabelText(/property address/i), 'Unit 1')
    await user.click(screen.getByTestId('property-type'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByTestId('bedrooms'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByTestId('bathrooms'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByTestId('furnished'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByTestId('parking'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByRole('button', { name: /next/i }))
    // Step 5 terms minimal (fill required fields)
    await screen.findByRole('heading', { name: /rental terms/i })
    await user.type(screen.getByLabelText(/monthly rent amount/i), '1800')
    await user.type(screen.getByLabelText(/lease start date/i), '2025-01-01')
    await user.type(screen.getByLabelText(/lease end date/i), '2025-12-31')
    await user.click(screen.getByTestId('rent-due'))
    await user.keyboard('{ArrowDown}{Enter}')
    await user.click(screen.getByRole('button', { name: /next/i }))
    // Step 6 clauses: without mandatory clause text, Next is disabled
    await screen.findByRole('heading', { name: /legal clauses/i })
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})

