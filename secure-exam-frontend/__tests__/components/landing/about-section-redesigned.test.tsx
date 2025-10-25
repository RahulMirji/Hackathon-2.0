import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AboutSectionRedesigned } from '@/components/landing/about-section-redesigned'
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

// Mock the 3D Carousel component
jest.mock('@/components/ui/three-d-carousel', () => ({
  ThreeDCarousel: ({ members }: { members: any[] }) => (
    <div data-testid="three-d-carousel">
      {members.map((member) => (
        <div key={member.id} data-testid={`team-member-${member.id}`}>
          <span>{member.name}</span>
          <span>{member.role}</span>
          {member.isLeader && <span data-testid="leader-badge">Team Leader</span>}
        </div>
      ))}
    </div>
  ),
}))

describe('AboutSectionRedesigned', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Hero Section', () => {
    it('renders the main heading', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
      expect(screen.getByText('Online Education')).toBeInTheDocument()
    })

    it('renders the hero description', () => {
      render(<AboutSectionRedesigned />)
      expect(
        screen.getByText(/Building trust in remote examinations/i)
      ).toBeInTheDocument()
    })
  })

  describe('Stats Section', () => {
    it('renders all statistics', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getAllByText('99.9%')[0]).toBeInTheDocument()
      expect(screen.getAllByText('50K+')[0]).toBeInTheDocument()
      expect(screen.getAllByText('24/7')[0]).toBeInTheDocument()
      expect(screen.getAllByText('100%')[0]).toBeInTheDocument()
    })

    it('renders stat labels', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Uptime Reliability')).toBeInTheDocument()
      expect(screen.getByText('Exams Monitored')).toBeInTheDocument()
      expect(screen.getByText('Support Available')).toBeInTheDocument()
      expect(screen.getByText('Data Encrypted')).toBeInTheDocument()
    })
  })

  describe('Features Section', () => {
    it('renders all feature titles', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getAllByText('Real-Time Monitoring').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Screen Protection').length).toBeGreaterThan(0)
      expect(screen.getAllByText('AI Analysis').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Secure Infrastructure').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Instant Alerts').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Detailed Reports').length).toBeGreaterThan(0)
    })

    it('renders feature descriptions', () => {
      render(<AboutSectionRedesigned />)
      expect(
        screen.getAllByText(/Advanced webcam surveillance/i).length
      ).toBeGreaterThan(0)
      expect(
        screen.getAllByText(/Comprehensive screen recording/i).length
      ).toBeGreaterThan(0)
    })
  })

  describe('Core Values Section', () => {
    it('renders all core values', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Security First')).toBeInTheDocument()
      expect(screen.getByText('Transparency')).toBeInTheDocument()
      expect(screen.getByText('Innovation')).toBeInTheDocument()
    })
  })

  describe('Team Section', () => {
    it('renders team section heading', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Meet the Minds Behind the Platform')).toBeInTheDocument()
    })

    it('renders team section description with leadership mention', () => {
      render(<AboutSectionRedesigned />)
      expect(
        screen.getByText(/Led by our dedicated team leader/i)
      ).toBeInTheDocument()
    })

    it('renders all team members', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
      expect(screen.getByText('Samarth Jadhav')).toBeInTheDocument()
      expect(screen.getByText('Praveen Mirji')).toBeInTheDocument()
      expect(screen.getByText('Imtiyaz Akiwat')).toBeInTheDocument()
      expect(screen.getByText('Abid N G')).toBeInTheDocument()
    })

    it('displays team leader designation for Rahul', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Team Leader | AI & Machine Learning')).toBeInTheDocument()
    })

    it('displays team member designation for others', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getAllByText('Team Member | AI & Machine Learning').length).toBe(2)
      expect(screen.getByText('Team Member | Computer Science')).toBeInTheDocument()
      expect(screen.getByText('Team Member | AI & Data Science')).toBeInTheDocument()
    })

    it('shows leader badge for Rahul', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByTestId('leader-badge')).toBeInTheDocument()
    })

    it('renders team stats', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Team Members')).toBeInTheDocument()
      expect(screen.getByText('15+')).toBeInTheDocument()
      expect(screen.getByText('Years Combined')).toBeInTheDocument()
    })
  })

  describe('CTA Section', () => {
    it('renders CTA heading', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Ready to Transform Your Online Exams?')).toBeInTheDocument()
    })

    it('renders both CTA buttons', () => {
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Get Started Today')).toBeInTheDocument()
      expect(screen.getByText('Schedule a Demo')).toBeInTheDocument()
    })

    it('Get Started Today button links to compatibility check', () => {
      render(<AboutSectionRedesigned />)
      const getStartedLink = screen.getByText('Get Started Today').closest('a')
      expect(getStartedLink).toHaveAttribute('href', '/exam/compatibility-check')
    })

    it('Schedule a Demo button navigates on click', () => {
      render(<AboutSectionRedesigned />)
      const scheduleDemoButton = screen.getByText('Schedule a Demo')
      fireEvent.click(scheduleDemoButton)
      expect(mockPush).toHaveBeenCalledWith('/exam/compatibility-check')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<AboutSectionRedesigned />)
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('buttons are keyboard accessible', () => {
      render(<AboutSectionRedesigned />)
      const scheduleDemoButton = screen.getByText('Schedule a Demo')
      scheduleDemoButton.focus()
      expect(scheduleDemoButton).toHaveFocus()
    })
  })

  describe('Responsive Design', () => {
    it('renders without crashing on mobile viewport', () => {
      global.innerWidth = 375
      global.innerHeight = 667
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
    })

    it('renders without crashing on desktop viewport', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080
      render(<AboutSectionRedesigned />)
      expect(screen.getByText('Securing the Future of')).toBeInTheDocument()
    })
  })
})
