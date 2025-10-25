import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import CodingExamPage from '../../app/exam/coding/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the monitoring components
jest.mock('@/components/exam/monitoring-overlay', () => {
  return function MockMonitoringOverlay() {
    return <div data-testid="monitoring-overlay">Monitoring Overlay</div>
  }
})

jest.mock('@/components/exam/violation-tracker-compact', () => {
  return function MockViolationTrackerCompact() {
    return <div data-testid="violation-tracker-compact">Violation Tracker Compact</div>
  }
})

jest.mock('@/components/exam/exam-timer', () => {
  return function MockExamTimer({ totalMinutes }: { totalMinutes: number }) {
    return <div data-testid="exam-timer">{totalMinutes} minutes</div>
  }
})

jest.mock('@/components/exam/code-editor', () => {
  return function MockCodeEditor({ value, onChange, language, placeholder }: any) {
    return (
      <textarea
        data-testid="code-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-language={language}
      />
    )
  }
})

describe('CodingExamPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders coding exam page with header', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Coding Section')).toBeInTheDocument()
    expect(screen.getByText('Programming Tasks')).toBeInTheDocument()
  })

  it('displays first coding question', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
    expect(screen.getByText(/Given an array of integers nums and an integer target/)).toBeInTheDocument()
  })

  it('shows question constraints', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Constraints:')).toBeInTheDocument()
    expect(screen.getByText('2 <= nums.length <= 10^4')).toBeInTheDocument()
  })

  it('displays examples', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Example 1')).toBeInTheDocument()
    expect(screen.getByText('nums = [2,7,11,15], target = 9')).toBeInTheDocument()
    expect(screen.getByText('[0,1]')).toBeInTheDocument()
  })

  it('shows code editor', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByTestId('code-editor')).toBeInTheDocument()
  })

  it('allows language selection', () => {
    render(<CodingExamPage />)
    
    const languageSelect = screen.getByDisplayValue('Python')
    expect(languageSelect).toBeInTheDocument()
    
    fireEvent.change(languageSelect, { target: { value: 'java' } })
    expect(languageSelect).toHaveValue('java')
  })

  it('handles code input', () => {
    render(<CodingExamPage />)
    
    const codeEditor = screen.getByTestId('code-editor')
    fireEvent.change(codeEditor, { target: { value: 'def solution():' } })
    
    expect(codeEditor).toHaveValue('def solution():')
  })

  it('shows run code button', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Run Code')).toBeInTheDocument()
  })

  it('shows save code button', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Save Code')).toBeInTheDocument()
  })

  it('handles run code functionality', () => {
    render(<CodingExamPage />)
    
    const runButton = screen.getByText('Run Code')
    fireEvent.click(runButton)
    
    expect(screen.getByText('Output:')).toBeInTheDocument()
    expect(screen.getByText(/Test Case 1: Passed/)).toBeInTheDocument()
  })

  it('handles save code functionality', () => {
    // Mock alert
    window.alert = jest.fn()
    
    render(<CodingExamPage />)
    
    const saveButton = screen.getByText('Save Code')
    fireEvent.click(saveButton)
    
    expect(window.alert).toHaveBeenCalledWith('Code saved successfully!')
  })

  it('shows next question button', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Next Question')).toBeInTheDocument()
  })

  it('navigates to next question', () => {
    render(<CodingExamPage />)
    
    const nextButton = screen.getByText('Next Question')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('Reverse String')).toBeInTheDocument()
  })

  it('shows submit button on last question', () => {
    render(<CodingExamPage />)
    
    // Navigate to last question
    const nextButton = screen.getByText('Next Question')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('submits and navigates to submission page', () => {
    render(<CodingExamPage />)
    
    // Navigate to last question
    const nextButton = screen.getByText('Next Question')
    fireEvent.click(nextButton)
    
    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/submission')
  })

  it('shows back to sections button', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Back to Sections')).toBeInTheDocument()
  })

  it('navigates back to sections', () => {
    render(<CodingExamPage />)
    
    const backButton = screen.getByText('Back to Sections')
    fireEvent.click(backButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/sections')
  })

  it('displays exam timer', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByTestId('exam-timer')).toBeInTheDocument()
    expect(screen.getByText('30 minutes')).toBeInTheDocument()
  })

  it('displays monitoring components', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByTestId('monitoring-overlay')).toBeInTheDocument()
    expect(screen.getByTestId('violation-tracker-compact')).toBeInTheDocument()
  })

  it('shows instructions dialog trigger', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Instructions')).toBeInTheDocument()
  })

  it('displays question badge', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Coding Challenge')).toBeInTheDocument()
  })

  it('shows question counter in editor', () => {
    render(<CodingExamPage />)
    
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })

  it('handles second question correctly', () => {
    render(<CodingExamPage />)
    
    // Navigate to second question
    const nextButton = screen.getByText('Next Question')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('Reverse String')).toBeInTheDocument()
    expect(screen.getByText(/Write a function that reverses a string/)).toBeInTheDocument()
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })
})