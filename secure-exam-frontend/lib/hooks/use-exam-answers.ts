"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { saveAnswer, saveCodeSubmission } from "../firestore-service"
import type { QuestionStatus, SectionType, CodeSubmission } from "../types/exam-types"
import { getCurrentExamId } from "../exam-session"
import { Timestamp } from "firebase/firestore"

interface AnswerState {
  userAnswer: string | null
  status: QuestionStatus
  markedForReview: boolean
  timeSpent: number
  startTime: number
}

export function useExamAnswers(section: SectionType) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({})
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeouts = useRef<Record<number, NodeJS.Timeout>>({})
  const questionStartTimes = useRef<Record<number, number>>({})

  // Track time spent on questions
  const startQuestionTimer = useCallback((questionNumber: number) => {
    if (!questionStartTimes.current[questionNumber]) {
      questionStartTimes.current[questionNumber] = Date.now()
    }
  }, [])

  const getTimeSpent = useCallback((questionNumber: number): number => {
    const startTime = questionStartTimes.current[questionNumber]
    if (!startTime) return 0
    return Math.floor((Date.now() - startTime) / 1000) // seconds
  }, [])

  // Save answer with debouncing
  const saveAnswerDebounced = useCallback(
    async (
      questionId: string,
      questionNumber: number,
      userAnswer: string | null,
      status: QuestionStatus,
      markedForReview: boolean
    ) => {
      const examId = getCurrentExamId()
      if (!examId) return

      // Clear existing timeout
      if (saveTimeouts.current[questionNumber]) {
        clearTimeout(saveTimeouts.current[questionNumber])
      }

      // Update local state immediately
      setAnswers((prev) => ({
        ...prev,
        [questionNumber]: {
          userAnswer,
          status,
          markedForReview,
          timeSpent: getTimeSpent(questionNumber),
          startTime: questionStartTimes.current[questionNumber] || Date.now(),
        },
      }))

      // Debounce save to Firestore (500ms)
      saveTimeouts.current[questionNumber] = setTimeout(async () => {
        setIsSaving(true)
        try {
          const timeSpent = getTimeSpent(questionNumber)
          await saveAnswer(
            examId,
            questionId,
            section,
            questionNumber,
            userAnswer,
            status,
            markedForReview,
            timeSpent
          )
          
          if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ Saved answer for Q${questionNumber}`)
          }
        } catch (error) {
          console.error("Failed to save answer:", error)
        } finally {
          setIsSaving(false)
        }
      }, 500)
    },
    [section, getTimeSpent]
  )

  // Save code submission immediately (no debouncing)
  const saveCode = useCallback(
    async (
      questionId: string,
      questionNumber: number,
      code: string,
      language: string,
      testResults?: any[]
    ) => {
      const examId = getCurrentExamId()
      if (!examId) return

      setIsSaving(true)
      try {
        const submission: CodeSubmission = {
          code,
          language,
          timestamp: Timestamp.now(),
          testResults,
          allTestsPassed: testResults?.every((r) => r.passed) || false,
        }

        await saveCodeSubmission(examId, questionId, section, questionNumber, submission)
        
        // Update local state
        setAnswers((prev) => ({
          ...prev,
          [questionNumber]: {
            userAnswer: code,
            status: "answered",
            markedForReview: prev[questionNumber]?.markedForReview || false,
            timeSpent: getTimeSpent(questionNumber),
            startTime: questionStartTimes.current[questionNumber] || Date.now(),
          },
        }))

        if (process.env.NODE_ENV !== 'production') {
          console.log(`✅ Saved code submission for Q${questionNumber}`)
        }
      } catch (error) {
        console.error("Failed to save code submission:", error)
      } finally {
        setIsSaving(false)
      }
    },
    [section, getTimeSpent]
  )

  // Update answer status
  const updateAnswerStatus = useCallback(
    (questionId: string, questionNumber: number, status: QuestionStatus) => {
      const current = answers[questionNumber]
      if (current) {
        saveAnswerDebounced(
          questionId,
          questionNumber,
          current.userAnswer,
          status,
          current.markedForReview
        )
      }
    },
    [answers, saveAnswerDebounced]
  )

  // Mark for review
  const markForReview = useCallback(
    (questionId: string, questionNumber: number, marked: boolean) => {
      const current = answers[questionNumber]
      if (current) {
        const newStatus = current.userAnswer
          ? marked
            ? "answered-marked"
            : "answered"
          : marked
          ? "marked-review"
          : "not-answered"

        saveAnswerDebounced(
          questionId,
          questionNumber,
          current.userAnswer,
          newStatus,
          marked
        )
      }
    },
    [answers, saveAnswerDebounced]
  )

  // Clear response
  const clearResponse = useCallback(
    (questionId: string, questionNumber: number) => {
      const current = answers[questionNumber]
      const newStatus = current?.markedForReview ? "marked-review" : "not-answered"

      saveAnswerDebounced(questionId, questionNumber, null, newStatus, current?.markedForReview || false)
    },
    [answers, saveAnswerDebounced]
  )

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(saveTimeouts.current).forEach(clearTimeout)
    }
  }, [])

  return {
    answers,
    isSaving,
    saveAnswerDebounced,
    saveCode,
    updateAnswerStatus,
    markForReview,
    clearResponse,
    startQuestionTimer,
    getTimeSpent,
  }
}
