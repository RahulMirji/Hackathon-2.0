import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <div data-testid="arrow-right-icon">→</div>,
  ArrowLeft: () => <div data-testid="arrow-left-icon">←</div>,
  Camera: () => <div data-testid="camera-icon">📷</div>,
  CheckCircle2: () => <div data-testid="check-circle-icon">✓</div>,
  XCircle: () => <div data-testid="x-circle-icon">✗</div>,
  AlertTriangle: () => <div data-testid="alert-triangle-icon">⚠</div>,
  Shield: () => <div data-testid="shield-icon">🛡</div>,
  Eye: () => <div data-testid="eye-icon">👁</div>,
  FileText: () => <div data-testid="file-text-icon">📄</div>,
  User: () => <div data-testid="user-icon">👤</div>,
  Scale: () => <div data-testid="scale-icon">⚖</div>,
  Monitor: () => <div data-testid="monitor-icon">🖥</div>,
  Mic: () => <div data-testid="mic-icon">🎤</div>,
  Lock: () => <div data-testid="lock-icon">🔒</div>,
  UserCheck: () => <div data-testid="user-check-icon">✅</div>,
  Upload: () => <div data-testid="upload-icon">⬆</div>,
  Play: () => <div data-testid="play-icon">▶</div>,
  Send: () => <div data-testid="send-icon">📤</div>,
  Save: () => <div data-testid="save-icon">💾</div>,
  Code2: () => <div data-testid="code-icon">💻</div>,
  RefreshCw: () => <div data-testid="refresh-icon">🔄</div>,
  Activity: () => <div data-testid="activity-icon">📊</div>,
  Settings: () => <div data-testid="settings-icon">⚙</div>,
  Clock: () => <div data-testid="clock-icon">🕐</div>,
  Download: () => <div data-testid="download-icon">⬇</div>,
  Signal: () => <div data-testid="signal-icon">📶</div>,
  Wifi: () => <div data-testid="wifi-icon">📶</div>,
  WifiOff: () => <div data-testid="wifi-off-icon">📵</div>,
  Cpu: () => <div data-testid="cpu-icon">🖥</div>,
  HardDrive: () => <div data-testid="hard-drive-icon">💾</div>,
  Battery: () => <div data-testid="battery-icon">🔋</div>,
  Globe: () => <div data-testid="globe-icon">🌐</div>,
  Volume2: () => <div data-testid="volume-icon">🔊</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  HelpCircle: () => <div data-testid="help-icon">❓</div>,
  ChevronLeft: () => <div data-testid="chevron-left-icon">‹</div>,
  ChevronRight: () => <div data-testid="chevron-right-icon">›</div>,
  Loader2: () => <div data-testid="loader-icon">⏳</div>,
}))

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock common browser APIs
export const mockBrowserAPIs = () => {
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

  // Mock AudioContext
  global.AudioContext = jest.fn().mockImplementation(() => ({
    createMediaStreamSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
    }),
    createAnalyser: jest.fn().mockReturnValue({
      fftSize: 256,
      frequencyBinCount: 128,
      getByteFrequencyData: jest.fn(),
    }),
    close: jest.fn(),
    sampleRate: 44100,
  }))

  // Mock performance API
  Object.defineProperty(window, 'performance', {
    writable: true,
    value: {
      now: jest.fn(() => Date.now()),
    },
  })

  return {
    mockGetUserMedia,
  }
}

// Mock router helper
export const mockRouter = () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()
  const mockReplace = jest.fn()

  return {
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
    mockPush,
    mockBack,
    mockReplace,
  }
}

// Common test data
export const testData = {
  mcqQuestion: {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1
  },
  codingQuestion: {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      }
    ]
  }
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }