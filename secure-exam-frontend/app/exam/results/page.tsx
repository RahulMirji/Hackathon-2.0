"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Award,
  Home,
  Download,
  Loader2
} from "lucide-react"
import { getCurrentExamId } from "@/lib/exam-session"
import { getExamResult, calculateAndSaveResult } from "@/lib/firestore-service"
import type { ExamResult } from "@/lib/types/exam-types"

export default function ExamResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    const examId = getCurrentExamId()
    if (!examId) {
      router.push("/exam/sections")
      return
    }

    try {
      // Try to get existing result
      let examResult = await getExamResult(examId)
      
      // If no result exists, calculate it
      if (!examResult) {
        setCalculating(true)
        examResult = await calculateAndSaveResult(examId)
      }
      
      setResult(examResult)
    } catch (error) {
      console.error("Failed to load results:", error)
    } finally {
      setLoading(false)
      setCalculating(false)
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-green-600 dark:text-green-400"
    if (grade === "B+" || grade === "B") return "text-blue-600 dark:text-blue-400"
    if (grade === "C") return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getGradeBg = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
    if (grade === "B+" || grade === "B") return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
    if (grade === "C") return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
    return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
  }

  if (loading || calculating) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold">
              {calculating ? "Calculating Your Results..." : "Loading Results..."}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {calculating 
                ? "Evaluating your answers and generating detailed report"
                : "Please wait while we fetch your exam results"
              }
            </p>
          </div>
        </Card>
      </main>
    )
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn't find results for this exam session.
          </p>
          <Button onClick={() => router.push("/exam/sections")}>
            Back to Sections
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Exam Results</h1>
                <p className="text-sm text-muted-foreground">Your performance summary</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={() => router.push("/")} size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overall Score */}
          <div className="lg:col-span-1 space-y-6">
            {/* Grade Card */}
            <Card className={`p-6 border-2 ${getGradeBg(result.grade)}`}>
              <div className="text-center">
                <Award className={`h-16 w-16 mx-auto mb-4 ${getGradeColor(result.grade)}`} />
                <h2 className="text-5xl font-bold mb-2">{result.grade}</h2>
                <p className="text-lg font-semibold mb-4">{result.percentage.toFixed(1)}%</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>{result.totalScore}</span>
                  <span>/</span>
                  <span>{result.maxScore}</span>
                  <span>Points</span>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Correct</span>
                  </div>
                  <span className="font-bold text-green-600">{result.totalCorrect}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Incorrect</span>
                  </div>
                  <span className="font-bold text-red-600">{result.totalIncorrect}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Skipped</span>
                  </div>
                  <span className="font-bold text-gray-600">{result.totalSkipped}</span>
                </div>
              </div>
            </Card>

            {/* Time Analysis */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Time Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Time</span>
                  <span className="font-semibold">{result.totalTimeTaken} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg per Question</span>
                  <span className="font-semibold">{result.averageTimePerQuestion.toFixed(1)}s</span>
                </div>
              </div>
            </Card>

            {/* Violations */}
            {result.violationCount > 0 && (
              <Card className="p-6 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Violations
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Violations</span>
                    <Badge variant="destructive">{result.violationCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Penalty</span>
                    <span className="font-semibold text-orange-600">-{result.violationPenalty} pts</span>
                  </div>
                  {result.flaggedForReview && (
                    <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
                      <p className="text-xs text-red-800 dark:text-red-200 font-medium">
                        ⚠️ Flagged for manual review
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Section Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Section-wise Performance</h3>
              
              <div className="space-y-6">
                {/* MCQ 1 */}
                <SectionCard
                  title="MCQ 1 - General & Technical"
                  score={result.sectionScores.mcq1}
                  color="blue"
                />

                {/* MCQ 2 */}
                <SectionCard
                  title="MCQ 2 - Coding Questions"
                  score={result.sectionScores.mcq2}
                  color="purple"
                />

                {/* MCQ 3 */}
                <SectionCard
                  title="MCQ 3 - English Language"
                  score={result.sectionScores.mcq3}
                  color="green"
                />

                {/* Coding */}
                <SectionCard
                  title="Coding - Programming Tasks"
                  score={result.sectionScores.coding}
                  color="orange"
                />
              </div>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Performance Insights</h3>
              <div className="space-y-3">
                {result.percentage >= 90 && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🎉 <strong>Excellent Performance!</strong> You've demonstrated strong understanding across all sections.
                    </p>
                  </div>
                )}
                
                {result.percentage >= 70 && result.percentage < 90 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      👍 <strong>Good Job!</strong> You've shown solid understanding. Review the sections where you scored lower.
                    </p>
                  </div>
                )}
                
                {result.percentage < 70 && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      💪 <strong>Keep Practicing!</strong> Focus on strengthening your fundamentals in the weaker sections.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

// Section Card Component
function SectionCard({ 
  title, 
  score, 
  color 
}: { 
  title: string
  score: any
  color: "blue" | "purple" | "green" | "orange"
}) {
  const colorClasses = {
    blue: "from-blue-600 to-cyan-600",
    purple: "from-purple-600 to-pink-600",
    green: "from-green-600 to-teal-600",
    orange: "from-orange-600 to-red-600",
  }

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color]} text-white px-4 py-3`}>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Score</p>
            <p className="text-lg font-bold">{score.score}/{score.maxScore}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Percentage</p>
            <p className="text-lg font-bold">{score.percentage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Correct</p>
            <p className="text-lg font-bold text-green-600">{score.questionsCorrect}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Time</p>
            <p className="text-lg font-bold">{score.averageTimePerQuestion.toFixed(1)}s</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
