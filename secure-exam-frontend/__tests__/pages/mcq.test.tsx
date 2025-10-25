import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import MCQ1Page from '../../app/exam/mcq1/page'
import MCQ2Page from '../../app/exam/mcq2/page'
import MCQ3Page from '../../app/exam/mcq3/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('MCQ Pages', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('MCQ1Page', () => {
    it('renders MCQ1 page with correct header', () => {
      render(<MCQ1Page />)
      
      expect(screen.getByText('MCQ 1 - General & Technical')).toBeInTheDocument()
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    })

    it('displays first question correctly', () => {
      render(<MCQ1Page />)
      
      expect(screen.getByText('What is the time complexity of binary search?')).toBeInTheDocument()
      expect(screen.getByText('O(n)')).toBeInTheDocument()
      expect(screen.getByText('O(log n)')).toBeInTheDocument()
      expect(screen.getByText('O(n²)')).toBeInTheDocument()
      expect(screen.getByText('O(1)')).toBeInTheDocument()
    })

    it('allows selecting an answer', () => {
      render(<MCQ1Page />)
      
      const option = screen.getByLabelText('O(log n)')
      fireEvent.click(option)
      
      expect(option).toBeChecked()
    })

    it('shows next button for first questions', () => {
      render(<MCQ1Page />)
      
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('navigates to next question when next is clicked', () => {
      render(<MCQ1Page />)
      
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument()
    })

    it('shows submit button on last question', () => {
      render(<MCQ1Page />)
      
      // Navigate to last question
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      
      expect(screen.getByText('Submit MCQ 1')).toBeInTheDocument()
    })

    it('submits and navigates to submission page', () => {
      render(<MCQ1Page />)
      
      // Navigate to last question
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      
      const submitButton = screen.getByText('Submit MCQ 1')
      fireEvent.click(submitButton)
      
      expect(mockPush).toHaveBeenCalledWith('/exam/submission')
    })

    it('shows timer with 40 minutes', () => {
      render(<MCQ1Page />)
      
      expect(screen.getByText('40:00')).toBeInTheDocument()
    })

    it('shows progress bar', () => {
      render(<MCQ1Page />)
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('MCQ2Page', () => {
    it('renders MCQ2 page with correct header', () => {
      render(<MCQ2Page />)
      
      expect(screen.getByText('MCQ 2 - Coding Questions')).toBeInTheDocument()
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    })

    it('displays first question correctly', () => {
      render(<MCQ2Page />)
      
      expect(screen.getByText('Which of the following is not a programming paradigm?')).toBeInTheDocument()
      expect(screen.getByText('Object-Oriented')).toBeInTheDocument()
      expect(screen.getByText('Functional')).toBeInTheDocument()
      expect(screen.getByText('Procedural')).toBeInTheDocument()
      expect(screen.getByText('Algorithmic')).toBeInTheDocument()
    })

    it('shows timer with 45 minutes', () => {
      render(<MCQ2Page />)
      
      expect(screen.getByText('45:00')).toBeInTheDocument()
    })

    it('submits and navigates to submission page', () => {
      render(<MCQ2Page />)
      
      // Navigate to last question
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      
      const submitButton = screen.getByText('Submit MCQ 2')
      fireEvent.click(submitButton)
      
      expect(mockPush).toHaveBeenCalledWith('/exam/submission')
    })
  })

  describe('MCQ3Page', () => {
    it('renders MCQ3 page with correct header', () => {
      render(<MCQ3Page />)
      
      expect(screen.getByText('MCQ 3 - English Language')).toBeInTheDocument()
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    })

    it('displays first question correctly', () => {
      render(<MCQ3Page />)
      
      expect(screen.getByText('Choose the correct sentence:')).toBeInTheDocument()
      expect(screen.getByText('He don\'t like coffee')).toBeInTheDocument()
      expect(screen.getByText('He doesn\'t like coffee')).toBeInTheDocument()
      expect(screen.getByText('He not like coffee')).toBeInTheDocument()
      expect(screen.getByText('He no like coffee')).toBeInTheDocument()
    })

    it('shows timer with 15 minutes', () => {
      render(<MCQ3Page />)
      
      expect(screen.getByText('15:00')).toBeInTheDocument()
    })

    it('submits and navigates to submission page', () => {
      render(<MCQ3Page />)
      
      // Navigate to last question
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      
      const submitButton = screen.getByText('Submit MCQ 3')
      fireEvent.click(submitButton)
      
      expect(mockPush).toHaveBeenCalledWith('/exam/submission')
    })
  })

  describe('Common MCQ Functionality', () => {
    it('handles previous button correctly', () => {
      render(<MCQ1Page />)
      
      // Go to second question
      const nextButton = screen.getByText('Next')
      fireEvent.click(nextButton)
      
      // Go back to first question
      const previousButton = screen.getByText('Previous')
      fireEvent.click(previousButton)
      
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    })

    it('disables previous button on first question', () => {
      render(<MCQ1Page />)
      
      const previousButton = screen.getByText('Previous')
      expect(previousButton).toBeDisabled()
    })

    it('handles timer countdown', async () => {
      render(<MCQ1Page />)
      
      // Wait for timer to tick
      await waitFor(() => {
        expect(screen.getByText(/39:5[0-9]/)).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })
})