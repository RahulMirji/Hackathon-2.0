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
      const error = "User not authenticated"
      setError(error)
      throw new Error(error)
    }

    try {
      const examId = generateExamId()
      await createExamSession(examId, user.uid, user.email || "")
      
      // Store in localStorage for quick access
      localStorage.setItem("current_exam_id", examId)
      
      // Import and set the Firestore session created flag
      const { setFirestoreSessionCreated } = await import("../exam-session")
      setFirestoreSessionCreated(true)
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("✅ [USE-EXAM-SESSION] Created exam session and set flag:", examId)
      }
      
      return examId
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start exam"
      setError(errorMsg)
      throw err
    }
  }, [user])

  // Ensure session exists helper
  const ensureSessionExists = useCallback(async (): Promise<string> => {
    const { hasFirestoreSession, setFirestoreSessionCreated } = await import("../exam-session")
    
    let examId = getCurrentExamId()
    const hasSession = hasFirestoreSession()
    
    // If no exam ID or no Firestore session, create one
    if (!examId || !hasSession) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("🔧 [USE-EXAM-SESSION] Creating missing session", { examId, hasSession })
      }
      
      examId = generateExamId()
      
      // Use user info if available, otherwise use demo user
      const userId = user?.uid || "demo_user"
      const userEmail = user?.email || "demo@example.com"
      
      await createExamSession(examId, userId, userEmail)
      localStorage.setItem("current_exam_id", examId)
      setFirestoreSessionCreated(true)
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("✅ [USE-EXAM-SESSION] Created exam session:", examId)
      }
    }
    
    return examId
  }, [user])

  // Start a section
  const startExamSection = useCallback(async (section: SectionType) => {
    try {
      const examId = await ensureSessionExists()
      await startSection(examId, section)
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("✅ [USE-EXAM-SESSION] Started section:", section)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start section"
      setError(errorMsg)
      if (process.env.NODE_ENV !== 'production') {
        console.error("❌ [USE-EXAM-SESSION] Failed to start section:", err)
      }
      throw err
    }
  }, [user, ensureSessionExists])

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
