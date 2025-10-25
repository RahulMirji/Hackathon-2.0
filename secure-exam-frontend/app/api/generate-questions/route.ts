import { NextRequest } from "next/server"
import { createLogger } from "@/lib/utils"

// Load from environment variables
const API_URL = process.env.AI_API_URL || ""
const API_KEY = process.env.AI_API_KEY || ""
const MODEL = process.env.AI_MODEL || ""
const PROVIDER = process.env.AI_PROVIDER || "DeepInfra"

// Validate environment variables at runtime
if (!API_URL || !API_KEY || !MODEL) {
  console.error("❌ Missing required environment variables:")
  if (!API_URL) console.error("  - AI_API_URL")
  if (!API_KEY) console.error("  - AI_API_KEY")
  if (!MODEL) console.error("  - AI_MODEL")
  throw new Error("Missing required AI configuration. Please check your .env.local file.")
}

// SSE Event Types
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

type SSEEvent = SSEPartialEvent | SSECompleteEvent | SSEErrorEvent

// Validate MCQ question schema
function validateMCQQuestion(q: any, index: number): string | null {
  if (typeof q.id !== 'number') return `Question ${index}: missing or invalid id`
  if (!q.text || typeof q.text !== 'string') return `Question ${index}: missing or invalid text`
  if (!Array.isArray(q.options) || q.options.length !== 4) return `Question ${index}: must have exactly 4 options`
  if (!q.correctAnswer || typeof q.correctAnswer !== 'string') return `Question ${index}: missing correctAnswer`
  if (!q.options.includes(q.correctAnswer)) return `Question ${index}: correctAnswer not in options`
  if (q.type !== 'multiple-choice') return `Question ${index}: type must be "multiple-choice"`
  return null
}

// Normalize title for deduplication
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Deduplicate questions by normalized title
function deduplicateQuestions(questions: any[]): any[] {
  const seen = new Set<string>()
  const unique: any[] = []
  
  for (const q of questions) {
    const normalized = normalizeTitle(q.title || q.text || '')
    if (!seen.has(normalized)) {
      seen.add(normalized)
      unique.push(q)
    }
  }
  
  return unique
}

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const logger = createLogger({ requestId })
  
  logger.info("POST /api/generate-questions called")
  
  try {
    const body = await request.json()
    const { section = "coding", count = 25, retryAttempt = 0 } = body
    
    logger.info("Request received", { section, count, retryAttempt })

    let prompt = ""
    let temperature = 0.7
    let useStreaming = false

    if (section === "coding") {
      temperature = 0.7
      useStreaming = false // Disable streaming for coding to get stable JSON
      
      if (process.env.NODE_ENV !== 'production') {
        logger.info("Generating coding questions", { temperature, streaming: useStreaming })
      }
      
      prompt = `Generate EXACTLY ${count} coding problems in JSON format.

CRITICAL RULES FOR TEST CASES:
1. Input format MUST match the problem type
2. Expected output MUST be the EXACT string that will be printed
3. For problems returning arrays: output should be space-separated values like "0 1"
4. For problems returning strings: output should be the string itself like "olleh"
5. For problems returning booleans: output should be the string "true" or "false"
6. For problems returning numbers: output should be the number as string like "5"

PROBLEM TYPES AND FORMATS:

Type 1: Two Sum (Array + Target → Indices)
- Input: "comma,separated,numbers\\ntarget\\n"
- Output: "index1 index2" (space-separated)
- Example: input="2,7,11,15\\n9\\n" → output="0 1"

Type 2: Reverse String (String → Reversed String)
- Input: "string\\n"
- Output: "reversed_string"
- Example: input="hello\\n" → output="olleh"

Type 3: Palindrome Check (Number → Boolean)
- Input: "number\\n"
- Output: "true" or "false" (as string)
- Example: input="121\\n" → output="true"

Type 4: Sum/Count (Numbers → Number)
- Input: "numbers\\n"
- Output: "result_number"
- Example: input="1,2,3\\n" → output="6"

EXAMPLE FORMAT (DO NOT COPY - GENERATE NEW PROBLEMS):
{
  "id": 1,
  "title": "Example Problem Name",
  "description": "Clear problem description with input/output instructions",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [{"input": "example input", "output": "example output", "explanation": "why"}],
  "testCases": [
    { "input": "actual_input\\n", "expectedOutput": "expected_string_output" }
  ],
  "difficulty": "easy"
}

GENERATE ${count} UNIQUE CODING PROBLEMS:
- Use DIFFERENT problem types (arrays, strings, numbers, searching, sorting, etc.)
- Create ORIGINAL problems, NOT the examples above
- Vary difficulty and topics
- Each problem must have 3 test cases minimum
- Test cases must follow the format rules above
- ALL TITLES MUST BE UNIQUE

⚠️ FORBIDDEN PROBLEMS (DO NOT GENERATE THESE):
- Two Sum
- Reverse String  
- Palindrome Check
- Find Missing Number
- Count Occurrences
- Valid Parentheses
- Maximum Product
- Valid Anagram

✅ GENERATE THESE INSTEAD:
1. Find second largest element in array
2. Check if array is sorted
3. Find first non-repeating character
4. Calculate factorial
5. Check if number is prime
6. Find GCD of two numbers
7. Convert decimal to binary
8. Find longest word in string
9. Calculate power (x^n)
10. Check if two strings are rotations

Return JSON array with ${count} DIFFERENT problems.

CRITICAL REQUIREMENTS:
1. Generate COMPLETELY DIFFERENT problems each time
2. Use random seed: ${Date.now()}_${Math.random()}
3. Vary problem types, difficulty, and topics
4. DO NOT repeat the same problem patterns
5. Problem description MUST explain input/output format clearly
6. ALL TITLES MUST BE UNIQUE - no duplicates allowed

TOPIC DISTRIBUTION CHECKLIST (REQUIRED):
- Arrays: at least 1 problem
- Strings: at least 1 problem  
- Math: at least 1 problem
- Searching: at least 1 problem

DESCRIPTION TEMPLATE:
"[Problem statement]. Read input as [format], process it, and print the result as [format]."

Example: "Given an array of comma-separated integers, find the missing number. Read the array from input (comma-separated), find the missing number in range [0,n], and print the missing number."

Make sure students know:
- HOW to read the input (comma-separated? space-separated? multiple lines?)
- WHAT to print (just the number? space-separated? string?)
- EXACT format expected

Return ONLY valid JSON array starting with [ and ending with ]. No markdown, no explanations.`
    } else if (section === "mcq1") {
      temperature = 0.7
      useStreaming = false
      
      prompt = `Generate ${count} General & Technical multiple choice questions in JSON format. Include topics like:
- General knowledge
- Basic science
- Technology fundamentals
- Mathematics
- Logical reasoning

Each question should have:
- id: number (1, 2, etc.)
- text: string (the question)
- options: array of 4 strings (A, B, C, D)
- correctAnswer: string (the correct option text)
- type: "multiple-choice"
- category: string (e.g., "General Knowledge", "Science", "Technology")

ALL QUESTIONS MUST BE UNIQUE. Use seed: ${Date.now()}_${Math.random()}

Return ONLY valid JSON array, no markdown.

Example:
[
  {
    "id": 1,
    "text": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correctAnswer": "Paris",
    "type": "multiple-choice",
    "category": "General Knowledge"
  }
]`
    } else if (section === "mcq2") {
      temperature = 0.7
      useStreaming = false
      
      prompt = `Generate ${count} Coding & Programming multiple choice questions in JSON format. Include topics like:
- Data structures (arrays, linked lists, trees, graphs)
- Algorithms (sorting, searching, dynamic programming)
- Time complexity (Big O notation)
- Programming concepts (OOP, recursion, etc.)
- Code output prediction
- Debugging

Each question should have:
- id: number
- text: string (the question, can include code snippets)
- options: array of 4 strings
- correctAnswer: string
- type: "multiple-choice"
- category: string (e.g., "Data Structures", "Algorithms", "Code Output")
- codeSnippet: string (optional, if showing code)

ALL QUESTIONS MUST BE UNIQUE. Use seed: ${Date.now()}_${Math.random()}

Return ONLY valid JSON array, no markdown.

Example:
[
  {
    "id": 1,
    "text": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "correctAnswer": "O(log n)",
    "type": "multiple-choice",
    "category": "Algorithms",
    "codeSnippet": ""
  }
]`
    } else if (section === "mcq3") {
      temperature = 0.7
      useStreaming = false
      
      prompt = `Generate ${count} English Language multiple choice questions in JSON format. Include topics like:
- Grammar (tenses, articles, prepositions)
- Vocabulary (synonyms, antonyms)
- Sentence correction
- Reading comprehension
- Parts of speech

Each question should have:
- id: number
- text: string
- options: array of 4 strings
- correctAnswer: string
- type: "multiple-choice"
- category: string (e.g., "Grammar", "Vocabulary", "Comprehension")

ALL QUESTIONS MUST BE UNIQUE. Use seed: ${Date.now()}_${Math.random()}

Return ONLY valid JSON array, no markdown.

Example:
[
  {
    "id": 1,
    "text": "Choose the correct synonym for 'Happy':",
    "options": ["Sad", "Joyful", "Angry", "Tired"],
    "correctAnswer": "Joyful",
    "type": "multiple-choice",
    "category": "Vocabulary"
  }
]`
    }

    if (process.env.NODE_ENV !== 'production') {
      logger.info("Calling AI API", { 
        urlLength: API_URL.length,
        modelLength: MODEL.length,
        temperature,
        streaming: useStreaming
      })
    }
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        provider: PROVIDER,
        messages: [
          {
            role: "system",
            content: "You are a creative question generator. Generate completely unique and varied problems. Return ONLY valid JSON array, no markdown, no explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature,
        top_p: 0.9,
        stream: useStreaming,
      }),
    })

    logger.info("AI API response received", { status: response.status })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error("AI API failed", { status: response.status, errorLength: errorText.length })
      throw new Error(`API failed: ${response.status}`)
    }

    // Create a TransformStream to handle streaming
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // If not streaming, handle as regular response
    if (!useStreaming) {
      if (process.env.NODE_ENV !== 'production') {
        logger.info("Processing non-streaming response")
      }
      const text = await response.text()
      
      try {
        const data = JSON.parse(text)
        const content = data.choices?.[0]?.message?.content || ""
        
        if (process.env.NODE_ENV !== 'production') {
          logger.info("Content extracted", { contentLength: content.length })
        }
        
        // Clean and parse the content - strict checks
        let jsonStr = content.trim()
        
        // Remove markdown fences
        if (jsonStr.startsWith("```json")) {
          jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "")
        } else if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/```\n?/g, "")
        }
        
        jsonStr = jsonStr.trim()
        
        // Strict validation: must start with [ and end with ]
        if (!jsonStr.startsWith("[") || !jsonStr.endsWith("]")) {
          if (process.env.NODE_ENV !== 'production') {
            logger.error("Invalid JSON format", { 
              startsWithBracket: jsonStr.startsWith("["),
              endsWithBracket: jsonStr.endsWith("]"),
              preview: jsonStr.substring(0, 100)
            })
          }
          throw new Error("Response does not contain valid JSON array")
        }
        
        let questions = JSON.parse(jsonStr)
        
        if (!Array.isArray(questions)) {
          throw new Error("Parsed result is not an array")
        }
        
        // Deduplicate questions
        const originalCount = questions.length
        questions = deduplicateQuestions(questions)
        if (questions.length < originalCount && process.env.NODE_ENV !== 'production') {
          logger.warn("Duplicates removed", { original: originalCount, unique: questions.length })
        }
        
        if (process.env.NODE_ENV !== 'production') {
          logger.info("Successfully parsed questions", { count: questions.length })
        }
        
        // Validate questions based on section type
        if (section !== "coding") {
          const errors: string[] = []
          questions.forEach((q: any, idx: number) => {
            const error = validateMCQQuestion(q, idx + 1)
            if (error) errors.push(error)
          })
          
          if (errors.length > 0) {
            if (process.env.NODE_ENV !== 'production') {
              logger.error("Validation failed", { errorCount: errors.length })
            }
            const errorEvent: SSEErrorEvent = {
              type: "error",
              message: "Invalid question format",
              details: errors.slice(0, 3).join("; "), // Only first 3 errors
              shouldRetry: retryAttempt < 2
            }
            
            const stream = new ReadableStream({
              start(controller) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
                controller.close()
              }
            })
            
            return new Response(stream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
              },
            })
          }
          
          if (process.env.NODE_ENV !== 'production') {
            logger.info("Validation passed", { count: questions.length })
          }
        }
        
        const completeEvent: SSECompleteEvent = {
          type: "complete",
          questions
        }
        
        const stream = new ReadableStream({
          start(controller) {
            // Send requestId first
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "init", requestId })}\n\n`))
            // Send complete event
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeEvent)}\n\n`))
            controller.close()
          }
        })
        
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        })
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e)
        if (process.env.NODE_ENV !== 'production') {
          logger.error("Failed to parse response", { error: errorMsg })
        }
        
        const errorEvent: SSEErrorEvent = {
          type: "error",
          message: "Failed to parse response",
          details: errorMsg,
          shouldRetry: retryAttempt < 2
        }
        
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
            controller.close()
          }
        })
        
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        })
      }
    }

    // Streaming mode (currently not used but kept for future)
    logger.info("Starting streaming mode")
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          const errorEvent: SSEErrorEvent = {
            type: "error",
            message: "No reader available",
            shouldRetry: true
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          controller.close()
          return
        }

        // Send requestId first
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "init", requestId })}\n\n`))

        let buffer = ""
        let partialQuestions: any[] = []

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              logger.info("Stream complete")
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim()
                if (data === "[DONE]" || data === "") continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ""
                  
                  if (content) {
                    buffer += content
                    
                    // Try to parse partial JSON periodically
                    if (buffer.length % 500 === 0) {
                      try {
                        let jsonStr = buffer.trim()
                        if (jsonStr.startsWith("```json")) {
                          jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "")
                        }
                        
                        const jsonMatch = jsonStr.match(/\[[\s\S]*?\{[\s\S]*?\}[\s\S]*?\]/)
                        if (jsonMatch) {
                          const questions = JSON.parse(jsonMatch[0])
                          if (Array.isArray(questions) && questions.length > partialQuestions.length) {
                            partialQuestions = questions
                            
                            const partialEvent: SSEPartialEvent = {
                              type: "partial",
                              questions: partialQuestions,
                              count: partialQuestions.length
                            }
                            
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify(partialEvent)}\n\n`))
                          }
                        }
                      } catch {
                        // Ignore parse errors during streaming
                      }
                    }
                  }
                } catch {
                  // Ignore chunk parse errors
                }
              }
            }
          }

          // Parse final buffer
          try {
            let jsonStr = buffer.trim()
            if (jsonStr.startsWith("```json")) {
              jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "")
            }

            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
              jsonStr = jsonMatch[0]
            }

            let questions = JSON.parse(jsonStr)
            
            // Deduplicate
            questions = deduplicateQuestions(questions)
            
            logger.info("Successfully parsed final questions", { count: questions.length })
            
            const completeEvent: SSECompleteEvent = {
              type: "complete",
              questions
            }
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeEvent)}\n\n`))
          } catch (e) {
            logger.error("Failed to parse final JSON", { error: e instanceof Error ? e.message : String(e) })
            
            const errorEvent: SSEErrorEvent = {
              type: "error",
              message: "Failed to parse JSON",
              details: e instanceof Error ? e.message : String(e),
              shouldRetry: retryAttempt < 2
            }
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          }

          controller.close()
        } catch (error) {
          logger.error("Stream error", { error: error instanceof Error ? error.message : String(error) })
          
          const errorEvent: SSEErrorEvent = {
            type: "error",
            message: "Stream error",
            details: error instanceof Error ? error.message : String(error),
            shouldRetry: retryAttempt < 2
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    logger.error("Top-level error", { error: error instanceof Error ? error.message : String(error) })
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate questions", 
        details: error instanceof Error ? error.message : String(error),
        requestId 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
