"use client"

import { useEffect } from "react"
import { AlertTriangle, Monitor, UserX, Volume2, Eye, Headphones } from "lucide-react"
import { useViolations } from "@/lib/hooks/use-violations"
import type { SectionType } from "@/lib/types/exam-types"

interface ViolationTrackerProps {
  currentSection?: SectionType
}

export function ViolationTracker({ currentSection = "mcq1" }: ViolationTrackerProps) {
  const {
    violationCounts,
    logViolationEvent,
    isAnyLimitExceeded,
    VIOLATION_LIMITS,
  } = useViolations(currentSection)

  useEffect(() => {
    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolationEvent(
          "tab-switch",
          "User switched tabs or minimized window",
          "high",
          undefined,
          true // Log immediately
        )
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Simulate other violations for demo (in production, these would be real detections)
    const simulationInterval = setInterval(() => {
      // Randomly simulate violations for demo purposes
      if (Math.random() > 0.95) {
        logViolationEvent(
          "out-of-frame",
          "Person moved out of camera frame",
          "medium"
        )
      }
      if (Math.random() > 0.97) {
        logViolationEvent(
          "voice-detected",
          "Voice or conversation detected",
          "high"
        )
      }
      if (Math.random() > 0.96) {
        logViolationEvent(
          "looking-away",
          "User looking away from screen",
          "low"
        )
      }
      if (Math.random() > 0.98) {
        logViolationEvent(
          "headphones",
          "Headphones detected",
          "medium"
        )
      }
    }, 5000)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(simulationInterval)
    }
  }, [logViolationEvent])

  const getViolationColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 80) return "text-red-600 dark:text-red-400"
    if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  const getViolationBgColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 80) return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
    if (percentage >= 50) return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
    return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
  }

  const violations = violationCounts

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <h4 className="text-sm font-bold">Violation Tracking</h4>
      </div>
      <div className="p-4 space-y-2">


        {/* Tab Switch */}
        <div
          className={`flex items-center justify-between p-2.5 rounded border ${getViolationBgColor(violations.tabSwitch, VIOLATION_LIMITS.tabSwitch)}`}
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="font-medium">Tab Switch</span>
          </div>
          <span className={`font-bold ${getViolationColor(violations.tabSwitch, VIOLATION_LIMITS.tabSwitch)}`}>
            {violations.tabSwitch}/{VIOLATION_LIMITS.tabSwitch}
          </span>
        </div>

        {/* Person Out of Frame */}
        <div
          className={`flex items-center justify-between p-2.5 rounded border ${getViolationBgColor(violations.personOutOfFrame, VIOLATION_LIMITS.personOutOfFrame)}`}
        >
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            <span className="font-medium">Out of Frame</span>
          </div>
          <span
            className={`font-bold ${getViolationColor(violations.personOutOfFrame, VIOLATION_LIMITS.personOutOfFrame)}`}
          >
            {violations.personOutOfFrame}/{VIOLATION_LIMITS.personOutOfFrame}
          </span>
        </div>

        {/* Voice Detection */}
        <div
          className={`flex items-center justify-between p-2.5 rounded border ${getViolationBgColor(violations.voiceDetection, VIOLATION_LIMITS.voiceDetection)}`}
        >
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="font-medium">Voice Detected</span>
          </div>
          <span
            className={`font-bold ${getViolationColor(violations.voiceDetection, VIOLATION_LIMITS.voiceDetection)}`}
          >
            {violations.voiceDetection}/{VIOLATION_LIMITS.voiceDetection}
          </span>
        </div>

        {/* Looking Away */}
        <div
          className={`flex items-center justify-between p-2.5 rounded border ${getViolationBgColor(violations.lookingAway, VIOLATION_LIMITS.lookingAway)}`}
        >
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Looking Away</span>
          </div>
          <span className={`font-bold ${getViolationColor(violations.lookingAway, VIOLATION_LIMITS.lookingAway)}`}>
            {violations.lookingAway}/{VIOLATION_LIMITS.lookingAway}
          </span>
        </div>

        {/* Headphones Detected */}
        <div
          className={`flex items-center justify-between p-2.5 rounded border ${violations.headphonesDetected ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"}`}
        >
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            <span className="font-medium">Headphones</span>
          </div>
          <span
            className={`font-bold ${violations.headphonesDetected ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
          >
            {violations.headphonesDetected ? "Detected" : "Not Detected"}
          </span>
        </div>
        {/* Warning Message */}
      {isAnyLimitExceeded() && (
          <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-700 rounded-lg text-xs text-red-800 dark:text-red-200 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="font-bold">Warning: Maximum violations reached! Your exam may be flagged.</span>
          </div>
        )}
      </div>
    </div>
  )
}
