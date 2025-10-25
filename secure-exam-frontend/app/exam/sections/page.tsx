"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, BookOpen, FileText, Clock, CheckCircle, Terminal, Loader2, RefreshCw } from "lucide-react"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ViolationTracker } from "@/components/exam/violation-tracker"
import { 
  getCurrentExamId, 
  getSectionQuestions,
  areAllSectionsLoaded,
  clearExamSession,
  getExamSession,
  saveExamSession 
} from "@/lib/exam-session"
import { getOrLoadSectionQuestions } from "@/lib/question-service"
import { createLogger } from "@/lib/utils"

export default function ExamSectionsPage() {
  const router = useRouter()
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({})
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({})
  const [questionSources, setQuestionSources] = useState<Record<string, "api" | "mock" | "cache" | "ai">>({})
  const [allLoaded, setAllLoaded] = useState(false)

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

  const loadSection = async (section: string): Promise<void> => {
    const logger = createLogger({ section, event: "load-section" })
    
    logger.info("Loading section")
    setLoadingStatus(prev => ({ ...prev, [section]: false }))

    try {
      const result = await getOrLoadSectionQuestions(section, (questions, count) => {
        // Progress callback - update UI
        logger.info("Progress update", { count })
        setQuestionCounts(prev => ({ ...prev, [section]: count }))
        
        // Enable section if we have minimum questions
        if (count >= 3) {
          setLoadingStatus(prev => ({ ...prev, [section]: true }))
        }
      })

      // Final update
      setLoadingStatus(prev => ({ ...prev, [section]: true }))
      setQuestionCounts(prev => ({ ...prev, [section]: result.questions.length }))
      setQuestionSources(prev => ({ ...prev, [section]: result.source }))
      logger.info("Section loaded", { count: result.questions.length, source: result.source })
    } catch (error) {
      logger.error("Failed to load section", { 
        error: error instanceof Error ? error.message : String(error) 
      })
      
      // Mark as failed but don't block
      setLoadingStatus(prev => ({ ...prev, [section]: false }))
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
    router.push(`/exam/environment?section=${sectionId}`)
  }

  const handleClearCache = () => {
    if (confirm("Clear all cached questions and reload? This will generate fresh questions.")) {
      clearExamSession()
      window.location.reload()
    }
  }

  const handleGenerateMore = async (sectionId: string) => {
    const logger = createLogger({ section: sectionId, event: "generate-more" })
    
    // Get current count
    const currentCount = questionCounts[sectionId] || 0
    const expectedCount = sections.find(s => s.id === sectionId)?.questions || 25
    const missing = expectedCount - currentCount
    
    logger.info("Generating missing questions", { current: currentCount, expected: expectedCount, missing })
    
    // Don't clear cache - keep existing questions and add more
    // The loadSection will detect incomplete cache and generate remaining
    setLoadingStatus(prev => ({ ...prev, [sectionId]: false }))
    await loadSection(sectionId)
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
            {process.env.NODE_ENV !== 'production' && (
              <Button
                onClick={handleClearCache}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Cache & Reload
              </Button>
            )}
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
                          {questionCounts[section.id] ? `${questionCounts[section.id]}/${section.questions}` : 'Loading...'}
                        </>
                      ) : (
                        <>
                          Start {section.title}
                          {questionCounts[section.id] && questionCounts[section.id] < section.questions && 
                            ` (${questionCounts[section.id]}/${section.questions})`
                          }
                        </>
                      )}
                    </Button>
                    
                    {/* Show "Generate More" button if incomplete */}
                    {loadingStatus[section.id] && questionCounts[section.id] && questionCounts[section.id] < section.questions && (
                      <Button
                        onClick={() => handleGenerateMore(section.id)}
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-xs"
                      >
                        Generate {section.questions - questionCounts[section.id]} More
                      </Button>
                    )}
                    
                    {loadingStatus[section.id] && questionSources[section.id] && (
                      <div className="text-[10px] text-center text-muted-foreground">
                        {questionSources[section.id] === "api" && "✓ AI Generated"}
                        {questionSources[section.id] === "ai" && "✓ AI Generated"}
                        {questionSources[section.id] === "mock" && "⚠ Using Fallback"}
                        {questionSources[section.id] === "cache" && "✓ Cached"}
                      </div>
                    )}
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
    </main>
  )
}
