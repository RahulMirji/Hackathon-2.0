"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, BookOpen, FileText, Clock, CheckCircle, Terminal, Loader2, AlertCircle } from "lucide-react"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ViolationTracker } from "@/components/exam/violation-tracker"
import { ExamTerminationModal } from "@/components/exam/exam-termination-modal"
import { useStrictFullscreenLock } from "@/hooks/use-strict-fullscreen-lock"
import { autoSubmitExamOnViolation, markExamAsTerminated, isExamTerminated } from "@/lib/exam-auto-submit"
import { 
  getCurrentExamId, 
  getSectionQuestions,
  areAllSectionsLoaded,
} from "@/lib/exam-session"
import { getOrLoadSectionQuestions } from "@/lib/question-service"
import { createLogger } from "@/lib/utils"
import { useExamSession } from "@/lib/hooks/use-exam-session"
import { useAuth } from "@/lib/auth-context"

export default function ExamSectionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { examSession, startExam, loading: sessionLoading } = useExamSession()
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({})
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({})
  const [questionSources, setQuestionSources] = useState<Record<string, "api" | "mock" | "cache" | "ai">>({})
  const [allLoaded, setAllLoaded] = useState(false)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
  const [showTerminationModal, setShowTerminationModal] = useState(false)
  const [terminationReason, setTerminationReason] = useState<"tab-switch" | "fullscreen-exit">("tab-switch")
  const [isExamTerminated, setIsExamTerminated] = useState(false)

  // Initialize exam session in Firestore
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [sessionInitialized, setSessionInitialized] = useState(false)

  // Handle violation - auto-submit and show termination modal
  const handleCriticalViolation = async (reason: "tab-switch" | "fullscreen-exit") => {
    const examId = getCurrentExamId()
    
    if (!examId || isExamTerminated) {
      console.warn("⚠️ Exam already terminated or no exam ID")
      return
    }

    try {
      console.log(`🚨 CRITICAL VIOLATION DETECTED: ${reason}`)
      
      // Mark exam as terminated
      markExamAsTerminated(reason)
      setIsExamTerminated(true)
      
      // Auto-submit exam
      await autoSubmitExamOnViolation({
        reason,
        description: `User attempted ${reason} during exam`,
      })
      
      // Show termination modal
      setTerminationReason(reason)
      setShowTerminationModal(true)
      
      console.log("✓ Exam terminated and auto-submitted")
    } catch (error) {
      console.error("❌ Failed to handle violation:", error)
      setSessionError("Failed to process exam termination. Please contact support.")
    }
  }

  // Setup strict fullscreen lock
  const { hasViolation, getTabSwitchCount } = useStrictFullscreenLock({
    onTabSwitchDetected: () => {
      setTabSwitchWarning(true)
      // Trigger auto-submit on tab switch
      handleCriticalViolation("tab-switch")
      // Hide warning after 3 seconds
      setTimeout(() => setTabSwitchWarning(false), 3000)
    },
    onViolation: () => {
      handleCriticalViolation("tab-switch")
    },
    enabled: sessionInitialized && !isExamTerminated,
  })

  useEffect(() => {
    const initializeExam = async () => {
      if (!user) return
      if (isInitializing || sessionInitialized) return
      
      try {
        const { hasFirestoreSession } = await import("@/lib/exam-session")
        const examId = getCurrentExamId()
        const hasSession = hasFirestoreSession()
        
        // If session already exists, just mark as initialized without showing UI
        if (examId && hasSession) {
          console.log("✅ [SECTIONS] Using existing exam session:", examId)
          setSessionInitialized(true)
          return
        }
        
        // Only show initializing UI if we actually need to create a session
        setIsInitializing(true)
        
        console.log("🔧 [SECTIONS] Creating Firestore session", { examId, hasSession })
        const newExamId = await startExam()
        if (newExamId) {
          console.log("✅ [SECTIONS] Created new exam session in Firestore:", newExamId)
          setSessionError(null)
          setSessionInitialized(true)
        }
      } catch (error) {
        console.error("❌ [SECTIONS] Failed to initialize exam:", error)
        setSessionError(error instanceof Error ? error.message : "Failed to initialize exam session")
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeExam()
  }, [user, startExam])

  // Preload all questions in parallel
  useEffect(() => {
    const examId = getCurrentExamId()
    const logger = createLogger({ event: "sections-page-load", examId })
    logger.info("Current exam ID")

    // Check if already loaded
    if (areAllSectionsLoaded()) {
      logger.info("All questions already cached")
      
      // Update loading status for all cached sections
      const sections = ["mcq1", "mcq2", "mcq3", "coding"]
      sections.forEach(section => {
        const cached = getSectionQuestions(section)
        if (cached) {
          setLoadingStatus(prev => ({ ...prev, [section]: true }))
          setQuestionCounts(prev => ({ ...prev, [section]: cached.length }))
          setQuestionSources(prev => ({ ...prev, [section]: "cache" }))
        }
      })
      
      setAllLoaded(true)
      return
    }

    logger.info("Starting parallel question loading")
    loadAllSections()
  }, [])

  const loadSection = async (section: string, retryAttempt: number = 0): Promise<void> => {
    const logger = createLogger({ section, event: "load-section" })
    const maxRetries = 3
    
    logger.info("Loading section", { attempt: retryAttempt + 1 })
    setLoadingStatus(prev => ({ ...prev, [section]: false }))

    try {
      const result = await getOrLoadSectionQuestions(section, (questions, count) => {
        // Progress callback - update UI
        logger.info("Progress update", { count })
        setQuestionCounts(prev => ({ ...prev, [section]: count }))
        
        // Enable section if we have minimum questions (80% of expected)
        const expectedCount = sections.find(s => s.id === section)?.questions || 25
        if (count >= expectedCount * 0.8) {
          setLoadingStatus(prev => ({ ...prev, [section]: true }))
        }
      })

      // Check if we got all expected questions
      const expectedCount = sections.find(s => s.id === section)?.questions || 25
      const gotAll = result.questions.length >= expectedCount
      
      // Final update
      setLoadingStatus(prev => ({ ...prev, [section]: true }))
      setQuestionCounts(prev => ({ ...prev, [section]: result.questions.length }))
      setQuestionSources(prev => ({ ...prev, [section]: result.source }))
      logger.info("Section loaded", { count: result.questions.length, source: result.source, complete: gotAll })
      
      // If incomplete and we haven't exceeded retries, try again automatically
      if (!gotAll && retryAttempt < maxRetries && result.source !== "mock") {
        const missing = expectedCount - result.questions.length
        logger.info("Incomplete section, auto-retrying", { missing, attempt: retryAttempt + 1 })
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Retry loading
        await loadSection(section, retryAttempt + 1)
      }
    } catch (error) {
      logger.error("Failed to load section", { 
        error: error instanceof Error ? error.message : String(error) 
      })
      
      // Retry on error if we haven't exceeded max retries
      if (retryAttempt < maxRetries) {
        logger.info("Retrying after error", { attempt: retryAttempt + 1 })
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryAttempt + 1)))
        await loadSection(section, retryAttempt + 1)
      } else {
        // Mark as failed after all retries
        setLoadingStatus(prev => ({ ...prev, [section]: false }))
      }
    }
  }

  const loadAllSections = async () => {
    const sections = ["mcq1", "mcq2", "mcq3", "coding"]
    const logger = createLogger({ event: "load-all-sections" })

    logger.info("Starting parallel loading")

    // Load all sections in parallel
    const promises = sections.map(async (section) => {
      // Check cache first
      const cached = getSectionQuestions(section)
      if (cached) {
        setLoadingStatus(prev => ({ ...prev, [section]: true }))
        setQuestionCounts(prev => ({ ...prev, [section]: cached.length }))
        setQuestionSources(prev => ({ ...prev, [section]: "cache" }))
        return
      }

      // Load via question-service
      await loadSection(section)
    })

    await Promise.all(promises)
    setAllLoaded(true)
    
    if (process.env.NODE_ENV !== 'production') {
      logger.info("All sections loaded")
    }
  }

  const sections = [
    {
      id: "mcq1",
      title: "MCQ 1",
      subtitle: "General & Technical",
      questions: 25,
      duration: "40 min",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
      description: "General knowledge and technical concepts",
    },
    {
      id: "mcq2",
      title: "MCQ 2",
      subtitle: "Coding Questions",
      questions: 25,
      duration: "45 min",
      icon: Code,
      color: "from-purple-600 to-pink-600",
      description: "Programming and coding challenges",
    },
    {
      id: "mcq3",
      title: "MCQ 3",
      subtitle: "English Language",
      questions: 10,
      duration: "15 min",
      icon: BookOpen,
      color: "from-green-600 to-teal-600",
      description: "Grammar, vocabulary, and comprehension",
    },
    {
      id: "coding",
      title: "Coding",
      subtitle: "Programming Tasks",
      questions: 2,
      duration: "30 min",
      icon: Terminal,
      color: "from-orange-600 to-red-600",
      description: "Write and submit code solutions",
    },
  ]

  const handleStartSection = (sectionId: string) => {
    router.push(`/exam/${sectionId}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">HP</span>
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Computer Science - Final Assessment</h1>
              <p className="text-sm text-muted-foreground">Select a section to begin your exam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left & Center - Section Selection */}
          <div className="lg:col-span-3 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Exam Section</h2>
              <p className="text-muted-foreground text-sm">
                Complete all sections to finish your assessment. You can take them in any order.
              </p>
              
              {/* Session Error Display */}
              {sessionError && (
                <Card className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium text-red-900 dark:text-red-100">Session Initialization Error</p>
                      <p className="text-sm text-red-700 dark:text-red-200 mt-1">{sessionError}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Loading State */}
              {isInitializing && (
                <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm text-blue-700 dark:text-blue-200">Initializing exam session...</p>
                  </div>
                </Card>
              )}
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.id}
                className="exam-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              >
                <div className={`bg-gradient-to-r ${section.color} text-white px-3 py-2.5 -mx-6 -mt-6 mb-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="h-6 w-6" />
                    <div className="text-right">
                      <div className="text-xl font-bold">{section.questions}</div>
                      <div className="text-[10px] opacity-90">Questions</div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-0.5">{section.title}</h3>
                  <p className="text-[11px] opacity-90">{section.subtitle}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-medium">{section.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span className="font-medium">{section.questions} Questions</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button
                      onClick={() => handleStartSection(section.id)}
                      disabled={!loadingStatus[section.id]}
                      className={`w-full h-9 text-sm font-semibold bg-gradient-to-r ${section.color} hover:opacity-90 text-white shadow-md disabled:opacity-50`}
                    >
                      {!loadingStatus[section.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {questionCounts[section.id] ? `Loading ${questionCounts[section.id]}/${section.questions}...` : 'Loading...'}
                        </>
                      ) : (
                        <>
                          Start {section.title}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
          </div>

          {/* Right Sidebar - Monitoring */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              <Card className="exam-card p-0 overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 h-52">
                <MonitoringOverlay />
              </Card>

              {/* Violation Tracker */}
              <ViolationTracker />
            </div>
          </div>
        </div>
      </div>

      {/* Exam Termination Modal */}
      <ExamTerminationModal
        isOpen={showTerminationModal}
        violationType={terminationReason}
        onClose={() => {
          router.push("/exam/results")
        }}
        onViewResults={() => {
          router.push("/exam/results")
        }}
      />
    </main>
  )
}
