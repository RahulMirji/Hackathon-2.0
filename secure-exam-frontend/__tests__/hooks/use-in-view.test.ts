import { renderHook } from '@testing-library/react'
import { useInView } from '@/hooks/use-in-view'

describe('useInView', () => {
  it('returns ref and inView state', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('inView')
    expect(result.current.inView).toBe(false)
  })

  it('accepts custom threshold option without errors', () => {
    const { result } = renderHook(() => useInView({ threshold: 0.5 }))
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('inView')
  })

  it('accepts custom rootMargin option without errors', () => {
    const { result } = renderHook(() => useInView({ rootMargin: '10px' }))
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('inView')
  })

  it('accepts triggerOnce option without errors', () => {
    const { result } = renderHook(() => useInView({ triggerOnce: false }))
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('inView')
  })

  it('initializes with inView as false', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current.inView).toBe(false)
  })
})
