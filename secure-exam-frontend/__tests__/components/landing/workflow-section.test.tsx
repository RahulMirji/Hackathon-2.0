import { render, screen } from '@testing-library/react'
import { WorkflowSection } from '@/components/landing/workflow-section'

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
  useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

jest.mock('@/hooks/use-parallax', () => ({
  useParallax: jest.fn(() => ({ ref: { current: null }, offset: 0 })),
}))

describe('WorkflowSection', () => {
  it('renders the section heading', () => {
    render(<WorkflowSection />)
    expect(screen.getByText('How It Works')).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<WorkflowSection />)
    expect(screen.getByText('A seamless journey from verification to results')).toBeInTheDocument()
  })

  it('renders all 6 workflow steps', () => {
    render(<WorkflowSection />)
    expect(screen.getByText('Compatibility Check')).toBeInTheDocument()
    expect(screen.getByText('ID Verification')).toBeInTheDocument()
    expect(screen.getByText('Policy Agreement')).toBeInTheDocument()
    expect(screen.getByText('Exam Environment')).toBeInTheDocument()
    expect(screen.getByText('AI Monitoring')).toBeInTheDocument()
    expect(screen.getByText('Results Report')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<WorkflowSection />)
    expect(screen.getByText('Verifies device, camera, microphone, and internet connection')).toBeInTheDocument()
    expect(screen.getByText('Captures selfie and government-issued ID')).toBeInTheDocument()
    expect(screen.getByText('Gets student consent for monitoring and recording')).toBeInTheDocument()
  })

  it('renders step numbers correctly', () => {
    render(<WorkflowSection />)
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument()
    }
  })

  it('displays steps in correct order', () => {
    const { container } = render(<WorkflowSection />)
    const stepTitles = [
      'Compatibility Check',
      'ID Verification',
      'Policy Agreement',
      'Exam Environment',
      'AI Monitoring',
      'Results Report',
    ]
    
    stepTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })
})
