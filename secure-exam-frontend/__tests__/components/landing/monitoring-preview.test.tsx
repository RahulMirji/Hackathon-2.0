import { render, screen } from '@testing-library/react'
import { MonitoringPreview } from '@/components/landing/monitoring-preview'

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
  useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

jest.mock('@/hooks/use-parallax', () => ({
  useParallax: jest.fn(() => ({ ref: { current: null }, offset: 0 })),
}))

describe('MonitoringPreview', () => {
  it('renders the dashboard heading', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('AI Monitoring Dashboard')).toBeInTheDocument()
  })

  it('renders the dashboard description', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Real-time tracking and integrity verification')).toBeInTheDocument()
  })

  it('renders face detection status', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders attention score', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Attention Score')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
  })

  it('renders connection status', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Connection')).toBeInTheDocument()
    expect(screen.getByText('Stable')).toBeInTheDocument()
  })

  it('renders features section heading', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Live Monitoring Features')).toBeInTheDocument()
  })

  it('renders all monitoring features', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('AI Face Detection')).toBeInTheDocument()
    expect(screen.getByText('Attention Scoring System')).toBeInTheDocument()
    expect(screen.getByText('Real-Time Alerts')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<MonitoringPreview />)
    expect(screen.getByText('Continuous facial recognition to ensure test taker identity')).toBeInTheDocument()
    expect(screen.getByText('Real-time analysis of focus and engagement levels')).toBeInTheDocument()
    expect(screen.getByText('Immediate notifications for suspicious activity or anomalies')).toBeInTheDocument()
  })

  it('renders feature icons', () => {
    const { container } = render(<MonitoringPreview />)
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})
