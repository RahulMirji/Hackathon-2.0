"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { logViolation, subscribeToViolations } from "../firestore-service"
import type { ViolationDocument, ViolationType, SectionType } from "../types/exam-types"
import { getCurrentExamId } from "../exam-session"

interface ViolationCounts {
  tabSwitch: number
  personOutOfFrame: number
  voiceDetection: number
  lookingAway: number
  headphonesDetected: boolean
}

const VIOLATION_LIMITS = {
  tabSwitch: 3,
  personOutOfFrame: 5,
  voiceDetection: 3,
  lookingAway: 10,
}

export function useViolations(currentSection: SectionType) {
  const [violations, setViolations] = useState<ViolationDocument[]>([])
  const [violationCounts, setViolationCounts] = useState<ViolationCounts>({
    tabSwitch: 0,
    personOutOfFrame: 0,
    voiceDetection: 0,
    lookingAway: 0,
    headphonesDetected: false,
  })
  const [loading, setLoading] = useState(true)
  const pendingViolations = useRef<Array<() => Promise<void>>>([])
  const isFlushing = useRef(false)

  // Subscribe to violations
  useEffect(() => {
    const examId = getCurrentExamId()
    if (!examId) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToViolations(examId, (violationList) => {
      setViolations(violationList)
      
      // Calculate counts
      const counts: ViolationCounts = {
        tabSwitch: 0,
        personOutOfFrame: 0,
        voiceDetection: 0,
        lookingAway: 0,
        headphonesDetected: false,
      }

      violationList.forEach((v) => {
        switch (v.type) {
          case "tab-switch":
            counts.tabSwitch++
            break
          case "out-of-frame":
            counts.personOutOfFrame++
            break
          case "voice-detected":
            counts.voiceDetection++
            break
          case "looking-away":
            counts.lookingAway++
            break
          case "headphones":
            counts.headphonesDetected = true
            break
        }
      })

      setViolationCounts(counts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Batch flush violations every 5 seconds
  useEffect(() => {
    const flushInterval = setInterval(async () => {
      if (pendingViolations.current.length > 0 && !isFlushing.current) {
        isFlushing.current = true
        const toFlush = [...pendingViolations.current]
        pendingViolations.current = []

        try {
          await Promise.all(toFlush.map(fn => fn()))
        } catch (error) {
          console.error("Failed to flush violations:", error)
        } finally {
          isFlushing.current = false
        }
      }
    }, 5000)

    return () => clearInterval(flushInterval)
  }, [])

  // Log a violation (batched)
  const logViolationEvent = useCallback(
    (
      type: ViolationType,
      description: string,
      severity: "low" | "medium" | "high" = "medium",
      duration?: number,
      immediate: boolean = false
    ) => {
      const examId = getCurrentExamId()
      if (!examId) return

      const violationFn = async () => {
        try {
          await logViolation(examId, type, currentSection, description, severity, duration)
        } catch (error) {
          console.error("Failed to log violation:", error)
        }
      }

      if (immediate) {
        // Log immediately for critical violations
        violationFn()
      } else {
        // Batch for non-critical violations
        pendingViolations.current.push(violationFn)
      }
    },
    [currentSection]
  )

  // Check if limit exceeded
  const isLimitExceeded = useCallback((type: keyof typeof VIOLATION_LIMITS) => {
    return violationCounts[type] >= VIOLATION_LIMITS[type]
  }, [violationCounts])

  // Check if any limit exceeded
  const isAnyLimitExceeded = useCallback(() => {
    return (
      violationCounts.tabSwitch >= VIOLATION_LIMITS.tabSwitch ||
      violationCounts.personOutOfFrame >= VIOLATION_LIMITS.personOutOfFrame ||
      violationCounts.voiceDetection >= VIOLATION_LIMITS.voiceDetection ||
      violationCounts.lookingAway >= VIOLATION_LIMITS.lookingAway
    )
  }, [violationCounts])

  return {
    violations,
    violationCounts,
    loading,
    logViolationEvent,
    isLimitExceeded,
    isAnyLimitExceeded,
    VIOLATION_LIMITS,
  }
}
