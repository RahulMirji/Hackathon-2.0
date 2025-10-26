/**
 * Auto-submit exam on critical violations
 */

import { getCurrentExamId } from "./exam-session"
import { calculateAndSaveResult, logViolation, updateExamSession } from "./firestore-service"

export interface ExamAutoSubmitOptions {
  reason: "tab-switch" | "fullscreen-exit" | "general-violation"
  description: string
}

/**
 * Auto-submit exam with violation reason
 */
export async function autoSubmitExamOnViolation(
  options: ExamAutoSubmitOptions
): Promise<void> {
  const examId = getCurrentExamId()
  
  if (!examId) {
    console.error("❌ Cannot auto-submit: No exam ID found")
    throw new Error("No active exam session")
  }

  try {
    console.log(`⚠️ Auto-submitting exam due to: ${options.reason}`)

    // Log the violation that triggered auto-submit
    await logViolation(
      examId,
      "tab-switch", // Convert to valid ViolationType
      "mcq1", // Use a default section
      `Exam auto-submitted: ${options.description}`,
      "high"
    )

    // Mark exam session as terminated with violated status
    await updateExamSession(examId, {
      status: "violated",
      terminationReason: options.reason,
      terminatedAt: new Date(),
      violated: true,
    } as any)

    // Auto-submit the exam by calculating results
    await calculateAndSaveResult(examId)

    console.log("✓ Exam auto-submitted successfully")
    
    return Promise.resolve()
  } catch (error) {
    console.error("❌ Failed to auto-submit exam:", error)
    throw error
  }
}

/**
 * Get exam termination details
 */
export function getExamTerminationDetails(reason: string) {
  const details: Record<string, { title: string; message: string; icon: string }> = {
    "tab-switch": {
      title: "Tab Switch Detected",
      message: "You attempted to switch tabs during the exam. This violates the examination integrity terms.",
      icon: "🚫",
    },
    "fullscreen-exit": {
      title: "Fullscreen Exit Detected",
      message: "You exited fullscreen mode during the exam. Fullscreen mode must remain active throughout.",
      icon: "🚫",
    },
    "general-violation": {
      title: "Terms Violation",
      message: "You have violated the examination terms and conditions.",
      icon: "⚠️",
    },
  }

  return details[reason] || details["general-violation"]
}

/**
 * Mark exam as terminated in session storage
 */
export function markExamAsTerminated(
  reason: "tab-switch" | "fullscreen-exit" | "general-violation",
  timestamp: number = Date.now()
): void {
  const examId = getCurrentExamId()
  if (!examId) return

  const terminationData = {
    examId,
    reason,
    timestamp,
    terminated: true,
  }

  sessionStorage.setItem(
    `exam_terminated_${examId}`,
    JSON.stringify(terminationData)
  )
}

/**
 * Check if exam is already terminated
 */
export function isExamTerminated(examId: string): boolean {
  const data = sessionStorage.getItem(`exam_terminated_${examId}`)
  if (!data) return false

  try {
    const parsed = JSON.parse(data)
    return parsed.terminated === true
  } catch {
    return false
  }
}

/**
 * Get termination reason
 */
export function getTerminationReason(
  examId: string
): "tab-switch" | "fullscreen-exit" | "general-violation" | null {
  const data = sessionStorage.getItem(`exam_terminated_${examId}`)
  if (!data) return null

  try {
    const parsed = JSON.parse(data)
    return parsed.reason || null
  } catch {
    return null
  }
}
