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
import { jsPDF } from "jspdf"

export default function ExamResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

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

  const handleDownloadPDF = () => {
    if (!result) return
    
    setDownloadingPDF(true)
    
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPos = 20
      
      // Header
      doc.setFillColor(59, 130, 246) // Blue
      doc.rect(0, 0, pageWidth, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text("Exam Results", pageWidth / 2, 20, { align: 'center' })
      doc.setFontSize(12)
      doc.text("Computer Science - Final Assessment", pageWidth / 2, 30, { align: 'center' })
      
      yPos = 50
      
      // Score Section
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.text("Overall Score", 20, yPos)
      yPos += 10
      
      doc.setFontSize(14)
      doc.text(`Score: ${result.totalScore} / ${result.maxScore} Points`, 20, yPos)
      yPos += 8
      doc.text(`Percentage: ${result.percentage.toFixed(1)}%`, 20, yPos)
      yPos += 15
      
      // Quick Stats
      doc.setFontSize(16)
      doc.text("Quick Stats", 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.text(`Correct: ${result.totalCorrect}`, 20, yPos)
      yPos += 7
      doc.text(`Incorrect: ${result.totalIncorrect}`, 20, yPos)
      yPos += 7
      doc.text(`Skipped: ${result.totalSkipped}`, 20, yPos)
      yPos += 15
      
      // Time Analysis
      doc.setFontSize(16)
      doc.text("Time Analysis", 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.text(`Total Time: ${result.totalTimeTaken} minutes`, 20, yPos)
      yPos += 7
      doc.text(`Avg per Question: ${result.averageTimePerQuestion.toFixed(1)}s`, 20, yPos)
      yPos += 15
      
      // Section-wise Performance
      doc.setFontSize(16)
      doc.text("Section-wise Performance", 20, yPos)
      yPos += 10
      
      const sections = [
        { name: "MCQ 1 - General & Technical", data: result.sectionScores.mcq1 },
        { name: "MCQ 2 - Coding Questions", data: result.sectionScores.mcq2 },
        { name: "MCQ 3 - English Language", data: result.sectionScores.mcq3 },
        { name: "Coding - Programming Tasks", data: result.sectionScores.coding },
      ]
      
      sections.forEach((section) => {
        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(14)
        doc.setTextColor(59, 130, 246)
        doc.text(section.name, 20, yPos)
        yPos += 8
        
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        doc.text(`Score: ${section.data.score}/${section.data.maxScore} (${section.data.percentage.toFixed(1)}%)`, 25, yPos)
        yPos += 6
        doc.text(`Answered: ${section.data.questionsAnswered}`, 25, yPos)
        yPos += 6
        doc.text(`Avg Time: ${section.data.averageTimePerQuestion.toFixed(1)}s`, 25, yPos)
        yPos += 10
      })
      
      // Violations (if any)
      if (result.violationCount > 0) {
        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(16)
        doc.setTextColor(234, 88, 12) // Orange
        doc.text("Violations", 20, yPos)
        yPos += 10
        
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`Total Violations: ${result.violationCount}`, 20, yPos)
        yPos += 7
        doc.text(`Penalty: -${result.violationPenalty} points`, 20, yPos)
        
        if (result.flaggedForReview) {
          yPos += 7
          doc.setTextColor(220, 38, 38) // Red
          doc.text("⚠ Flagged for manual review", 20, yPos)
        }
      }
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      doc.text(`Exam ID: ${result.examId}`, pageWidth / 2, pageHeight - 5, { align: 'center' })
      
      // Save PDF
      doc.save(`exam-results-${result.examId}.pdf`)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setDownloadingPDF(false)
    }
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
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
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
            {/* Score Card */}
            <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <Award className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h2 className="text-4xl font-bold mb-2">Your Score</h2>
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                  <span>{result.totalScore}</span>
                  <span>/</span>
                  <span>{result.maxScore}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Points</p>
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

            {/* Results Notice */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-lg mb-4">📧 Final Results</h3>
              <div className="space-y-3">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Thank you for completing the exam! Your detailed results will be sent to your registered email address within 24-48 hours.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  The above scores are for your reference. Our team will review your submissions and send you the official results.
                </p>
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
            <p className="text-xs text-muted-foreground mb-1">Answered</p>
            <p className="text-lg font-bold text-blue-600">{score.questionsAnswered}</p>
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
