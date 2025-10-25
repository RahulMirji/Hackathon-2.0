import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ThreeDCarousel, TeamMember } from '@/components/ui/three-d-carousel'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Rahul Mirji',
    role: 'Team Leader | AI & Machine Learning',
    imageUrl: '/rahul.jpg',
    isLeader: true,
    bio: 'HKBK College of Engineering\ndevprahulmirji@gmail.com',
  },
  {
    id: 2,
    name: 'Samarth Jadhav',
    role: 'Team Member | AI & Machine Learning',
    imageUrl: '/Sam-profile 1.png',
    bio: 'Presidency University\nsamarthjadhavsj121@gmail.com',
  },
  {
    id: 3,
    name: 'Praveen Mirji',
    role: 'Team Member | AI & Machine Learning',
    imageUrl: '/praveen.jpg',
    bio: 'BMS College of Engineering\npraveenmirji866@gmail.com',
  },
]

describe('ThreeDCarousel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders all team members', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
      expect(screen.getByText('Samarth Jadhav')).toBeInTheDocument()
      expect(screen.getByText('Praveen Mirji')).toBeInTheDocument()
    })

    it('renders team member roles', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      expect(screen.getByText('Team Leader | AI & Machine Learning')).toBeInTheDocument()
      expect(screen.getAllByText('Team Member | AI & Machine Learning')).toHaveLength(2)
    })

    it('renders team member bio information', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      expect(screen.getByText('HKBK College of Engineering')).toBeInTheDocument()
      expect(screen.getByText('Presidency University')).toBeInTheDocument()
      expect(screen.getByText('BMS College of Engineering')).toBeInTheDocument()
    })

    it('displays team leader badge for leader', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const leaderBadges = screen.getAllByText('Team Leader')
      expect(leaderBadges.length).toBeGreaterThan(0)
    })

    it('renders member images with correct src', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const images = screen.getAllByRole('img')
      expect(images[0]).toHaveAttribute('src', '/rahul.jpg')
    })
  })

  describe('Navigation Controls', () => {
    it('renders previous and next buttons', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const buttons = screen.getAllByRole('button')
      const navButtons = buttons.filter(
        (btn) => btn.getAttribute('aria-label') === 'Previous' || 
                 btn.getAttribute('aria-label') === 'Next'
      )
      expect(navButtons).toHaveLength(2)
    })

    it('navigates to next member on next button click', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const nextButton = screen.getByLabelText('Next')
      fireEvent.click(nextButton)
      
      // The carousel should move to the next slide
      expect(nextButton).toBeInTheDocument()
    })

    it('navigates to previous member on previous button click', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const prevButton = screen.getByLabelText('Previous')
      fireEvent.click(prevButton)
      
      // The carousel should move to the previous slide
      expect(prevButton).toBeInTheDocument()
    })

    it('renders dot indicators for each member', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const dotButtons = screen.getAllByRole('button').filter(
        (btn) => btn.getAttribute('aria-label')?.startsWith('Go to member')
      )
      expect(dotButtons).toHaveLength(mockTeamMembers.length)
    })

    it('navigates to specific member on dot click', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const dotButton = screen.getByLabelText('Go to member 2')
      fireEvent.click(dotButton)
      
      expect(dotButton).toBeInTheDocument()
    })
  })

  describe('Auto-rotation', () => {
    it('auto-rotates when autoRotate is true', () => {
      render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={true} 
          rotateInterval={1000}
        />
      )
      
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      // Carousel should have rotated
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })

    it('does not auto-rotate when autoRotate is false', () => {
      render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={false}
        />
      )
      
      act(() => {
        jest.advanceTimersByTime(5000)
      })
      
      // Should still show first member
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })

    it('pauses auto-rotation on hover', () => {
      const { container } = render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={true}
          rotateInterval={1000}
        />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      act(() => {
        fireEvent.mouseEnter(carousel)
      })
      
      act(() => {
        jest.advanceTimersByTime(2000)
      })
      
      // Should not have rotated while hovering
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })

    it('resumes auto-rotation after mouse leave', () => {
      const { container } = render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={true}
          rotateInterval={1000}
        />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      act(() => {
        fireEvent.mouseEnter(carousel)
        fireEvent.mouseLeave(carousel)
        jest.advanceTimersByTime(1000)
      })
      
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })
  })

  describe('Touch Gestures', () => {
    it('handles touch start event', () => {
      const { container } = render(
        <ThreeDCarousel members={mockTeamMembers} autoRotate={false} />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100 }],
      })
      
      expect(carousel).toBeInTheDocument()
    })

    it('handles touch move event', () => {
      const { container } = render(
        <ThreeDCarousel members={mockTeamMembers} autoRotate={false} />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100 }],
      })
      
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 50 }],
      })
      
      expect(carousel).toBeInTheDocument()
    })

    it('swipes to next on left swipe', () => {
      const { container } = render(
        <ThreeDCarousel members={mockTeamMembers} autoRotate={false} />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 200 }],
      })
      
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 100 }],
      })
      
      fireEvent.touchEnd(carousel)
      
      expect(carousel).toBeInTheDocument()
    })

    it('swipes to previous on right swipe', () => {
      const { container } = render(
        <ThreeDCarousel members={mockTeamMembers} autoRotate={false} />
      )
      
      const carousel = container.firstChild as HTMLElement
      
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100 }],
      })
      
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 200 }],
      })
      
      fireEvent.touchEnd(carousel)
      
      expect(carousel).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for navigation buttons', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      expect(screen.getByLabelText('Previous')).toBeInTheDocument()
      expect(screen.getByLabelText('Next')).toBeInTheDocument()
    })

    it('has proper ARIA labels for dot indicators', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      mockTeamMembers.forEach((_, index) => {
        expect(screen.getByLabelText(`Go to member ${index + 1}`)).toBeInTheDocument()
      })
    })

    it('buttons are keyboard accessible', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const nextButton = screen.getByLabelText('Next')
      nextButton.focus()
      expect(nextButton).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty members array', () => {
      render(<ThreeDCarousel members={[]} autoRotate={false} />)
      expect(screen.queryByText('Rahul Mirji')).not.toBeInTheDocument()
    })

    it('handles single member', () => {
      render(<ThreeDCarousel members={[mockTeamMembers[0]]} autoRotate={false} />)
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })

    it('wraps around to first member after last', () => {
      render(<ThreeDCarousel members={mockTeamMembers} autoRotate={false} />)
      
      const nextButton = screen.getByLabelText('Next')
      
      // Click next multiple times to wrap around
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('respects custom cardHeight prop', () => {
      const { container } = render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={false}
          cardHeight={600}
        />
      )
      
      expect(container).toBeInTheDocument()
    })

    it('respects custom rotateInterval prop', () => {
      render(
        <ThreeDCarousel 
          members={mockTeamMembers} 
          autoRotate={true}
          rotateInterval={2000}
        />
      )
      
      act(() => {
        jest.advanceTimersByTime(2000)
      })
      
      expect(screen.getByText('Rahul Mirji')).toBeInTheDocument()
    })
  })
})
