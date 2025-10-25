import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ConsentPage from '../../app/exam/consent/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('ConsentPage', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders consent page with header', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Exam Terms & Consent')).toBeInTheDocument()
    expect(screen.getByText('Review exam policies and provide your consent')).toBeInTheDocument()
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
  })

  it('displays AI monitoring section', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('AI Monitoring & Security')).toBeInTheDocument()
    expect(screen.getByText('Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Screen Monitoring')).toBeInTheDocument()
    expect(screen.getByText('Audio Recording')).toBeInTheDocument()
    expect(screen.getByText('Data Security')).toBeInTheDocument()
  })

  it('displays exam policies section', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Exam Policies & Rules')).toBeInTheDocument()
    expect(screen.getByText('Prohibited Actions')).toBeInTheDocument()
    expect(screen.getByText('Required Environment')).toBeInTheDocument()
    expect(screen.getByText('Consequences')).toBeInTheDocument()
  })

  it('displays privacy section', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Privacy & Your Rights')).toBeInTheDocument()
    expect(screen.getByText('Data Protection')).toBeInTheDocument()
    expect(screen.getByText('Limited Access')).toBeInTheDocument()
    expect(screen.getByText('Your Rights')).toBeInTheDocument()
  })

  it('shows final consent checkbox', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('I acknowledge and consent to all exam terms')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shows continue button as disabled initially', () => {
    render(<ConsentPage />)
    
    const continueButton = screen.getByText('Continue to Exam Sections')
    expect(continueButton).toBeDisabled()
  })

  it('enables continue button when consent is checked', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const continueButton = screen.getByText('Continue to Exam Sections')
    
    fireEvent.click(checkbox)
    
    expect(continueButton).not.toBeDisabled()
  })

  it('navigates to exam sections when continue is clicked', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const continueButton = screen.getByText('Continue to Exam Sections')
    
    fireEvent.click(checkbox)
    fireEvent.click(continueButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/sections')
  })

  it('navigates back when back button is clicked', () => {
    render(<ConsentPage />)
    
    const backButton = screen.getByText('Back to ID Verification')
    fireEvent.click(backButton)
    
    expect(mockBack).toHaveBeenCalled()
  })

  it('shows proper status message when not consented', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Please accept the terms to continue')).toBeInTheDocument()
  })

  it('shows proper status message when consented', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(screen.getByText('✓ Terms accepted')).toBeInTheDocument()
  })

  it('displays monitoring details correctly', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Real-time face tracking during exam')).toBeInTheDocument()
    expect(screen.getByText('Screen activity recording')).toBeInTheDocument()
    expect(screen.getByText('Audio monitoring for integrity')).toBeInTheDocument()
  })

  it('displays policy details correctly', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('No unauthorized materials, communication, or leaving camera view')).toBeInTheDocument()
    expect(screen.getByText('Well-lit room, clear desk, stable internet, working camera/mic')).toBeInTheDocument()
    expect(screen.getByText('Violations may result in exam termination and disciplinary action')).toBeInTheDocument()
  })

  it('displays privacy details correctly', () => {
    render(<ConsentPage />)
    
    expect(screen.getByText('Encrypted, secure storage, deleted after 90 days')).toBeInTheDocument()
    expect(screen.getByText('Only authorized proctors can access recordings')).toBeInTheDocument()
    expect(screen.getByText('Request data access, corrections, or file complaints')).toBeInTheDocument()
  })

  it('has proper checkbox styling', () => {
    render(<ConsentPage />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('border-2', 'border-gray-300')
  })
})