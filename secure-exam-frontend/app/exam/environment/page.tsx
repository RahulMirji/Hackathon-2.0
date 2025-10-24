"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ExamTimer } from "@/components/exam/exam-timer"
import { ExamQuestions } from "@/components/exam/exam-questions"
import { AlertCircle } from "lucide-react"

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    type: "multiple-choice" as const,
  },
  {
    id: 2,
    text: "Explain the concept of machine learning in your own words.",
    options: [],
    type: "short-answer" as const,
  },
  {
    id: 3,
    text: "Which of the following is a programming language?",
    options: ["Python", "HTML", "CSS", "All of the above"],
    type: "multiple-choice" as const,
  },
]

export default function ExamEnvironmentPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showWarning, setShowWarning] = useState(false)

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleTimeUp = () => {
    setShowWarning(true)
  }

  const handleSubmit = () => {
    router.push("/exam/submission")
  }

  return (
    <main className="exam-container min-h-screen">
      {/* Header */}
      <div className="exam-header sticky top-0 z-40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">HP</span>
            </div>
            <h1 className="font-semibold">Exam in Progress</h1>
          </div>
          <ExamTimer totalMinutes={60} onTimeUp={handleTimeUp} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monitoring Panel */}
          <div className="lg:col-span-1">
            <Card className="exam-card p-0 overflow-hidden sticky top-24">
              <div className="h-80">
                <MonitoringOverlay />
              </div>
              <div className="p-4 border-t border-border space-y-3">
                <div className="monitoring-badge">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Live Monitoring Active
                </div>
                <p className="text-xs text-muted-foreground">
                  Your exam session is being monitored in real-time. Maintain focus on the screen and ensure your face
                  is visible.
                </p>
              </div>
            </Card>
          </div>

          {/* Questions Panel */}
          <div className="lg:col-span-2 space-y-6">
            {showWarning && (
              <div className="exam-alert flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Time is running out!</p>
                  <p className="text-sm">You have less than 5 minutes remaining. Please submit your answers.</p>
                </div>
              </div>
            )}

            <ExamQuestions questions={SAMPLE_QUESTIONS} onAnswerChange={handleAnswerChange} />

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="exam-button-primary w-full">
              Submit Exam
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
