"use client"

import { getQuestionsBySection as getMockQuestions } from "./mock-questions"
import { getSectionQuestions, saveSectionQuestions } from "./exam-session"
import { fetchWithRetry, RETRY_CONFIG } from "./utils"

export interface QuestionLoadResult {
  questions: any[]
  source: "ai" | "mock" | "cache"
  error?: string
}

interface SSEPartialEvent {
  type: "partial"
  questions: any[]
  count: number
}

interface SSECompleteEvent {
  type: "complete"
  questions: any[]
}

interface SSEErrorEvent {
  type: "error"
  message: string
  details?: string
  shouldRetry?: boolean
}

type SSEEvent = SSEPartialEvent | SSECompleteEvent | SSEErrorEvent | { type: "init"; requestId: string }

export async function getOrLoadSectionQuestions(
  section: string,
  onProgress?: (questions: any[], count: number) => void
): Promise<QuestionLoadResult> {
  const cached = getSectionQuestions(section)
  if (cached && cached.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [QUESTION-SERVICE] Using cached ${section} questions:`, cached.length)
    }
    return {
      questions: cached,
      source: "cache"
    }
  }
  
  return loadQuestionsWithStreaming(section, onProgress)
}

export async function loadQuestionsWithStreaming(
  section: string,
  onProgress?: (questions: any[], count: number) => void
): Promise<QuestionLoadResult> {
  try {
    const count = section === "mcq3" ? 10 : section === "coding" ? 2 : 25

    if (process.env.NODE_ENV !== 'production') {
      console.log(`📡 [QUESTION-SERVICE] Loading ${section} questions from API...`)
    }

    const response = await fetchWithRetry("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, count }),
    })

    if (!response.ok) {
      throw new Error(`API failed with status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("No reader available")
    }

    const decoder = new TextDecoder()
    let requestId = "unknown"

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6)) as SSEEvent

            if (data.type === "init" && "requestId" in data) {
              requestId = data.requestId
              if (process.env.NODE_ENV !== 'production') {
                console.log(`🔵 [QUESTION-SERVICE] Request ID: ${requestId}`)
              }
              continue
            }

            if (data.type === "partial") {
              if (onProgress) {
                onProgress(data.questions, data.count)
              }
              
              if (data.count >= RETRY_CONFIG.MIN_QUESTIONS_TO_START) {
                saveSectionQuestions(section, data.questions)
              }
            }

            if (data.type === "complete") {
              saveSectionQuestions(section, data.questions)
              return {
                questions: data.questions,
                source: "ai",
              }
            }

            if (data.type === "error") {
              if (process.env.NODE_ENV !== 'production') {
                console.error(`❌ [QUESTION-SERVICE] Error: ${data.message}`)
              }
              throw new Error(data.message)
            }
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`⚠️ [QUESTION-SERVICE] Failed to parse SSE event:`, e)
            }
          }
        }
      }
    }

    throw new Error("No questions received from stream")
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ [QUESTION-SERVICE] Failed to load ${section} questions from AI:`, error)
    }

    const mockQuestions = getMockQuestions(section)

    return {
      questions: mockQuestions,
      source: "mock",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function loadAllSections(
  onSectionProgress?: (section: string, questions: any[], count: number) => void
): Promise<Record<string, QuestionLoadResult>> {
  const sections = ["mcq1", "mcq2", "mcq3", "coding"]

  const results = await Promise.all(
    sections.map((section) =>
      getOrLoadSectionQuestions(section, (questions, count) => {
        if (onSectionProgress) {
          onSectionProgress(section, questions, count)
        }
      })
    )
  )

  return {
    mcq1: results[0],
    mcq2: results[1],
    mcq3: results[2],
    coding: results[3],
  }
}
