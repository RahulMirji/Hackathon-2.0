"use client"

import { getQuestionsBySection as getMockQuestions } from "./mock-questions"
import { getSectionQuestions, saveSectionQuestions } from "./exam-session"
import { fetchWithRetry, RETRY_CONFIG } from "./utils"

export interface QuestionLoadResult {
  questions: any[]
  source: "ai" | "mock" | "cache"
  error?: string
}

// SSE Event Types (matching API)
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

// Get expected question count for a section
function getExpectedCount(section: string): number {
  if (section === "mcq3") return 10
  if (section === "coding") return 2
  return 25 // mcq1, mcq2
}

// Get or load section questions (cache-first)
export async function getOrLoadSectionQuestions(
  section: string,
  onProgress?: (questions: any[], count: number) => void
): Promise<QuestionLoadResult> {
  const expectedCount = getExpectedCount(section)
  
  // Check cache first
  const cached = getSectionQuestions(section)
  if (cached && cached.length > 0) {
    // Check if we have all expected questions
    if (cached.length >= expectedCount) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ [QUESTION-SERVICE] Using cached ${section} questions:`, cached.length)
      }
      return {
        questions: cached,
        source: "cache"
      }
    }
    
    // We have partial cache - need to generate remaining questions
    const missing = expectedCount - cached.length
    if (process.env.NODE_ENV !== 'production') {
      console.log(`⚠️ [QUESTION-SERVICE] Incomplete cache for ${section}: ${cached.length}/${expectedCount}. Generating ${missing} more...`)
    }
    
    // Generate remaining questions
    try {
      const result = await loadRemainingQuestions(section, cached, missing, onProgress)
      return result
    } catch (error) {
      // If generation fails, return what we have
      console.error(`❌ [QUESTION-SERVICE] Failed to generate remaining questions:`, error)
      return {
        questions: cached,
        source: "cache",
        error: "Incomplete question set"
      }
    }
  }
  
  // Load from API
  return loadQuestionsWithStreaming(section, onProgress)
}

// Load remaining questions to complete a partial set
async function loadRemainingQuestions(
  section: string,
  existingQuestions: any[],
  count: number,
  onProgress?: (questions: any[], count: number) => void
): Promise<QuestionLoadResult> {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📡 [QUESTION-SERVICE] Generating ${count} remaining questions for ${section}...`)
    console.log(`📋 [QUESTION-SERVICE] Current questions: ${existingQuestions.length}`)
  }

  // Request MORE questions than needed to account for potential duplicates
  const requestCount = Math.ceil(count * 1.5) // Request 50% more
  
  const response = await fetchWithRetry("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, count: requestCount }),
  })

  if (!response.ok) {
    throw new Error(`API failed with status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("No reader available")
  }

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split("\n")

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6)) as SSEEvent

          if (data.type === "complete") {
            // Filter out questions that are similar to existing ones
            const existingTitles = new Set(
              existingQuestions.map(q => {
                const title = q.title || q.text || ''
                return title.toLowerCase().replace(/[^a-z0-9]/g, '')
              })
            )

            const newQuestions = data.questions.filter(q => {
              const title = q.title || q.text || ''
              const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '')
              return !existingTitles.has(normalized)
            })

            if (process.env.NODE_ENV !== 'production') {
              console.log(`🔍 [QUESTION-SERVICE] Filtered ${data.questions.length} → ${newQuestions.length} unique questions`)
            }

            // Take only what we need
            const questionsToAdd = newQuestions.slice(0, count)
            
            // Renumber to continue from existing
            const startId = existingQuestions.length + 1
            const renumbered = questionsToAdd.map((q, idx) => ({
              ...q,
              id: startId + idx
            }))

            // Combine with existing questions
            const allQuestions = [...existingQuestions, ...renumbered]
            
            // Save to cache
            saveSectionQuestions(section, allQuestions)
            
            if (process.env.NODE_ENV !== 'production') {
              console.log(`✅ [QUESTION-SERVICE] Added ${renumbered.length} questions. Total: ${allQuestions.length}`)
            }

            // Report progress
            if (onProgress) {
              onProgress(allQuestions, allQuestions.length)
            }

            return {
              questions: allQuestions,
              source: "ai"
            }
          }

          if (data.type === "error") {
            throw new Error(data.message)
          }
        } catch (e) {
          // Continue on parse errors
        }
      }
    }
  }

  throw new Error("No questions received")
}

export async function loadQuestionsWithStreaming(
  section: string,
  onProgress?: (questions: any[], count: number) => void
): Promise<QuestionLoadResult> {
  try {
    // For MCQ1 and MCQ2, load all 25 questions at once (no batching)
    // Batching was causing incomplete questions
    if (section === "mcq1" || section === "mcq2") {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📡 [QUESTION-SERVICE] Loading ${section} (25 questions)...`)
      }

      const count = 25
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
                // Validate we got all 25 questions
                if (data.questions.length < 25) {
                  console.warn(`⚠️ [QUESTION-SERVICE] Only received ${data.questions.length}/25 questions for ${section}`)
                }
                
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
    }

    // For other sections, use single request
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

            // Handle init event
            if (data.type === "init" && "requestId" in data) {
              requestId = data.requestId
              if (process.env.NODE_ENV !== 'production') {
                console.log(`🔵 [QUESTION-SERVICE] Request ID: ${requestId}`)
              }
              continue
            }

            // Handle partial updates
            if (data.type === "partial") {
              if (onProgress) {
                onProgress(data.questions, data.count)
              }
              
              // Save partial to cache if we have minimum questions
              if (data.count >= RETRY_CONFIG.MIN_QUESTIONS_TO_START) {
                saveSectionQuestions(section, data.questions)
              }
            }

            // Handle complete
            if (data.type === "complete") {
              saveSectionQuestions(section, data.questions)
              return {
                questions: data.questions,
                source: "ai",
              }
            }

            // Handle errors
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

    // Fallback to mock questions
    const mockQuestions = getMockQuestions(section)

    return {
      questions: mockQuestions,
      source: "mock",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Load all sections in parallel with streaming
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
