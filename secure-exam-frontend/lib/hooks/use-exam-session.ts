"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  createExamSession,
  updateExamSession,
  subscribeToExamSession,
  startSection,
  completeSection,
  saveQuestions,
  getQuestions,
} from "../firestore-service"
import type { ExamSession, SectionType } from "../types/exam-types"
import { getCurrentExamId, generateExamId } from "../exam-session"

export function useExamSession() {
  const { user } = useAuth()
  const [examSession, setExamSession] = useState<ExamSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize or load exam session
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const examId = getCurrentExamId()
    if (!examId) {
      setLoading(false)
      return
    }

    // Subscribe to exam session
    const unsubscribe = subscribeToExamSession(examId, (session) => {
      setExamSession(session)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  // Start new exam
  const startExam = useCallback(async () => {
    if (!user) {
      setError("User not authenticated")
      return null
    }

    try {
      const examId = generateExamId()
      await createExamSession(examId, user.uid, user.email || "")
      
      // Store in localStorage for quick access
      localStorage.setItem("current_exam_id", examId)
      
      return examId
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start exam")
      return null
    }
  }, [user])

  // Start a section
  const startExamSection = useCallback(async (section: SectionType) => {
    if (!examSession) return

    try {
      await startSection(examSession.examId, section)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start section")
    }
  }, [examSession])

  // Complete a section
  const completeExamSection = useCallback(async (section: SectionType) => {
    if (!examSession) return

    try {
      await completeSection(examSession.examId, section)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete section")
    }
  }, [examSession])

  // Update exam session
  const updateSession = useCallback(async (updates: Partial<ExamSession>) => {
    if (!examSession) return

    try {
      await updateExamSession(examSession.examId, updates)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update session")
    }
  }, [examSession])

  // Save questions for a section
  const saveExamQuestions = useCallback(async (section: SectionType, questions: any[]) => {
    if (!examSession) return

    try {
      await saveQuestions(examSession.examId, section, questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save questions")
    }
  }, [examSession])

  // Get questions for a section
  const getExamQuestions = useCallback(async (section: SectionType) => {
    if (!examSession) return []

    try {
      return await getQuestions(examSession.examId, section)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get questions")
      return []
    }
  }, [examSession])

  return {
    examSession,
    loading,
    error,
    startExam,
    startExamSection,
    completeExamSection,
    updateSession,
    saveExamQuestions,
    getExamQuestions,
  }
}
