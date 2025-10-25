import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import CompatibilityCheckPage from '../../app/exam/compatibility-check/page'

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

// Mock storage API
Object.defineProperty(navigator, 'storage', {
  writable: true,
  value: {
    estimate: jest.fn().mockResolvedValue({
      quota: 1024 * 1024 * 1024 * 10, // 10GB
      usage: 1024 * 1024 * 100, // 100MB
    }),
  },
})

// Mock getBattery
Object.defineProperty(navigator, 'getBattery', {
  writable: true,
  value: jest.fn().mockResolvedValue({
    level: 0.8,
    charging: true,
  }),
})

describe('CompatibilityCheckPage', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
  })

  it('renders compatibility check page with header', async () => {
    render(<CompatibilityCheckPage />)
    
    await waitFor(() => {
      expect(screen.getByText('System Compatibility Check')).toBeInTheDocument()
    })
    expect(screen.getByText('Verifying your device meets exam requirements')).toBeInTheDocument()
  })

  it('displays system requirements section', () => {
    render(<CompatibilityCheckPage />)
    
    expect(screen.getByText('System Requirements')).toBeInTheDocument()
    expect(screen.getByText('Browser Compatibility')).toBeInTheDocument()
    expect(screen.getByText('Screen Resolution')).toBeInTheDocument()
    expect(screen.getByText('System Performance')).toBeInTheDocument()
  })

  it('shows network quality analysis section', () => {
    render(<CompatibilityCheckPage />)
    
    expect(screen.getByText('Network Quality Analysis')).toBeInTheDocument()
    expect(screen.getByText('Download Speed')).toBeInTheDocument()
    expect(screen.getByText('Upload Speed')).toBeInTheDocument()
  })

  it('displays retest all button', () => {
    render(<CompatibilityCheckPage />)
    
    const retestButton = screen.getByText('Retest All')
    expect(retestButton).toBeInTheDocument()
  })

  it('shows continue button when checks pass', async () => {
    render(<CompatibilityCheckPage />)
    
    // Wait for checks to complete with shorter timeout
    await waitFor(() => {
      expect(screen.getByText('Continue to ID Verification')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('navigates to ID verification when continue button is clicked', async () => {
    render(<CompatibilityCheckPage />)
    
    // Wait for checks to complete with shorter timeout
    await waitFor(() => {
      const continueButton = screen.getByText('Continue to ID Verification')
      fireEvent.click(continueButton)
      expect(mockPush).toHaveBeenCalledWith('/exam/id-verification')
    }, { timeout: 3000 })
  })

  it('handles retest functionality', async () => {
    render(<CompatibilityCheckPage />)
    
    const retestButton = screen.getByText('Retest All')
    fireEvent.click(retestButton)
    
    // Should show checking status
    await waitFor(() => {
      expect(screen.getByText('System Check in Progress')).toBeInTheDocument()
    })
  })

  it('displays network recommendations', async () => {
    render(<CompatibilityCheckPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Network Recommendations')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows proper status indicators', async () => {
    render(<CompatibilityCheckPage />)
    
    await waitFor(() => {
      // Should show passed status for most checks
      const passedElements = screen.getAllByText('Passed')
      expect(passedElements.length).toBeGreaterThan(0)
    }, { timeout: 10000 })
  })
})