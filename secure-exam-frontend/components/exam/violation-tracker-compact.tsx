"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Monitor, UserX, Volume2, Eye, Headphones } from "lucide-react"
import { useViolations } from "@/lib/hooks/use-violations"
import type { SectionType } from "@/lib/types/exam-types"

interface ViolationTrackerCompactProps {
  currentSection?: SectionType
}

export function ViolationTrackerCompact({ currentSection = "mcq1" }: ViolationTrackerCompactProps) {
  const {
    violationCounts,
    logViolationEvent,
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
          true
        )
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Simulate other violations for demo
    const simulationInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        logViolationEvent("out-of-frame", "Person moved out of camera frame", "medium")
      }
      if (Math.random() > 0.97) {
        logViolationEvent("voice-detected", "Voice or conversation detected", "high")
      }
      if (Math.random() > 0.96) {
        logViolationEvent("looking-away", "User looking away from screen", "low")
      }
      if (Math.random() > 0.98) {
        logViolationEvent("headphones", "Headphones detected", "medium")
      }
    }, 5000)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(simulationInterval)
    }
  }, [logViolationEvent])

  const violations = violationCounts

  const getViolationColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 80) return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
    if (percentage >= 50) return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
    return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
  }

  const totalViolations = violations.tabSwitch + violations.personOutOfFrame + violations.voiceDetection + violations.lookingAway

  return (
    <Card className="p-0 h-full shadow-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <h3 className="font-bold text-sm">Violations</h3>
        </div>
        <Badge variant="secondary" className="bg-white/20 text-white text-xs">
          {totalViolations} Total
        </Badge>
      </div>

      <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent px-3 py-2 flex-1">
        {/* Tab Switch */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs border ${getViolationColor(violations.tabSwitch, VIOLATION_LIMITS.tabSwitch)}`}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Monitor className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">Tab Switch</span>
          </div>
          <Badge variant={violations.tabSwitch > 0 ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
            {violations.tabSwitch}/{VIOLATION_LIMITS.tabSwitch}
          </Badge>
        </div>

        {/* Person Out of Frame */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs border ${getViolationColor(violations.personOutOfFrame, VIOLATION_LIMITS.personOutOfFrame)}`}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <UserX className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">Out of Frame</span>
          </div>
          <Badge variant={violations.personOutOfFrame > 0 ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
            {violations.personOutOfFrame}/{VIOLATION_LIMITS.personOutOfFrame}
          </Badge>
        </div>

        {/* Voice Detection */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs border ${getViolationColor(violations.voiceDetection, VIOLATION_LIMITS.voiceDetection)}`}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Volume2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">Voice Detected</span>
          </div>
          <Badge variant={violations.voiceDetection > 0 ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
            {violations.voiceDetection}/{VIOLATION_LIMITS.voiceDetection}
          </Badge>
        </div>

        {/* Looking Away */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs border ${getViolationColor(violations.lookingAway, VIOLATION_LIMITS.lookingAway)}`}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Eye className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">Looking Away</span>
          </div>
          <Badge variant={violations.lookingAway > 0 ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
            {violations.lookingAway}/{VIOLATION_LIMITS.lookingAway}
          </Badge>
        </div>

        {/* Headphones Detected */}
        <div className={`flex items-center justify-between p-2 rounded-lg text-xs border ${violations.headphonesDetected ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"}`}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Headphones className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium text-gray-700 dark:text-gray-300 truncate">Headphones</span>
          </div>
          <Badge variant={violations.headphonesDetected ? "destructive" : "secondary"} className="text-xs ml-2 flex-shrink-0">
            {violations.headphonesDetected ? "Yes" : "No"}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
