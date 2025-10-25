import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ResultsPage from '@/app/exam/results/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Results Page', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders the page with thank you message', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('Thank You!')).toBeInTheDocument()
    expect(screen.getByText(/Your exam has been successfully submitted/i)).toBeInTheDocument()
  })

  it('displays all three result cards', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
    expect(screen.getByText('Integrity')).toBeInTheDocument()
  })

  it('displays score information', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('Your Score')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('Passing Score')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('displays PASSED status', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('PASSED')).toBeInTheDocument()
    expect(screen.getByText('Successfully completed')).toBeInTheDocument()
  })

  it('displays question breakdown', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Question 2')).toBeInTheDocument()
    expect(screen.getByText('Question 3')).toBeInTheDocument()
  })

  it('displays question scores', () => {
    render(<ResultsPage />)
    
    const scores = screen.getAllByText('100%')
    expect(scores.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('displays integrity checks', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Connection')).toBeInTheDocument()
    expect(screen.getByText('Attention')).toBeInTheDocument()
    expect(screen.getByText('Device')).toBeInTheDocument()
  })

  it('displays integrity status', () => {
    render(<ResultsPage />)
    
    const passedItems = screen.getAllByText(/Passed/i)
    expect(passedItems.length).toBeGreaterThanOrEqual(3)
    expect(screen.getByText(/2 Warnings/i)).toBeInTheDocument()
  })

  it('displays Download Report button', () => {
    render(<ResultsPage />)
    
    const downloadButton = screen.getByRole('button', { name: /download report/i })
    expect(downloadButton).toBeInTheDocument()
  })

  it('displays Return Home button', () => {
    render(<ResultsPage />)
    
    const homeButton = screen.getByRole('button', { name: /return home/i })
    expect(homeButton).toBeInTheDocument()
  })

  it('Return Home button navigates to home page', () => {
    render(<ResultsPage />)
    
    const homeButton = screen.getByRole('button', { name: /return home/i })
    fireEvent.click(homeButton)

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('displays issues badge', () => {
    render(<ResultsPage />)
    
    expect(screen.getByText('5 Issues')).toBeInTheDocument()
  })

  it('Download Report button triggers download', () => {
    // Mock document.createElement and related methods
    const mockElement = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {},
    }
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockElement as any)
    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation()
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation()

    render(<ResultsPage />)
    
    const downloadButton = screen.getByRole('button', { name: /download report/i })
    fireEvent.click(downloadButton)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockElement.click).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('uses HackerRank green color for passed status', () => {
    render(<ResultsPage />)
    
    const passedCard = screen.getByText('PASSED').closest('div')
    expect(passedCard).toHaveClass('bg-[#1ba94c]')
  })

  it('displays correct color coding for questions', () => {
    render(<ResultsPage />)
    
    // Question 1 and 2 should have green background
    const question1 = screen.getByText('Question 1').closest('div')
    expect(question1).toHaveClass('bg-[#d4f4dd]')
    
    // Question 3 should have yellow/orange background
    const question3 = screen.getByText('Question 3').closest('div')
    expect(question3).toHaveClass('bg-[#fff4e5]')
  })

  it('displays correct color coding for integrity checks', () => {
    render(<ResultsPage />)
    
    // Passed items should have green background
    const faceDetection = screen.getByText('Face Detection').closest('div')
    expect(faceDetection).toHaveClass('bg-[#d4f4dd]')
    
    // Warning item should have yellow/orange background
    const attention = screen.getByText('Attention').closest('div')
    expect(attention).toHaveClass('bg-[#fff4e5]')
  })
})
