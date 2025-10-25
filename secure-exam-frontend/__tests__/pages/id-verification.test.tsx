import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import IDVerificationPage from '../../app/exam/id-verification/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock getUserMedia
const mockGetUserMedia = jest.fn()
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
  },
})

// Mock HTMLVideoElement
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
})

Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', {
  writable: true,
  value: 640,
})

Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', {
  writable: true,
  value: 480,
})

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: jest.fn().mockReturnValue({
    drawImage: jest.fn(),
  }),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  writable: true,
  value: jest.fn().mockReturnValue('data:image/jpeg;base64,mockImageData'),
})

describe('IDVerificationPage', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders ID verification page with header', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Identity Verification')).toBeInTheDocument()
    expect(screen.getByText('Secure identity verification for exam access')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
  })

  it('displays face verification section', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Face Verification')).toBeInTheDocument()
    expect(screen.getByText('Take a clear photo of your face (optional)')).toBeInTheDocument()
  })

  it('displays government ID upload section', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Government ID Upload')).toBeInTheDocument()
    expect(screen.getByText('Upload your government-issued ID (optional)')).toBeInTheDocument()
  })

  it('shows start camera button initially', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Start Camera')).toBeInTheDocument()
  })

  it('handles camera start functionality', async () => {
    const mockStream = {
      getTracks: jest.fn().mockReturnValue([
        { stop: jest.fn() }
      ])
    }
    mockGetUserMedia.mockResolvedValue(mockStream)

    render(<IDVerificationPage />)
    
    const startCameraButton = screen.getByText('Start Camera')
    fireEvent.click(startCameraButton)

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: "user",
          width: { ideal: 480, max: 640 },
          height: { ideal: 360, max: 480 },
          frameRate: { ideal: 15, max: 30 }
        },
      })
    })
  })

  it('shows capture photo button when camera is active', async () => {
    const mockStream = {
      getTracks: jest.fn().mockReturnValue([
        { stop: jest.fn() }
      ])
    }
    mockGetUserMedia.mockResolvedValue(mockStream)

    render(<IDVerificationPage />)
    
    const startCameraButton = screen.getByText('Start Camera')
    fireEvent.click(startCameraButton)

    await waitFor(() => {
      expect(screen.getByText('Capture Photo')).toBeInTheDocument()
    })
  })

  it('handles file upload for ID', () => {
    render(<IDVerificationPage />)
    
    const fileInput = screen.getByLabelText(/upload government id/i)
    const file = new File(['test'], 'test-id.jpg', { type: 'image/jpeg' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('Uploaded')).toBeInTheDocument()
  })

  it('shows skip verification button', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Skip Verification')).toBeInTheDocument()
  })

  it('shows continue to consent button', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Continue to Consent')).toBeInTheDocument()
  })

  it('navigates to consent page when continue is clicked', () => {
    render(<IDVerificationPage />)
    
    const continueButton = screen.getByText('Continue to Consent')
    fireEvent.click(continueButton)
    
    expect(mockPush).toHaveBeenCalledWith('/exam/consent')
  })

  it('navigates back when back button is clicked', () => {
    render(<IDVerificationPage />)
    
    const backButton = screen.getByText('Back to Compatibility Check')
    fireEvent.click(backButton)
    
    expect(mockBack).toHaveBeenCalled()
  })

  it('handles camera timeout error', async () => {
    mockGetUserMedia.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 6000))
    )

    render(<IDVerificationPage />)
    
    const startCameraButton = screen.getByText('Start Camera')
    fireEvent.click(startCameraButton)

    await waitFor(() => {
      expect(screen.getByText(/camera is taking too long/i)).toBeInTheDocument()
    }, { timeout: 6000 })
  })

  it('handles camera permission denied', async () => {
    const error = new DOMException('Permission denied', 'NotAllowedError')
    mockGetUserMedia.mockRejectedValue(error)

    render(<IDVerificationPage />)
    
    const startCameraButton = screen.getByText('Start Camera')
    fireEvent.click(startCameraButton)

    await waitFor(() => {
      expect(screen.getByText(/camera permission denied/i)).toBeInTheDocument()
    })
  })

  it('displays verification requirements', () => {
    render(<IDVerificationPage />)
    
    expect(screen.getByText('Verification Requirements')).toBeInTheDocument()
    expect(screen.getByText(/clear, well-lit face photo/i)).toBeInTheDocument()
  })
})