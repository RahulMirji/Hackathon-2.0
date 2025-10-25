"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ExamTimer } from "@/components/exam/exam-timer"
import { ExamQuestions } from "@/components/exam/exam-questions"
import { ViolationTracker } from "@/components/exam/violation-tracker"
import { AlertCircle, FileText, HelpCircle, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSectionInfo } from "@/lib/question-banks"
import { getSectionQuestions } from "@/lib/exam-session"
import { getOrLoadSectionQuestions } from "@/lib/question-service"
import { useExamSession } from "@/lib/hooks/use-exam-session"
import { useExamAnswers } from "@/lib/hooks/use-exam-answers"

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked-review" | "answered-marked"

export default function MCQ1Page() {
  const router = useRouter()
  const section = "mcq1"
  
  // State for questions
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const sectionInfo = getSectionInfo(section)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [questionStatus, setQuestionStatus] = useState<Record<number, QuestionStatus>>({})
  const [showWarning, setShowWarning] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  
  // Firestore hooks
  const { startExamSection } = useExamSession()
  const { saveAnswerDebounced, startQuestionTimer } = useExamAnswers(section)
  
  // Mark section as started in Firestore
  useEffect(() => {
    startExamSection(section)
  }, [startExamSection, section])

  // Load questions after mount
  useEffect(() => {
    const loadQuestions = async () => {
      // Check cache first
      const cachedQuestions = getSectionQuestions(section)
      if (cachedQuestions && cachedQuestions.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`📋 [MCQ1] Using cached questions for ${section}:`, cachedQuestions.length)
        }
        setQuestions(cachedQuestions)
        setIsLoading(false)
        return
      }
      
      // Load from API if not cached
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`📡 [MCQ1] Loading questions for ${section}...`)
        }
        const result = await getOrLoadSectionQuestions(section)
        setQuestions(result.questions)
        setIsLoading(false)
      } catch (error) {
        console.error(`❌ [MCQ1] Failed to load questions:`, error)
        setIsLoading(false)
        setQuestions([])
        // Redirect to sections page to preload questions
        router.push("/exam/sections")
      }
    }
    
    loadQuestions()
  }, [section, router])

  useEffect(() => {
    // Initialize all questions as not-visited
    if (questions.length > 0) {
      const initialStatus: Record<number, QuestionStatus> = {}
      questions.forEach((q) => {
        initialStatus[q.id] = "not-visited"
      })
      setQuestionStatus(initialStatus)
    }
  }, [questions])

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    // Update status based on answer
    setQuestionStatus((prev) => {
      const currentStatus = prev[questionId]
      let newStatus: QuestionStatus
      
      if (answer) {
        if (currentStatus === "marked-review") {
          newStatus = "answered-marked"
        } else {
          newStatus = "answered"
        }
      } else {
        if (currentStatus === "answered-marked") {
          newStatus = "marked-review"
        } else {
          newStatus = "not-answered"
        }
      }
      
      // Save to Firestore
      const questionIdStr = `${section}_q${questionId}`
      const markedForReview = newStatus === "marked-review" || newStatus === "answered-marked"
      saveAnswerDebounced(questionIdStr, questionId, answer, newStatus, markedForReview)
      
      return { ...prev, [questionId]: newStatus }
    })
  }

  const handleMarkForReview = (questionId: number) => {
    setQuestionStatus((prev) => {
      const hasAnswer = !!answers[questionId]
      return {
        ...prev,
        [questionId]: hasAnswer ? "answered-marked" : "marked-review",
      }
    })
  }

  const handleClearResponse = (questionId: number) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev }
      delete newAnswers[questionId]
      return newAnswers
    })

    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === "answered-marked" ? "marked-review" : "not-answered",
    }))
  }

  const handleQuestionVisit = useCallback((questionId: number) => {
    // Start timer for this question
    startQuestionTimer(questionId)
    
    setQuestionStatus((prev) => {
      if (prev[questionId] === "not-visited") {
        return { ...prev, [questionId]: "not-answered" }
      }
      return prev
    })
  }, [startQuestionTimer])

  const handleTimeUp = () => {
    setShowWarning(true)
  }

  const handleSubmit = () => {
    router.push("/exam/submission")
  }

  // Calculate statistics
  const stats = {
    answered: Object.values(questionStatus).filter((s) => s === "answered" || s === "answered-marked").length,
    notAnswered: Object.values(questionStatus).filter((s) => s === "not-answered").length,
    markedForReview: Object.values(questionStatus).filter((s) => s === "marked-review" || s === "answered-marked").length,
    notVisited: Object.values(questionStatus).filter((s) => s === "not-visited").length,
  }
  
  // Show loading state while questions are being loaded
  if (isLoading || questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <p className="text-lg font-semibold">Loading questions...</p>
          </div>
        </Card>
      </main>
    )
  }

  return (
    <main className="exam-container min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="exam-header sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">{sectionInfo.title}</h1>
              <p className="text-xs text-muted-foreground">MCQ 1 Exam</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Instructions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Exam Instructions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">General Instructions:</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Total duration: {sectionInfo.duration} minutes</li>
                      <li>Total questions: {questions.length}</li>
                      <li>All questions are mandatory</li>
                      <li>You can navigate between questions using Previous/Next buttons</li>
                      <li>Use "Mark for Review" to flag questions you want to revisit</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Question Status Legend:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs">Not Visited</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-500" />
                        <span className="text-xs">Not Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-green-500" />
                        <span className="text-xs">Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-purple-500" />
                        <span className="text-xs">Marked for Review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-green-500 border-2 border-purple-500" />
                        <span className="text-xs">Answered & Marked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSubmit} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
              <Send className="h-4 w-4" />
              Submit Exam
            </Button>

            <ExamTimer totalMinutes={sectionInfo.duration} onTimeUp={handleTimeUp} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_2.3fr_0.85fr] gap-4 h-full">
          {/* Left Sidebar - Question Palette */}
          <div className="h-full overflow-hidden pr-2">
            <div className="space-y-3 h-full flex flex-col">
              {/* Question Palette Card */}
              <Card className="exam-card shadow-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-1 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 -mx-6 -mt-6 mb-3 rounded-t-lg">
                  <h3 className="font-bold text-sm">Question Palette</h3>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {questions.map((q) => {
                    const status = questionStatus[q.id] || "not-visited"
                    let bgColor = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    let borderColor = ""
                    let shadowClass = ""

                    if (status === "answered") {
                      bgColor = "bg-green-500 text-white"
                      shadowClass = "shadow-md shadow-green-200 dark:shadow-green-900/50"
                    } else if (status === "not-answered") {
                      bgColor = "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400"
                      borderColor = "border-2 border-red-500"
                      shadowClass = "shadow-md shadow-red-100 dark:shadow-red-900/50"
                    } else if (status === "marked-review") {
                      bgColor = "bg-purple-500 text-white"
                      shadowClass = "shadow-md shadow-purple-200 dark:shadow-purple-900/50"
                    } else if (status === "answered-marked") {
                      bgColor = "bg-green-500 text-white"
                      borderColor = "border-2 border-purple-500"
                      shadowClass = "shadow-md shadow-green-200 dark:shadow-green-900/50"
                    }

                    return (
                      <button
                        key={q.id}
                        className={`h-9 w-9 rounded-md font-bold text-xs hover:scale-105 transition-all duration-200 ${bgColor} ${borderColor} ${shadowClass}`}
                        onClick={() => {
                          const event = new CustomEvent("jumpToQuestion", { detail: q.id })
                          window.dispatchEvent(event)
                        }}
                      >
                        {q.id}
                      </button>
                    )
                  })}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 -mx-6 px-6 py-2 space-y-1">
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                      <span className="text-gray-600 dark:text-gray-400">Not Visited</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-white dark:bg-gray-800 border-2 border-red-500" />
                      <span className="text-gray-600 dark:text-gray-400">Not Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-purple-500" />
                      <span className="text-gray-600 dark:text-gray-400">Marked</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Question Statistics Card */}
              <Card className="exam-card shadow-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-1 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 -mx-6 -mt-6 mb-3 rounded-t-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-bold text-sm">Question Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-green-500 shadow-sm" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Answered</span>
                    </div>
                    <span className="text-base font-bold text-green-600 dark:text-green-400">{stats.answered}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-white dark:bg-gray-800 border-2 border-red-500 shadow-sm" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Not Answered</span>
                    </div>
                    <span className="text-base font-bold text-red-600 dark:text-red-400">{stats.notAnswered}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-purple-500 shadow-sm" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Marked</span>
                    </div>
                    <span className="text-base font-bold text-purple-600 dark:text-purple-400">{stats.markedForReview}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 shadow-sm" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Not Visited</span>
                    </div>
                    <span className="text-base font-bold text-gray-600 dark:text-gray-400">{stats.notVisited}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Center - Questions */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            <div className="space-y-4">
              {showWarning && (
                <div className="exam-alert flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">Time is running out!</p>
                    <p className="text-sm text-red-700 dark:text-red-200">You have less than 5 minutes remaining. Please submit your answers.</p>
                  </div>
                </div>
              )}

              <ExamQuestions
                questions={questions}
                answers={answers}
                questionStatus={questionStatus}
                onAnswerChange={handleAnswerChange}
                onMarkForReview={handleMarkForReview}
                onClearResponse={handleClearResponse}
                onQuestionVisit={handleQuestionVisit}
                onBackToSections={() => router.push("/exam/sections")}
              />
            </div>
          </div>

          {/* Right Sidebar - Monitoring */}
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            <div className="space-y-3">
              <Card className="exam-card p-0 overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 h-52">
                <MonitoringOverlay />
              </Card>

              {/* Violation Tracker */}
              <ViolationTracker />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}