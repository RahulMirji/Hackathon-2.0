import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ConsentPage from '@/app/exam/consent/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Consent Page', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders the page with correct title and step indicator', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Exam Terms & Consent')).toBeInTheDocument()
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
  })

  it('displays all three consent cards', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('AI Monitoring & Security')).toBeInTheDocument()
    expect(screen.getByText('Exam Policies & Rules')).toBeInTheDocument()
    expect(screen.getByText('Privacy & Your Rights')).toBeInTheDocument()
  })

  it('displays monitoring features', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Screen Monitoring')).toBeInTheDocument()
    expect(screen.getByText('Audio Recording')).toBeInTheDocument()
    expect(screen.getByText('Data Security')).toBeInTheDocument()
  })

  it('displays exam policies', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Prohibited Actions')).toBeInTheDocument()
    expect(screen.getByText('Required Environment')).toBeInTheDocument()
    expect(screen.getByText('Consequences')).toBeInTheDocument()
  })

  it('displays privacy information', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Data Protection')).toBeInTheDocument()
    expect(screen.getByText('Limited Access')).toBeInTheDocument()
    expect(screen.getByText('Your Rights')).toBeInTheDocument()
  })

  it('displays consent checkbox', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(screen.getByText('I acknowledge and consent to all exam terms')).toBeInTheDocument()
  })

  it('Continue button is disabled initially', () => {
    render(<ConsentPage />)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeDisabled()
  })

  it('Continue button is white when consent is not checked', () => {
    render(<ConsentPage />)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toHaveStyle({ backgroundColor: 'white' })
  })

  it('enables Continue button when consent is checked', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).not.toBeDisabled()
  })

  it('Continue button turns green when consent is checked', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toHaveStyle({ backgroundColor: '#1ba94c' })
  })

  it('Back button navigates to previous page', () => {
    render(<ConsentPage />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it('Continue button navigates to exam sections when clicked', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(mockPush).toHaveBeenCalledWith('/exam/sections')
  })

  it('displays detailed consent text', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText(/I have read and agree to the monitoring/i)).toBeInTheDocument()
    expect(screen.getByText(/I understand the consequences of violations/i)).toBeInTheDocument()
  })

  it('displays monitoring descriptions', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText(/Real-time face tracking during exam/i)).toBeInTheDocument()
    expect(screen.getByText(/Screen activity recording/i)).toBeInTheDocument()
    expect(screen.getByText(/Audio monitoring for integrity/i)).toBeInTheDocument()
  })

  it('displays policy warnings', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText(/No unauthorized materials/i)).toBeInTheDocument()
    expect(screen.getByText(/Well-lit room, clear desk/i)).toBeInTheDocument()
    expect(screen.getByText(/Violations may result in exam termination/i)).toBeInTheDocument()
  })

  it('displays privacy details', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText(/Encrypted, secure storage, deleted after 90 days/i)).toBeInTheDocument()
    expect(screen.getByText(/Only authorized proctors can access recordings/i)).toBeInTheDocument()
    expect(screen.getByText(/Request data access, corrections, or file complaints/i)).toBeInTheDocument()
  })

  it('checkbox can be toggled on and off', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    
    expect(checkbox.checked).toBe(false)
    
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
    
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(false)
  })
})
