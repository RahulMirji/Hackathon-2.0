// Type definitions for exam data structures

import { Timestamp } from "firebase/firestore"

// Exam Session Status
export type ExamStatus = "in-progress" | "completed" | "submitted" | "flagged" | "violated"

// Question Status
export type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked-review" | "answered-marked"

// Section Types
export type SectionType = "mcq1" | "mcq2" | "mcq3" | "coding"

// Question Types
export type QuestionType = "mcq" | "coding"

// Difficulty Levels
export type DifficultyLevel = "easy" | "medium" | "hard"

// Question Source
export type QuestionSource = "ai" | "mock" | "cache"

// Violation Types
export type ViolationType = "tab-switch" | "out-of-frame" | "voice-detected" | "looking-away" | "headphones"

// Violation Severity
export type ViolationSeverity = "low" | "medium" | "high"

// Grade
export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F"

// Exam Session
export interface ExamSession {
  examId: string
  userId: string
  userEmail: string
  startTime: Timestamp
  endTime: Timestamp | null
  status: ExamStatus
  totalDuration: number // minutes
  
  sectionsCompleted: {
    mcq1: boolean
    mcq2: boolean
    mcq3: boolean
    coding: boolean
  }
  
  sectionTimestamps: {
    mcq1?: { startTime: Timestamp; endTime?: Timestamp }
    mcq2?: { startTime: Timestamp; endTime?: Timestamp }
    mcq3?: { startTime: Timestamp; endTime?: Timestamp }
    coding?: { startTime: Timestamp; endTime?: Timestamp }
  }
  
  totalQuestions: number
  totalAnswered: number
  totalCorrect: number
  totalScore: number
  
  violationSummary: {
    tabSwitch: number
    personOutOfFrame: number
    voiceDetection: number
    lookingAway: number
    headphonesDetected: boolean
    totalViolations: number
    flagged: boolean
  }
  
  // Browser/Device info
  browserInfo?: {
    userAgent: string
    platform: string
    language: string
    screenResolution: string
  }
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Question Document
export interface QuestionDocument {
  questionId: string
  section: SectionType
  questionNumber: number
  type: QuestionType
  
  // Question content
  title: string
  description?: string
  options?: string[]
  correctAnswer?: string
  
  // Coding specific
  constraints?: string[]
  examples?: Array<{
    input: string
    output: string
    explanation?: string
  }>
  testCases?: Array<{
    input: string
    expectedOutput: string
    isHidden: boolean
  }>
  
  // Metadata
  difficulty?: DifficultyLevel
  tags?: string[]
  source: QuestionSource
  
  createdAt: Timestamp
}

// Test Result
export interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
  executionTime: number
}

// Code Submission
export interface CodeSubmission {
  code: string
  language: string
  timestamp: Timestamp
  testResults?: TestResult[]
  allTestsPassed?: boolean
}

// Answer Document
export interface AnswerDocument {
  answerId: string
  questionId: string
  section: SectionType
  questionNumber: number
  
  // User response
  userAnswer: string | null
  isCorrect?: boolean
  
  // Status tracking
  status: QuestionStatus
  markedForReview: boolean
  
  // Timing data
  timeSpent: number // seconds
  firstVisitedAt: Timestamp
  lastModifiedAt: Timestamp
  
  // Coding specific
  codeSubmissions?: CodeSubmission[]
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Violation Document
export interface ViolationDocument {
  violationId: string
  type: ViolationType
  timestamp: Timestamp
  section: SectionType
  
  severity: ViolationSeverity
  description: string
  
  duration?: number
  resolved?: boolean
  
  createdAt: Timestamp
}

// Section Score
export interface SectionScore {
  score: number
  maxScore: number
  percentage: number
  questionsAnswered: number
  questionsCorrect: number
  questionsIncorrect: number
  questionsSkipped: number
  averageTimePerQuestion: number
}

// Exam Result
export interface ExamResult {
  resultId: string
  examId: string
  userId: string
  userEmail: string
  
  // Overall performance
  totalScore: number
  maxScore: number
  percentage: number
  grade: Grade
  
  // Section-wise breakdown
  sectionScores: {
    mcq1: SectionScore
    mcq2: SectionScore
    mcq3: SectionScore
    coding: SectionScore
  }
  
  // Detailed statistics
  totalQuestions: number
  totalAnswered: number
  totalCorrect: number
  totalIncorrect: number
  totalSkipped: number
  
  // Time analysis
  totalTimeTaken: number // minutes
  averageTimePerQuestion: number // seconds
  
  // Violation impact
  violationCount: number
  violationPenalty: number
  flaggedForReview: boolean
  
  // Submission details
  submittedAt: Timestamp
  evaluatedAt: Timestamp
  
  createdAt: Timestamp
}

// Client-side types (without Timestamp)
export interface ExamSessionClient extends Omit<ExamSession, "startTime" | "endTime" | "createdAt" | "updatedAt" | "sectionTimestamps"> {
  startTime: Date
  endTime: Date | null
  createdAt: Date
  updatedAt: Date
  sectionTimestamps: {
    mcq1?: { startTime: Date; endTime?: Date }
    mcq2?: { startTime: Date; endTime?: Date }
    mcq3?: { startTime: Date; endTime?: Date }
    coding?: { startTime: Date; endTime?: Date }
  }
}

export interface QuestionDocumentClient extends Omit<QuestionDocument, "createdAt"> {
  createdAt: Date
}

export interface AnswerDocumentClient extends Omit<AnswerDocument, "firstVisitedAt" | "lastModifiedAt" | "createdAt" | "updatedAt" | "codeSubmissions"> {
  firstVisitedAt: Date
  lastModifiedAt: Date
  createdAt: Date
  updatedAt: Date
  codeSubmissions?: Array<Omit<CodeSubmission, "timestamp"> & { timestamp: Date }>
}

export interface ViolationDocumentClient extends Omit<ViolationDocument, "timestamp" | "createdAt"> {
  timestamp: Date
  createdAt: Date
}

export interface ExamResultClient extends Omit<ExamResult, "submittedAt" | "evaluatedAt" | "createdAt"> {
  submittedAt: Date
  evaluatedAt: Date
  createdAt: Date
}
