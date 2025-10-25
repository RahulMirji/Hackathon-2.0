import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SubmissionPage from '../../app/exam/submission/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('SubmissionPage', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders submission page with header', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('Review & Submit Exam')).toBeInTheDocument()
    expect(screen.getByText('Please review your answers before final submission')).toBeInTheDocument()
  })

  it('displays exam summary', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('Total Questions')).toBeInTheDocument()
    expect(screen.getByText('Answered')).toBeInTheDocument()
    expect(screen.getByText('Unanswered')).toBeInTheDocument()
  })

  it('shows exam integrity summary', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('Exam Integrity Summary')).toBeInTheDocument()
    expect(screen.getByText('Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Connection Stable')).toBeInTheDocument()
    expect(screen.getByText('2 Attention Warnings')).toBeInTheDocument()
  })

  it('displays confirmation checkbox', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText(/I confirm that I have completed this exam honestly/)).toBeInTheDocument()
  })

  it('shows submit button as disabled initially', () => {
    render(<SubmissionPage />)
    
    const submitButton = screen.getByText('Submit Exam')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when confirmation is checked', () => {
    render(<SubmissionPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const submitButton = screen.getByText('Submit Exam')
    
    fireEvent.click(checkbox)
    
    expect(submitButton).not.toBeDisabled()
  })

  it('shows back to exam button', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('Back to Exam')).toBeInTheDocument()
  })

  it('navigates back when back button is clicked', () => {
    render(<SubmissionPage />)
    
    const backButton = screen.getByText('Back to Exam')
    fireEvent.click(backButton)
    
    expect(mockBack).toHaveBeenCalled()
  })

  it('handles submission process', async () => {
    render(<SubmissionPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const submitButton = screen.getByText('Submit Exam')
    
    fireEvent.click(checkbox)
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Exam Submitted')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows submission confirmation screen', async () => {
    render(<SubmissionPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const submitButton = screen.getByText('Submit Exam')
    
    fireEvent.click(checkbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Your exam has been successfully submitted and is being processed.')).toBeInTheDocument()
      expect(screen.getByText('Submission Status')).toBeInTheDocument()
      expect(screen.getByText('Confirmed')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('redirects to results page after submission', async () => {
    render(<SubmissionPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const submitButton = screen.getByText('Submit Exam')
    
    fireEvent.click(checkbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/exam/results')
    }, { timeout: 5000 })
  })

  it('displays processing status', async () => {
    render(<SubmissionPage />)
    
    const checkbox = screen.getByRole('checkbox')
    const submitButton = screen.getByText('Submit Exam')
    
    fireEvent.click(checkbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Processing')).toBeInTheDocument()
      expect(screen.getByText('Redirecting to Results')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows proper integrity status icons', () => {
    render(<SubmissionPage />)
    
    // Should show check icons for passed items
    const checkIcons = screen.getAllByTestId(/check/i)
    expect(checkIcons.length).toBeGreaterThan(0)
    
    // Should show warning icon for attention warnings
    expect(screen.getByText('2 Attention Warnings')).toBeInTheDocument()
  })

  it('displays exam statistics correctly', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('3')).toBeInTheDocument() // Total questions
    expect(screen.getByText('0')).toBeInTheDocument() // Unanswered
  })

  it('shows proper warning message', () => {
    render(<SubmissionPage />)
    
    expect(screen.getByText('You will be redirected to your results page shortly. Please do not close this window.')).toBeInTheDocument()
  })
})