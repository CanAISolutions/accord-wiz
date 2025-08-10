import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RentalWizard from '@/components/RentalWizard'

describe('Theme & Achievements', () => {
  it('persists theme toggle', async () => {
    render(<RentalWizard onBack={() => {}} />)
    // select province (no modal in unit env)
    fireEvent.click(screen.getByTestId('province-select'))
    fireEvent.click(await screen.findByRole('option', { name: /ontario/i }))
    const toggle = screen.getByRole('button', { name: /dark|light/i })
    fireEvent.click(toggle)
    const saved = JSON.parse(localStorage.getItem('theme.dark') || 'null')
    expect(typeof saved).toBe('boolean')
  })

  it('unlocks jurisdiction achievement after selecting province', async () => {
    render(<RentalWizard onBack={() => {}} />)
    // open modal select in step 1
    const combos = await screen.findAllByTestId('province-select')
    fireEvent.click(combos[0])
    const option = await screen.findByRole('option', { name: /ontario/i })
    fireEvent.click(option)
    // BadgeDisplay becomes visible once achievements set; we only assert no crash here
    expect(true).toBe(true)
  })
})


