import { render, screen, fireEvent } from '@testing-library/react'
import { HeroSection } from '@/components/landing/hero-section'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
    useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

jest.mock('@/hooks/use-parallax', () => ({
    useParallax: jest.fn(() => ({ ref: { current: null }, offset: 0 })),
}))

describe('HeroSection', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    })

    it('renders the hero section with main heading', () => {
        render(<HeroSection />)
        expect(screen.getByText(/Your AI Assistant for/i)).toBeInTheDocument()
        expect(screen.getByText(/Secure Exams/i)).toBeInTheDocument()
    })

    it('renders the description text', () => {
        render(<HeroSection />)
        expect(
            screen.getByText(/Experience next-generation proctoring with real-time AI monitoring/i)
        ).toBeInTheDocument()
    })

    it('renders CTA buttons', () => {
        render(<HeroSection />)
        expect(screen.getByText('Try Demo Exam')).toBeInTheDocument()
        expect(screen.getByText('Watch Overview')).toBeInTheDocument()
    })

    it('navigates to exam compatibility check when Try Demo Exam is clicked', () => {
        render(<HeroSection />)
        const demoButton = screen.getByText('Try Demo Exam')
        fireEvent.click(demoButton)
        expect(mockPush).toHaveBeenCalledWith('/exam/compatibility-check')
    })

    it('renders the mockup with status indicators', () => {
        render(<HeroSection />)
        expect(screen.getByText('AI Exam Browser')).toBeInTheDocument()
        expect(screen.getByText('Face Detection')).toBeInTheDocument()
        expect(screen.getByText('Active')).toBeInTheDocument()
        expect(screen.getByText('Attention Score')).toBeInTheDocument()
        expect(screen.getByText('94%')).toBeInTheDocument()
    })

    it('renders exam progress indicator', () => {
        render(<HeroSection />)
        expect(screen.getByText('Exam Progress')).toBeInTheDocument()
        expect(screen.getByText('65%')).toBeInTheDocument()
    })

    it('has correct section id for navigation', () => {
        const { container } = render(<HeroSection />)
        const section = container.querySelector('#home')
        expect(section).toBeInTheDocument()
    })
})
