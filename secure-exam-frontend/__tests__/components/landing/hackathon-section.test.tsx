import { render, screen, act } from '@testing-library/react'
import { HackathonSection } from '@/components/landing/hackathon-section'

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
  useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

describe('HackathonSection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('renders the section with hackathon info', () => {
    render(<HackathonSection />)
    expect(screen.getByText('Built for AI Verse 2.0')).toBeInTheDocument()
  })

  it('renders the first sentence words', () => {
    render(<HackathonSection />)
    expect(screen.getByText('Secure')).toBeInTheDocument()
    expect(screen.getByText('online')).toBeInTheDocument()
    expect(screen.getByText('exams')).toBeInTheDocument()
    expect(screen.getByText('with')).toBeInTheDocument()
    expect(screen.getByText('AI.')).toBeInTheDocument()
  })

  it('renders the second sentence words', () => {
    render(<HackathonSection />)
    expect(screen.getByText('Real-time')).toBeInTheDocument()
    expect(screen.getByText('proctoring')).toBeInTheDocument()
    expect(screen.getByText('and')).toBeInTheDocument()
    expect(screen.getByText('integrity')).toBeInTheDocument()
    expect(screen.getByText('verification.')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HackathonSection />)
    expect(
      screen.getByText(/An innovative AI-powered examination system designed to revolutionize online testing/i)
    ).toBeInTheDocument()
  })

  it('renders the CTA button', () => {
    render(<HackathonSection />)
    expect(screen.getByText('Try Demo Exam')).toBeInTheDocument()
  })

  it('has correct section id for navigation', () => {
    const { container } = render(<HackathonSection />)
    const section = container.querySelector('#hackathon')
    expect(section).toBeInTheDocument()
  })

  it('animates word highlighting over time', () => {
    render(<HackathonSection />)
    
    // Fast-forward time to trigger word animation
    act(() => {
      jest.advanceTimersByTime(800)
    })
    
    // Check that component is still rendered after animation
    expect(screen.getByText('Real-time')).toBeInTheDocument()
  })
})
