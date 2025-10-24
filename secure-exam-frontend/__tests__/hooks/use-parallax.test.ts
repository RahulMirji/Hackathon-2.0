import { renderHook } from '@testing-library/react'
import { useParallax } from '@/hooks/use-parallax'

describe('useParallax', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  it('returns ref and offset', () => {
    const { result } = renderHook(() => useParallax())
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('offset')
    expect(result.current.offset).toBe(0)
  })

  it('accepts custom speed option', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5 }))
    expect(result.current.offset).toBe(0)
  })

  it('can be disabled', () => {
    const { result } = renderHook(() => useParallax({ disabled: true }))
    expect(result.current.offset).toBe(0)
  })

  it('uses default speed when none provided', () => {
    const { result } = renderHook(() => useParallax())
    expect(result.current.offset).toBe(0)
  })
})
