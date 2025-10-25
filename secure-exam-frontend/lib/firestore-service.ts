"use client"

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import type {
  ExamSession,
  QuestionDocument,
  AnswerDocument,
  ViolationDocument,
  ExamResult,
  SectionType,
  ViolationType,
  QuestionStatus,
  CodeSubmission,
} from "./types/exam-types"

// Collection names
const COLLECTIONS = {
  EXAM_SESSIONS: "examSessions",
  EXAM_RESULTS: "examResults",
} as const

// Subcollection names
const SUBCOLLECTIONS = {
  QUESTIONS: "questions",
  ANSWERS: "answers",
  VIOLATIONS: "violations",
} as const

// ============================================================================
// EXAM SESSION OPERATIONS
// ============================================================================

/**
 * Create a new exam session
 */
export async function createExamSession(
  examId: string,
  userId: string,
  userEmail: string
): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    
    // Check if session already exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("⚠️ [FIRESTORE] Exam session already exists:", examId)
      }
      return true // Session already exists, consider it success
    }
    
    const examSession: ExamSession = {
      examId,
      userId,
      userEmail,
      startTime: Timestamp.now(),
      endTime: null,
      status: "in-progress",
      totalDuration: 0,
      sectionsCompleted: {
        mcq1: false,
        mcq2: false,
        mcq3: false,
        coding: false,
      },
      sectionTimestamps: {},
      totalQuestions: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      totalScore: 0,
      violationSummary: {
        tabSwitch: 0,
        personOutOfFrame: 0,
        voiceDetection: 0,
        lookingAway: 0,
        headphonesDetected: false,
        totalViolations: 0,
        flagged: false,
      },
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(docRef, examSession)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log("✅ [FIRESTORE] Created exam session:", examId)
    }
    
    return true
  } catch (error) {
    console.error("❌ [FIRESTORE] Failed to create exam session:", error)
    
    // Provide specific error messages
    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        throw new Error("Permission denied: Unable to create exam session. Please check authentication.")
      } else if (error.message.includes("network")) {
        throw new Error("Network error: Unable to create exam session. Please check your internet connection.")
      }
    }
    
    throw new Error("Failed to create exam session. Please try again.")
  }
}

/**
 * Get exam session by ID
 */
export async function getExamSession(examId: string): Promise<ExamSession | null> {
  const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data() as ExamSession
  }
  return null
}

/**
 * Update exam session
 */
export async function updateExamSession(
  examId: string,
  updates: Partial<ExamSession>,
  createIfMissing: boolean = false
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    const docSnap = await getDoc(docRef)
    
    // Check if session exists
    if (!docSnap.exists()) {
      if (createIfMissing) {
        throw new Error(`Cannot update exam session ${examId}: Session does not exist. Please create the session first.`)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`⚠️ [FIRESTORE] Exam session ${examId} doesn't exist yet, skipping update`)
        }
        return
      }
    }
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    if (process.env.NODE_ENV !== 'production') {
      console.log("✅ [FIRESTORE] Updated exam session:", examId)
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ [FIRESTORE] Failed to update exam session:`, error)
    }
    throw error
  }
}

/**
 * Verify session exists (helper function)
 */
async function verifySessionExists(examId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    throw new Error(
      `Exam session ${examId} does not exist. The session may not have been properly initialized. ` +
      `Please return to the sections page and try again.`
    )
  }
}

/**
 * Mark section as started
 */
export async function startSection(examId: string, section: SectionType): Promise<void> {
  try {
    await verifySessionExists(examId)
    
    const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    await updateDoc(docRef, {
      [`sectionTimestamps.${section}.startTime`]: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [FIRESTORE] Started section ${section} for exam:`, examId)
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ [FIRESTORE] Failed to start section:`, error)
    }
    throw error
  }
}

/**
 * Mark section as completed
 */
export async function completeSection(examId: string, section: SectionType): Promise<void> {
  try {
    await verifySessionExists(examId)
    
    const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    await updateDoc(docRef, {
      [`sectionsCompleted.${section}`]: true,
      [`sectionTimestamps.${section}.endTime`]: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [FIRESTORE] Completed section ${section} for exam:`, examId)
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`❌ [FIRESTORE] Failed to complete section:`, error)
    }
    throw error
  }
}

/**
 * Subscribe to exam session changes
 */
export function subscribeToExamSession(
  examId: string,
  callback: (session: ExamSession | null) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ExamSession)
    } else {
      callback(null)
    }
  })
}

// ============================================================================
// QUESTION OPERATIONS
// ============================================================================

/**
 * Save questions for a section
 */
export async function saveQuestions(
  examId: string,
  section: SectionType,
  questions: any[]
): Promise<void> {
  try {
    // Verify session exists before saving questions
    await verifySessionExists(examId)
    
    const batch = writeBatch(db)
    
    questions.forEach((q, index) => {
      const questionDoc: any = {
        questionId: `${section}_q${q.id || index + 1}`,
        section,
        questionNumber: q.id || index + 1,
        type: section === "coding" ? "coding" : "mcq",
        title: q.title || q.text || "",
        source: q.source || "ai",
        createdAt: Timestamp.now(),
      }
      
      // Only add fields if they're not undefined
      if (q.description !== undefined) questionDoc.description = q.description
      if (q.options !== undefined) questionDoc.options = q.options
      if (q.correctAnswer !== undefined) questionDoc.correctAnswer = q.correctAnswer
      if (q.answer !== undefined) questionDoc.correctAnswer = q.answer
      if (q.constraints !== undefined) questionDoc.constraints = q.constraints
      if (q.examples !== undefined) questionDoc.examples = q.examples
      if (q.testCases !== undefined) questionDoc.testCases = q.testCases
      if (q.difficulty !== undefined) questionDoc.difficulty = q.difficulty
      if (q.tags !== undefined) questionDoc.tags = q.tags
      
      const docRef = doc(
        db,
        COLLECTIONS.EXAM_SESSIONS,
        examId,
        SUBCOLLECTIONS.QUESTIONS,
        questionDoc.questionId
      )
      batch.set(docRef, questionDoc)
    })
    
    await batch.commit()
    
    // Update total questions count
    const sessionRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    await updateDoc(sessionRef, {
      totalQuestions: questions.length,
      updatedAt: serverTimestamp(),
    })
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ [FIRESTORE] Saved ${questions.length} questions for ${section}`)
    }
  } catch (error) {
    console.error(`❌ [FIRESTORE] Failed to save questions:`, error)
    throw error
  }
}

/**
 * Get questions for a section
 */
export async function getQuestions(
  examId: string,
  section: SectionType
): Promise<QuestionDocument[]> {
  const q = query(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.QUESTIONS),
    where("section", "==", section),
    orderBy("questionNumber")
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as QuestionDocument)
}

// ============================================================================
// ANSWER OPERATIONS
// ============================================================================

/**
 * Save or update an answer
 */
export async function saveAnswer(
  examId: string,
  questionId: string,
  section: SectionType,
  questionNumber: number,
  userAnswer: string | null,
  status: QuestionStatus,
  markedForReview: boolean,
  timeSpent: number = 0
): Promise<void> {
  try {
    // Verify session exists before saving answer
    await verifySessionExists(examId)
    
    const answerId = `${section}_a${questionNumber}`
    const docRef = doc(
      db,
      COLLECTIONS.EXAM_SESSIONS,
      examId,
      SUBCOLLECTIONS.ANSWERS,
      answerId
    )
    
    // Check if answer exists
    const docSnap = await getDoc(docRef)
    const now = Timestamp.now()
    
    if (docSnap.exists()) {
      // Update existing answer
      const updateData: any = {
        status,
        markedForReview,
        timeSpent,
        lastModifiedAt: now,
        updatedAt: now,
      }
      
      // Only add userAnswer if it's not undefined
      if (userAnswer !== undefined) {
        updateData.userAnswer = userAnswer
      }
      
      await updateDoc(docRef, updateData)
    } else {
      // Create new answer
      const answerDoc: any = {
        answerId,
        questionId,
        section,
        questionNumber,
        status,
        markedForReview,
        timeSpent,
        firstVisitedAt: now,
        lastModifiedAt: now,
        createdAt: now,
        updatedAt: now,
      }
      
      // Only add userAnswer if it's not undefined
      if (userAnswer !== undefined) {
        answerDoc.userAnswer = userAnswer
      }
      
      await setDoc(docRef, answerDoc)
    }
    
    // Update exam session answered count
    await updateAnsweredCount(examId)
  } catch (error) {
    console.error(`❌ [FIRESTORE] Failed to save answer:`, error)
    throw error
  }
}

/**
 * Save code submission
 */
export async function saveCodeSubmission(
  examId: string,
  questionId: string,
  section: SectionType,
  questionNumber: number,
  submission: CodeSubmission
): Promise<void> {
  const answerId = `${section}_a${questionNumber}`
  const docRef = doc(
    db,
    COLLECTIONS.EXAM_SESSIONS,
    examId,
    SUBCOLLECTIONS.ANSWERS,
    answerId
  )
  
  const docSnap = await getDoc(docRef)
  const now = Timestamp.now()
  
  if (docSnap.exists()) {
    const data = docSnap.data() as AnswerDocument
    const submissions = data.codeSubmissions || []
    submissions.push(submission)
    
    await updateDoc(docRef, {
      codeSubmissions: submissions,
      userAnswer: submission.code,
      lastModifiedAt: now,
      updatedAt: now,
    })
  } else {
    const answerDoc: AnswerDocument = {
      answerId,
      questionId,
      section,
      questionNumber,
      userAnswer: submission.code,
      status: "answered",
      markedForReview: false,
      timeSpent: 0,
      codeSubmissions: [submission],
      firstVisitedAt: now,
      lastModifiedAt: now,
      createdAt: now,
      updatedAt: now,
    }
    await setDoc(docRef, answerDoc)
  }
}

/**
 * Get all answers for exam
 */
export async function getAnswers(examId: string): Promise<AnswerDocument[]> {
  const querySnapshot = await getDocs(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.ANSWERS)
  )
  return querySnapshot.docs.map(doc => doc.data() as AnswerDocument)
}

/**
 * Update answered count in exam session
 */
async function updateAnsweredCount(examId: string): Promise<void> {
  try {
    const sessionRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
    const sessionSnap = await getDoc(sessionRef)
    
    // Only update if session exists
    if (!sessionSnap.exists()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`⚠️ [FIRESTORE] Exam session ${examId} doesn't exist yet, skipping answer count update`)
      }
      return
    }
    
    const answers = await getAnswers(examId)
    const answeredCount = answers.filter(a => a.userAnswer !== null && a.userAnswer !== "").length
    
    await updateDoc(sessionRef, {
      totalAnswered: answeredCount,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    // Silently fail if session doesn't exist
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️ [FIRESTORE] Failed to update answer count:`, error)
    }
  }
}

// ============================================================================
// VIOLATION OPERATIONS
// ============================================================================

/**
 * Log a violation
 */
export async function logViolation(
  examId: string,
  type: ViolationType,
  section: SectionType,
  description: string,
  severity: "low" | "medium" | "high" = "medium",
  duration?: number
): Promise<void> {
  const violationId = `${type}_${Date.now()}`
  const violation: any = {
    violationId,
    type,
    timestamp: Timestamp.now(),
    section,
    severity,
    description,
    resolved: false,
    createdAt: Timestamp.now(),
  }
  
  // Only add duration if it's defined
  if (duration !== undefined) {
    violation.duration = duration
  }
  
  const docRef = doc(
    db,
    COLLECTIONS.EXAM_SESSIONS,
    examId,
    SUBCOLLECTIONS.VIOLATIONS,
    violationId
  )
  await setDoc(docRef, violation)
  
  // Update violation summary
  await updateViolationSummary(examId, type)
}

/**
 * Update violation summary in exam session
 */
async function updateViolationSummary(
  examId: string,
  type: ViolationType
): Promise<void> {
  const sessionRef = doc(db, COLLECTIONS.EXAM_SESSIONS, examId)
  const sessionSnap = await getDoc(sessionRef)
  
  if (sessionSnap.exists()) {
    const session = sessionSnap.data() as ExamSession
    const summary = session.violationSummary
    
    // Update specific violation count
    switch (type) {
      case "tab-switch":
        summary.tabSwitch++
        break
      case "out-of-frame":
        summary.personOutOfFrame++
        break
      case "voice-detected":
        summary.voiceDetection++
        break
      case "looking-away":
        summary.lookingAway++
        break
      case "headphones":
        summary.headphonesDetected = true
        break
    }
    
    summary.totalViolations++
    
    // Flag if violations exceed thresholds
    if (
      summary.tabSwitch >= 3 ||
      summary.personOutOfFrame >= 5 ||
      summary.voiceDetection >= 3 ||
      summary.lookingAway >= 10
    ) {
      summary.flagged = true
    }
    
    await updateDoc(sessionRef, {
      violationSummary: summary,
      updatedAt: serverTimestamp(),
    })
  }
}

/**
 * Get all violations for exam
 */
export async function getViolations(examId: string): Promise<ViolationDocument[]> {
  const q = query(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.VIOLATIONS),
    orderBy("timestamp", "desc")
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as ViolationDocument)
}

/**
 * Subscribe to violations
 */
export function subscribeToViolations(
  examId: string,
  callback: (violations: ViolationDocument[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.VIOLATIONS),
    orderBy("timestamp", "desc")
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const violations = querySnapshot.docs.map(doc => doc.data() as ViolationDocument)
    callback(violations)
  })
}

// ============================================================================
// EXAM RESULT OPERATIONS
// ============================================================================

/**
 * Calculate and save exam result
 */
export async function calculateAndSaveResult(examId: string): Promise<ExamResult> {
  const session = await getExamSession(examId)
  if (!session) {
    throw new Error(
      `Exam session not found (ID: ${examId}). ` +
      `The session may not have been properly initialized. ` +
      `Please ensure you started the exam from the sections page.`
    )
  }
  
  const questions = await getDocs(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.QUESTIONS)
  )
  const answers = await getAnswers(examId)
  
  // Calculate scores per section
  const sectionScores = {
    mcq1: calculateSectionScore("mcq1", questions.docs, answers),
    mcq2: calculateSectionScore("mcq2", questions.docs, answers),
    mcq3: calculateSectionScore("mcq3", questions.docs, answers),
    coding: calculateSectionScore("coding", questions.docs, answers),
  }
  
  const totalScore = Object.values(sectionScores).reduce((sum, s) => sum + s.score, 0)
  const maxScore = Object.values(sectionScores).reduce((sum, s) => sum + s.maxScore, 0)
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
  
  const result: ExamResult = {
    resultId: examId,
    examId,
    userId: session.userId,
    userEmail: session.userEmail,
    totalScore,
    maxScore,
    percentage,
    grade: calculateGrade(percentage),
    sectionScores,
    totalQuestions: questions.size,
    totalAnswered: answers.filter(a => a.userAnswer).length,
    totalCorrect: answers.filter(a => a.isCorrect).length,
    totalIncorrect: answers.filter(a => a.isCorrect === false).length,
    totalSkipped: questions.size - answers.filter(a => a.userAnswer).length,
    totalTimeTaken: session.totalDuration,
    averageTimePerQuestion: answers.length > 0 
      ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length 
      : 0,
    violationCount: session.violationSummary.totalViolations,
    violationPenalty: calculateViolationPenalty(session.violationSummary.totalViolations),
    flaggedForReview: session.violationSummary.flagged,
    submittedAt: Timestamp.now(),
    evaluatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  }
  
  await setDoc(doc(db, COLLECTIONS.EXAM_RESULTS, examId), result)
  
  // Update exam session status
  await updateDoc(doc(db, COLLECTIONS.EXAM_SESSIONS, examId), {
    status: "submitted",
    endTime: serverTimestamp(),
    totalScore: result.totalScore,
    totalCorrect: result.totalCorrect,
    updatedAt: serverTimestamp(),
  })
  
  if (process.env.NODE_ENV !== 'production') {
    console.log("✅ [FIRESTORE] Calculated and saved result:", examId)
  }
  
  return result
}

/**
 * Calculate section score
 */
function calculateSectionScore(
  section: SectionType,
  questions: any[],
  answers: AnswerDocument[]
): any {
  const sectionQuestions = questions.filter(q => q.data().section === section)
  const sectionAnswers = answers.filter(a => a.section === section)
  
  let correct = 0
  let incorrect = 0
  let skipped = 0
  let totalTime = 0
  
  sectionQuestions.forEach(q => {
    const questionData = q.data() as QuestionDocument
    const answer = sectionAnswers.find(a => a.questionId === questionData.questionId)
    
    if (!answer || !answer.userAnswer) {
      skipped++
    } else {
      totalTime += answer.timeSpent
      if (answer.userAnswer === questionData.correctAnswer) {
        correct++
      } else {
        incorrect++
      }
    }
  })
  
  const maxScore = sectionQuestions.length
  const score = correct
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
  
  return {
    score,
    maxScore,
    percentage,
    questionsAnswered: sectionAnswers.filter(a => a.userAnswer).length,
    questionsCorrect: correct,
    questionsIncorrect: incorrect,
    questionsSkipped: skipped,
    averageTimePerQuestion: sectionAnswers.length > 0 ? totalTime / sectionAnswers.length : 0,
  }
}

/**
 * Calculate grade based on percentage
 */
function calculateGrade(percentage: number): "A+" | "A" | "B+" | "B" | "C" | "D" | "F" {
  if (percentage >= 95) return "A+"
  if (percentage >= 90) return "A"
  if (percentage >= 85) return "B+"
  if (percentage >= 80) return "B"
  if (percentage >= 70) return "C"
  if (percentage >= 60) return "D"
  return "F"
}

/**
 * Calculate violation penalty
 */
function calculateViolationPenalty(violationCount: number): number {
  return Math.min(violationCount * 2, 20) // Max 20 points penalty
}

/**
 * Get exam result
 */
export async function getExamResult(examId: string): Promise<ExamResult | null> {
  const docRef = doc(db, COLLECTIONS.EXAM_RESULTS, examId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data() as ExamResult
  }
  return null
}

/**
 * Get user's exam history
 */
export async function getUserExamHistory(
  userId: string,
  limitCount: number = 10
): Promise<ExamSession[]> {
  const q = query(
    collection(db, COLLECTIONS.EXAM_SESSIONS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => doc.data() as ExamSession)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Delete exam session and all related data
 */
export async function deleteExamSession(examId: string): Promise<void> {
  const batch = writeBatch(db)
  
  // Delete questions
  const questions = await getDocs(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.QUESTIONS)
  )
  questions.docs.forEach(doc => batch.delete(doc.ref))
  
  // Delete answers
  const answers = await getDocs(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.ANSWERS)
  )
  answers.docs.forEach(doc => batch.delete(doc.ref))
  
  // Delete violations
  const violations = await getDocs(
    collection(db, COLLECTIONS.EXAM_SESSIONS, examId, SUBCOLLECTIONS.VIOLATIONS)
  )
  violations.docs.forEach(doc => batch.delete(doc.ref))
  
  // Delete exam session
  batch.delete(doc(db, COLLECTIONS.EXAM_SESSIONS, examId))
  
  // Delete result if exists
  batch.delete(doc(db, COLLECTIONS.EXAM_RESULTS, examId))
  
  await batch.commit()
  
  if (process.env.NODE_ENV !== 'production') {
    console.log("✅ [FIRESTORE] Deleted exam session:", examId)
  }
}
