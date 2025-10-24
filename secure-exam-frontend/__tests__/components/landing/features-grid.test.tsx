import { render, screen } from '@testing-library/react'
import { FeaturesGrid } from '@/components/landing/features-grid'

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
  useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

jest.mock('@/hooks/use-parallax', () => ({
  useParallax: jest.fn(() => ({ ref: { current: null }, offset: 0 })),
}))

describe('FeaturesGrid', () => {
  it('renders the section heading', () => {
    render(<FeaturesGrid />)
    expect(screen.getByText('Why Our AI Exam Browser Stands Apart')).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<FeaturesGrid />)
    expect(screen.getByText('Cutting-edge technology meets educational integrity')).toBeInTheDocument()
  })

  it('renders all 6 feature cards', () => {
    render(<FeaturesGrid />)
    expect(screen.getByText('AI Proctoring')).toBeInTheDocument()
    expect(screen.getByText('Smart Integrity Engine')).toBeInTheDocument()
    expect(screen.getByText('ID Verification')).toBeInTheDocument()
    expect(screen.getByText('Offline Recovery')).toBeInTheDocument()
    expect(screen.getByText('Real-time Analytics')).toBeInTheDocument()
    expect(screen.getByText('Secure Sandbox')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<FeaturesGrid />)
    expect(screen.getByText('Real-time face and attention tracking with advanced computer vision')).toBeInTheDocument()
    expect(screen.getByText('Detects suspicious movements and behaviors automatically')).toBeInTheDocument()
    expect(screen.getByText('Dual-layer face and government ID authentication')).toBeInTheDocument()
  })

  it('has correct section id for navigation', () => {
    const { container } = render(<FeaturesGrid />)
    const section = container.querySelector('#features')
    expect(section).toBeInTheDocument()
  })

  it('renders feature icons', () => {
    const { container } = render(<FeaturesGrid />)
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })
})
