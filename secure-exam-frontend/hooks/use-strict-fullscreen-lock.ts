"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseStrictFullscreenLockProps {
  onTabSwitchDetected?: () => void
  onViolation?: () => void
  enabled?: boolean
}

export function useStrictFullscreenLock({
  onTabSwitchDetected,
  onViolation,
  enabled = true
}: UseStrictFullscreenLockProps) {
  const tabSwitchCountRef = useRef(0)
  const isFullscreenRef = useRef(false)
  const hasViolationRef = useRef(false)

  // Strict tab switch prevention and detection
  useEffect(() => {
    if (!enabled) return

    // Track document visibility (tab switch detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current++
        console.warn(`🚨 TAB SWITCH DETECTED #${tabSwitchCountRef.current}`)
        
        // Mark as violation - this should trigger exam termination
        hasViolationRef.current = true
        
        if (onTabSwitchDetected) {
          onTabSwitchDetected()
        }
        
        if (onViolation) {
          onViolation()
        }

        // Try to prevent tab switch by requesting fullscreen again
        try {
          const elem = document.documentElement
          if (elem.requestFullscreen && !document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
              console.error("Failed to re-enter fullscreen:", err)
            })
          }
        } catch (err) {
          console.error("Error in tab switch handler:", err)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Prevent ESC key to exit fullscreen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        console.warn("🚨 ESC KEY PRESSED - ATTEMPTING TO EXIT FULLSCREEN")
        hasViolationRef.current = true
        if (onViolation) {
          onViolation()
        }
        return false
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)

    // Detect fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      
      if (isFullscreenRef.current && !isCurrentlyFullscreen) {
        // User exited fullscreen
        console.warn("🚨 USER EXITED FULLSCREEN")
        hasViolationRef.current = true
        if (onViolation) {
          onViolation()
        }
      }
      
      isFullscreenRef.current = isCurrentlyFullscreen
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)

    // Detect focus loss (another way to detect tab switch)
    const handleBlur = () => {
      console.warn("🚨 WINDOW BLUR - POSSIBLE TAB SWITCH")
      // Don't immediately trigger on blur, but track it
    }

    const handleFocus = () => {
      console.log("✓ Window focused")
    }

    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("contextmenu", handleContextMenu)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [enabled, onTabSwitchDetected, onViolation])

  // Get current violation status
  const hasViolation = useCallback(() => {
    return hasViolationRef.current
  }, [])

  // Get tab switch count
  const getTabSwitchCount = useCallback(() => {
    return tabSwitchCountRef.current
  }, [])

  // Reset violation flag (for testing)
  const resetViolationFlag = useCallback(() => {
    hasViolationRef.current = false
    tabSwitchCountRef.current = 0
  }, [])

  return {
    hasViolation,
    getTabSwitchCount,
    resetViolationFlag,
  }
}
