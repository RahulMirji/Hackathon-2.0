import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import IDVerificationPage from '@/app/exam/id-verification/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock getUserMedia
const mockGetUserMedia = jest.fn()
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
})

describe('ID Verification Page', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders the page with correct title and step indicator', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
  })

  it('displays face verification and ID upload cards', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Face Verification')).toBeInTheDocument()
    expect(screen.getByText('Government ID Upload')).toBeInTheDocument()
  })

  it('shows camera preview placeholder initially', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Camera Preview')).toBeInTheDocument()
    expect(screen.getByText('Position your face in the frame')).toBeInTheDocument()
  })

  it('shows Start Camera button initially', () => {
    render(<IDVerificationPage />)
    
    const startButton = screen.getByRole('button', { name: /start camera/i })
    expect(startButton).toBeInTheDocument()
  })

  it('starts camera when Start Camera button is clicked', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [{ stop: jest.fn() }]),
    }
    mockGetUserMedia.mockResolvedValue(mockStream)

    render(<IDVerificationPage />)
    
    const startButton = screen.getByRole('button', { name: /start camera/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
    })
  })

  it('shows Capture Photo button when camera is active', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [{ stop: jest.fn() }]),
    }
    mockGetUserMedia.mockResolvedValue(mockStream)

    render(<IDVerificationPage />)
    
    const startButton = screen.getByRole('button', { name: /start camera/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /capture photo/i })).toBeInTheDocument()
    })
  })

  it('handles file upload', () => {
    render(<IDVerificationPage />)
    
    const file = new File(['dummy content'], 'test-id.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText(/upload government id/i) as HTMLInputElement
    
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('ID Uploaded Successfully')).toBeInTheDocument()
    expect(screen.getByText('test-id.jpg')).toBeInTheDocument()
  })

  it('Continue button is white initially', () => {
    render(<IDVerificationPage />)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toHaveStyle({ backgroundColor: 'white' })
  })

  it('Back button navigates to previous page', () => {
    render(<IDVerificationPage />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it('Continue button navigates to consent page', () => {
    render(<IDVerificationPage />)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    fireEvent.click(continueButton)

    expect(mockPush).toHaveBeenCalledWith('/exam/consent')
  })

  it('displays verification requirements', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Verification Requirements')).toBeInTheDocument()
    expect(screen.getByText(/clear, well-lit face photo/i)).toBeInTheDocument()
  })

  it('handles camera permission denied', async () => {
    mockGetUserMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))

    render(<IDVerificationPage />)
    
    const startButton = screen.getByRole('button', { name: /start camera/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText(/camera permission denied/i)).toBeInTheDocument()
    })
  })

  it('handles camera not found', async () => {
    mockGetUserMedia.mockRejectedValue(new DOMException('No camera', 'NotFoundError'))

    render(<IDVerificationPage />)
    
    const startButton = screen.getByRole('button', { name: /start camera/i })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText(/no camera found/i)).toBeInTheDocument()
    })
  })
})
