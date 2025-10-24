"use client"

import { useState, useCallback } from "react"
import { useWebSocket } from "./use-websocket"

interface ExamSessionData {
  sessionId: string
  userId: string
  examId: string
  startTime: Date
  endTime: Date
  status: "active" | "paused" | "submitted" | "ended"
  monitoringData: {
    faceDetections: number
    attentionWarnings: number
    connectionIssues: number
    deviceViolations: number
  }
}

export function useExamSession() {
  const [sessionData, setSessionData] = useState<ExamSessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { isConnected, send } = useWebSocket({
    url: "ws://localhost:8080/exam",
    onMessage: (message) => {
      console.log("[v0] Received WebSocket message:", message)

      if (message.type === "session-update") {
        setSessionData((prev) => ({
          ...prev!,
          ...message.data,
        }))
      }

      if (message.type === "monitoring-alert") {
        console.log("[v0] Monitoring alert:", message.data)
      }
    },
    onConnect: () => {
      console.log("[v0] Exam session WebSocket connected")
      setIsLoading(false)
    },
    onDisconnect: () => {
      console.log("[v0] Exam session WebSocket disconnected")
    },
  })

  const updateMonitoring = useCallback(
    (data: Partial<ExamSessionData["monitoringData"]>) => {
      send({
        type: "monitoring-update",
        data,
        timestamp: Date.now(),
      })
    },
    [send],
  )

  const submitExam = useCallback(() => {
    send({
      type: "exam-submit",
      data: { sessionId: sessionData?.sessionId },
      timestamp: Date.now(),
    })
  }, [send, sessionData?.sessionId])

  const pauseExam = useCallback(() => {
    send({
      type: "exam-pause",
      data: { sessionId: sessionData?.sessionId },
      timestamp: Date.now(),
    })
  }, [send, sessionData?.sessionId])

  const resumeExam = useCallback(() => {
    send({
      type: "exam-resume",
      data: { sessionId: sessionData?.sessionId },
      timestamp: Date.now(),
    })
  }, [send, sessionData?.sessionId])

  return {
    sessionData,
    isLoading,
    isConnected,
    updateMonitoring,
    submitExam,
    pauseExam,
    resumeExam,
  }
}
