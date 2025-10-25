import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ExamSectionsPage from '../../app/exam/sections/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the monitoring components
jest.mock('../../components/exam/monitoring-overlay', () => {
  return function MockMonitoringOverlay() {
    return <div data-testid="monitoring-overlay">Monitoring Overlay</div>
  }
})

jest.mock('../../components/exam/violation-tracker', () => {
  return function MockViolationTracker() {
    return <div data-testid="violation-tracker">Violation Tracker</div>
  }
})

describe('ExamSectionsPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders exam sections page with header', async () => {
    render(<ExamSectionsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Computer Science - Final Assessment')).toBeInTheDocument()
    })
    expect(screen.getByText('Select a section to begin your exam')).toBeInTheDocument()
  })

  it('displays all exam sections', async () => {
    render(<ExamSectionsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('MCQ 1')).toBeInTheDocument()
    })
    expect(screen.getByText('MCQ 2')).toBeInTheDocument()
    expect(screen.getByText('MCQ 3')).toBeInTheDocument()
    expect(screen.getByText('Coding')).toBeInTheDocument()
  })

  it('shows section details correctly', () => {
    render(<ExamSectionsPage />)
    
    // MCQ 1 details
    expect(screen.getByText('General & Technical')).toBeInTheDocument()
    expect(screen.getByText('40 min')).toBeInTheDocument()
    
    // MCQ 2 details
    expect(screen.getByText('Coding Questions')).toBeInTheDocument()
    expect(screen.getByText('45 min')).toBeInTheDocument()
    
    // MCQ 3 details
    expect(screen.getByText('English Language')).toBeInTheDocument()
    expect(screen.getByText('15 min')).toBeInTheDocument()
    
    // Coding details
    expect(screen.getByText('Programming Tasks')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
  })

  it('displays question counts correctly', () => {
    render(<ExamSectionsPage />)
    
    const questionCounts = screen.getAllByText(/Questions/)
    expect(questionCounts).toHaveLength(4) // One for each section
  })

  it('navigates to MCQ1 when Start MCQ 1 is clicked', () => {
    render(<ExamSectionsPage />)
    
    const startButton = screen.getByText('Start MCQ 1')
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/mcq1')
  })

  it('navigates to MCQ2 when Start MCQ 2 is clicked', () => {
    render(<ExamSectionsPage />)
    
    const startButton = screen.getByText('Start MCQ 2')
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/mcq2')
  })

  it('navigates to MCQ3 when Start MCQ 3 is clicked', () => {
    render(<ExamSectionsPage />)
    
    const startButton = screen.getByText('Start MCQ 3')
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/mcq3')
  })

  it('navigates to coding when Start Coding is clicked', () => {
    render(<ExamSectionsPage />)
    
    const startButton = screen.getByText('Start Coding')
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/coding')
  })

  it('displays monitoring overlay', () => {
    render(<ExamSectionsPage />)
    
    expect(screen.getByTestId('monitoring-overlay')).toBeInTheDocument()
  })

  it('displays violation tracker', () => {
    render(<ExamSectionsPage />)
    
    expect(screen.getByTestId('violation-tracker')).toBeInTheDocument()
  })

  it('shows section descriptions', () => {
    render(<ExamSectionsPage />)
    
    expect(screen.getByText('General knowledge and technical concepts')).toBeInTheDocument()
    expect(screen.getByText('Programming and coding challenges')).toBeInTheDocument()
    expect(screen.getByText('Grammar, vocabulary, and comprehension')).toBeInTheDocument()
    expect(screen.getByText('Write and submit code solutions')).toBeInTheDocument()
  })

  it('displays proper section icons', () => {
    render(<ExamSectionsPage />)
    
    // Check that cards have proper styling classes for different sections
    const mcq1Card = screen.getByText('MCQ 1').closest('.exam-card')
    const mcq2Card = screen.getByText('MCQ 2').closest('.exam-card')
    const mcq3Card = screen.getByText('MCQ 3').closest('.exam-card')
    const codingCard = screen.getByText('Coding').closest('.exam-card')
    
    expect(mcq1Card).toBeInTheDocument()
    expect(mcq2Card).toBeInTheDocument()
    expect(mcq3Card).toBeInTheDocument()
    expect(codingCard).toBeInTheDocument()
  })

  it('shows instruction text', () => {
    render(<ExamSectionsPage />)
    
    expect(screen.getByText('Choose Your Exam Section')).toBeInTheDocument()
    expect(screen.getByText('Complete all sections to finish your assessment. You can take them in any order.')).toBeInTheDocument()
  })
})