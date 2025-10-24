import { render, screen, fireEvent } from '@testing-library/react'
import { ContactSection } from '@/components/landing/contact-section'

// Mock custom hooks
jest.mock('@/hooks/use-in-view', () => ({
  useInView: jest.fn(() => ({ ref: { current: null }, inView: true })),
}))

jest.mock('@/hooks/use-parallax', () => ({
  useParallax: jest.fn(() => ({ ref: { current: null }, offset: 0 })),
}))

describe('ContactSection', () => {
  it('renders the section heading', () => {
    render(<ContactSection />)
    expect(screen.getByText('Get Started with AI Exam Browser')).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<ContactSection />)
    expect(screen.getByText('Experience the future of secure online examinations. Try our demo today.')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<ContactSection />)
    expect(screen.getByText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('renders form field placeholders', () => {
    render(<ContactSection />)
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tell us about your requirements...')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<ContactSection />)
    expect(screen.getByText('Send Message')).toBeInTheDocument()
  })

  it('updates form fields on input', () => {
    render(<ContactSection />)
    
    const nameInput = screen.getByPlaceholderText('John Doe') as HTMLInputElement
    const emailInput = screen.getByPlaceholderText('john@example.com') as HTMLInputElement
    const messageInput = screen.getByPlaceholderText('Tell us about your requirements...') as HTMLTextAreaElement
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    
    expect(nameInput.value).toBe('Test User')
    expect(emailInput.value).toBe('test@example.com')
    expect(messageInput.value).toBe('Test message')
  })

  it('clears form on submit', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    render(<ContactSection />)
    
    const nameInput = screen.getByPlaceholderText('John Doe') as HTMLInputElement
    const emailInput = screen.getByPlaceholderText('john@example.com') as HTMLInputElement
    const messageInput = screen.getByPlaceholderText('Tell us about your requirements...') as HTMLTextAreaElement
    const submitButton = screen.getByText('Send Message')
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(submitButton)
    
    expect(nameInput.value).toBe('')
    expect(emailInput.value).toBe('')
    expect(messageInput.value).toBe('')
    
    consoleSpy.mockRestore()
  })

  it('renders contact email', () => {
    render(<ContactSection />)
    expect(screen.getByText('team@aiverse.dev')).toBeInTheDocument()
  })

  it('renders response time message', () => {
    render(<ContactSection />)
    expect(screen.getByText('We typically respond within 24 hours')).toBeInTheDocument()
  })

  it('has correct section id for navigation', () => {
    const { container } = render(<ContactSection />)
    const section = container.querySelector('#contact')
    expect(section).toBeInTheDocument()
  })
})
