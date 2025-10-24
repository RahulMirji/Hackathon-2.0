import { render, screen, fireEvent } from '@testing-library/react'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { Home, Info, Mail } from 'lucide-react'

const mockItems = [
  { name: 'Home', url: '#home', icon: Home },
  { name: 'About', url: '#about', icon: Info },
  { name: 'Contact', url: '#contact', icon: Mail },
]

describe('NavBar', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 0,
      width: 0,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))
  })

  it('renders all navigation items', () => {
    render(<NavBar items={mockItems} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('sets first item as active by default', () => {
    const { container } = render(<NavBar items={mockItems} />)
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('bg-muted')
  })

  it('changes active tab on click', () => {
    render(<NavBar items={mockItems} />)
    const aboutLink = screen.getByText('About')
    fireEvent.click(aboutLink)
    expect(aboutLink.closest('a')).toHaveClass('bg-muted')
  })

  it('renders with custom className', () => {
    const { container } = render(<NavBar items={mockItems} className="custom-class" />)
    const navContainer = container.firstChild
    expect(navContainer).toHaveClass('custom-class')
  })

  it('renders navigation links with correct hrefs', () => {
    render(<NavBar items={mockItems} />)
    const homeLink = screen.getByText('Home').closest('a')
    const aboutLink = screen.getByText('About').closest('a')
    const contactLink = screen.getByText('Contact').closest('a')
    
    expect(homeLink).toHaveAttribute('href', '#home')
    expect(aboutLink).toHaveAttribute('href', '#about')
    expect(contactLink).toHaveAttribute('href', '#contact')
  })

  it('handles window resize events', () => {
    render(<NavBar items={mockItems} />)
    
    // Simulate resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    fireEvent(window, new Event('resize'))
    
    // Component should still be rendered
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('applies fixed positioning styles', () => {
    const { container } = render(<NavBar items={mockItems} />)
    const navContainer = container.firstChild
    expect(navContainer).toHaveClass('fixed')
  })
})
