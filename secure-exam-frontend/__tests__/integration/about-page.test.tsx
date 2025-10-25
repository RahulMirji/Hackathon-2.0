import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AboutPage from '@/app/about/page'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock components
jest.mock('@/components/landing/navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

jest.mock('@/components/landing/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

jest.mock('@/components/ui/three-d-carousel', () => ({
  ThreeDCarousel: ({ members }: { members: any[] }) => (
    <div data-testid="three-d-carousel">
      {members.map((member) => (
        <div key={member.id} data-testid={`team-member-${member.id}`}>
          <span>{member.name}</span>
          <span>{member.role}</span>
        </div>
      ))}
    </div>
  ),
}))

describe('About Page Integration Tests', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Page Structure', () => {
    it('renders the complete page structure', () => {
      render(<AboutPage />)
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('renders all major sections', () => {
      render(<AboutPage />)
      
      // Hero section
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
      
      // Stats section
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      
      // Mission section
      expect(screen.getByText(/Solving the Challenge of/i)).toBeInTheDocument()
      
      // Features section
      expect(screen.getByText('Comprehensive Exam Security')).toBeInTheDocument()
      
      // Values section
      expect(screen.getByText('What Drives Us Forward')).toBeInTheDocument()
      
      // Team section
      expect(screen.getByText('Meet the Minds Behind the Platform')).toBeInTheDocument()
      
      // CTA section
      expect(screen.getByText('Ready to Transform Your Online Exams?')).toBeInTheDocument()
    })
  })

  describe('User Journey', () => {
    it('allows user to navigate from About to Compatibility Check via Get Started', () => {
      render(<AboutPage />)
      
      const getStartedLink = screen.getByText('Get Started Today').closest('a')
      expect(getStartedLink).toHaveAttribute('href', '/exam/compatibility-check')
    })

    it('allows user to navigate from About to Compatibility Check via Schedule Demo', () => {
      render(<AboutPage />)
      
      const scheduleDemoButton = screen.getByText('Schedule a Demo')
      fireEvent.click(scheduleDemoButton)
      
      expect(mockPush).toHaveBeenCalledWith('/exam/compatibility-check')
    })

    it('displays team information in correct hierarchy', () => {
      render(<AboutPage />)
      
      // Team leader should be displayed
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
      expect(screen.getByText('Team Leader | AI & Machine Learning')).toBeInTheDocument()
      
      // Team members should be displayed
      expect(screen.getByText('Samarth Jadhav')).toBeInTheDocument()
      expect(screen.getByText('Praveen Mirji')).toBeInTheDocument()
    })
  })

  describe('Content Verification', () => {
    it('displays correct statistics', () => {
      render(<AboutPage />)
      
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('Uptime Reliability')).toBeInTheDocument()
      
      expect(screen.getByText('50K+')).toBeInTheDocument()
      expect(screen.getByText('Exams Monitored')).toBeInTheDocument()
      
      expect(screen.getByText('24/7')).toBeInTheDocument()
      expect(screen.getByText('Support Available')).toBeInTheDocument()
      
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText('Data Encrypted')).toBeInTheDocument()
    })

    it('displays all platform features', () => {
      render(<AboutPage />)
      
      const features = [
        'Real-Time Monitoring',
        'Screen Protection',
        'AI Analysis',
        'Secure Infrastructure',
        'Instant Alerts',
        'Detailed Reports',
      ]
      
      features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument()
      })
    })

    it('displays all core values', () => {
      render(<AboutPage />)
      
      expect(screen.getByText('Security First')).toBeInTheDocument()
      expect(screen.getByText('Transparency')).toBeInTheDocument()
      expect(screen.getByText('Innovation')).toBeInTheDocument()
    })

    it('displays all team members with correct roles', () => {
      render(<AboutPage />)
      
      const teamMembers = [
        { name: 'Rahul Mirji', role: 'Team Leader | AI & Machine Learning' },
        { name: 'Samarth Jadhav', role: 'Team Member | AI & Machine Learning' },
        { name: 'Praveen Mirji', role: 'Team Member | AI & Machine Learning' },
        { name: 'Imtiyaz Akiwat', role: 'Team Member | Computer Science' },
        { name: 'Abid N G', role: 'Team Member | AI & Data Science' },
      ]
      
      teamMembers.forEach((member) => {
        expect(screen.getByText(member.name)).toBeInTheDocument()
        expect(screen.getByText(member.role)).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Behavior', () => {
    it('renders correctly on mobile viewport', () => {
      global.innerWidth = 375
      global.innerHeight = 667
      
      render(<AboutPage />)
      
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('renders correctly on tablet viewport', () => {
      global.innerWidth = 768
      global.innerHeight = 1024
      
      render(<AboutPage />)
      
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('renders correctly on desktop viewport', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080
      
      render(<AboutPage />)
      
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic HTML structure', () => {
      const { container } = render(<AboutPage />)
      
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('nav')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
    })

    it('all interactive elements are keyboard accessible', () => {
      render(<AboutPage />)
      
      const scheduleDemoButton = screen.getByText('Schedule a Demo')
      scheduleDemoButton.focus()
      expect(scheduleDemoButton).toHaveFocus()
    })

    it('has proper heading hierarchy', () => {
      render(<AboutPage />)
      
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now()
      render(<AboutPage />)
      const endTime = performance.now()
      
      // Should render in less than 1 second
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })

  describe('Error Handling', () => {
    it('handles navigation errors gracefully', () => {
      const mockPushWithError = jest.fn(() => {
        throw new Error('Navigation error')
      })
      
      ;(useRouter as jest.Mock).mockReturnValue({
        push: mockPushWithError,
      })
      
      render(<AboutPage />)
      
      const scheduleDemoButton = screen.getByText('Schedule a Demo')
      
      // Should not crash the app
      expect(() => fireEvent.click(scheduleDemoButton)).not.toThrow()
    })
  })
})
