import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/landing/footer'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

describe('Footer', () => {
  it('renders the footer component', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('renders the logo section', () => {
    render(<Footer />)
    expect(screen.getByText('AI Exam Browser')).toBeInTheDocument()
  })

  it('renders all footer sections', () => {
    render(<Footer />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Platform')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Legal')).toBeInTheDocument()
  })

  it('renders Product section links', () => {
    render(<Footer />)
    const featuresLinks = screen.getAllByText('Features')
    expect(featuresLinks.length).toBeGreaterThan(0)
    expect(screen.getByText('How It Works')).toBeInTheDocument()
    expect(screen.getByText('AI Proctoring')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
  })

  it('renders Platform section links', () => {
    render(<Footer />)
    expect(screen.getByText('Exam Browser')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Integration')).toBeInTheDocument()
  })

  it('renders Resources section links', () => {
    render(<Footer />)
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    expect(screen.getByText('Hackathon')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('renders Company section links', () => {
    render(<Footer />)
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    const privacyLinks = screen.getAllByText('Privacy Policy')
    expect(privacyLinks.length).toBeGreaterThan(0)
    const termsLinks = screen.getAllByText('Terms of Service')
    expect(termsLinks.length).toBeGreaterThan(0)
  })

  it('renders Legal section links', () => {
    render(<Footer />)
    expect(screen.getByText('Data Processing')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
  })

  it('renders system status indicator', () => {
    render(<Footer />)
    expect(screen.getByText('All systems operational')).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2025 AI Verse Team – Built for AI Verse 2.0 Hackathon/i)).toBeInTheDocument()
  })
})
