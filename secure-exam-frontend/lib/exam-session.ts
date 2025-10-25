// Exam Session Management with LocalStorage Caching

export interface ExamSession {
  examId: string
  startTime: number
  sections: {
    mcq1?: any[]
    mcq2?: any[]
    mcq3?: any[]
    coding?: any[]
  }
  // Track seen question titles for deduplication across retries
  seenTitles?: Set<string>
}

const STORAGE_KEY = "exam_session"
const EXAM_ID_KEY = "current_exam_id"

// Generate unique exam ID
export function generateExamId(): string {
  return `exam_${Date.now()}_${Math.random().toString(36).substring(7)}`
}

// Get current exam ID or create new one
export function getCurrentExamId(): string {
  if (typeof window === "undefined") return ""

  let examId = localStorage.getItem(EXAM_ID_KEY)
  if (!examId) {
    examId = generateExamId()
    localStorage.setItem(EXAM_ID_KEY, examId)
    if (process.env.NODE_ENV !== 'production') {
      console.log("🆕 [SESSION] Created new exam ID:", examId)
    }
  }
  return examId
}

// Start new exam (generates new ID)
export function startNewExam(): string {
  if (typeof window === "undefined") return ""

  const examId = generateExamId()
  localStorage.setItem(EXAM_ID_KEY, examId)
  localStorage.removeItem(STORAGE_KEY) // Clear old session
  if (process.env.NODE_ENV !== 'production') {
    console.log("🎬 [SESSION] Started new exam:", examId)
  }
  return examId
}

// Get exam session from localStorage
export function getExamSession(): ExamSession | null {
  if (typeof window === "undefined") return null

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    const parsed = JSON.parse(data) as any

    // Convert seenTitles array back to Set
    const session: ExamSession = {
      ...parsed,
      seenTitles: new Set(parsed.seenTitles || [])
    }

    return session
  } catch (error) {
    console.error("❌ [SESSION] Failed to load session:", error)
    return null
  }
}

// Save exam session to localStorage
export function saveExamSession(session: ExamSession): void {
  if (typeof window === "undefined") return

  try {
    // Convert Set to Array for JSON serialization
    const sessionToSave = {
      ...session,
      seenTitles: session.seenTitles ? Array.from(session.seenTitles) : []
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionToSave))
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("❌ [SESSION] Failed to save session:", error)
    }
  }
}

// Get questions for a specific section
export function getSectionQuestions(section: string): any[] | null {
  const session = getExamSession()
  if (!session) return null

  const questions = session.sections[section as keyof typeof session.sections]
  return questions || null
}

// Normalize title for deduplication
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Save questions for a specific section with deduplication
export function saveSectionQuestions(section: string, questions: any[]): void {
  const examId = getCurrentExamId()
  let session = getExamSession()

  if (!session || session.examId !== examId) {
    // Create new session
    session = {
      examId,
      startTime: Date.now(),
      sections: {},
      seenTitles: new Set()
    }
  }

  // Initialize seenTitles if not present
  if (!session.seenTitles) {
    session.seenTitles = new Set()
  }

  // Deduplicate questions against session history
  const dedupedQuestions = questions.filter(q => {
    const title = q.title || q.text || ''
    const normalized = normalizeTitle(title)

    if (session.seenTitles!.has(normalized)) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`⚠️ [SESSION] Skipping duplicate: ${title}`)
      }
      return false
    }

    session.seenTitles!.add(normalized)
    return true
  })

  session.sections[section as keyof typeof session.sections] = dedupedQuestions

  // Convert Set to Array for JSON serialization
  const sessionToSave = {
    ...session,
    seenTitles: Array.from(session.seenTitles)
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionToSave))
      if (process.env.NODE_ENV !== 'production') {
        console.log(`💾 [SESSION] Saved ${dedupedQuestions.length} questions for ${section}`)
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("❌ [SESSION] Failed to save session:", error)
      }
    }
  }
}

// Check if all sections are loaded
export function areAllSectionsLoaded(): boolean {
  const session = getExamSession()
  if (!session) return false

  const required = ["mcq1", "mcq2", "mcq3", "coding"]
  const loaded = required.every(section => {
    const questions = session.sections[section as keyof typeof session.sections]
    return questions && questions.length > 0
  })

  return loaded
}

// Clear exam session (for testing)
export function clearExamSession(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(EXAM_ID_KEY)
  if (process.env.NODE_ENV !== 'production') {
    console.log("🗑️ [SESSION] Cleared exam session")
  }
}
