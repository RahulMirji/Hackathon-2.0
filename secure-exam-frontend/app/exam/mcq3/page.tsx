"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react"

const mcq3Questions = [
  {
    id: 1,
    question: "Choose the correct sentence:",
    options: ["He don't like coffee", "He doesn't like coffee", "He not like coffee", "He no like coffee"],
    correct: 1
  },
  {
    id: 2,
    question: "What is the synonym of 'abundant'?",
    options: ["Scarce", "Plentiful", "Limited", "Rare"],
    correct: 1
  },
  {
    id: 3,
    question: "Identify the passive voice:",
    options: ["She writes a letter", "A letter is written by her", "She is writing a letter", "She will write a letter"],
    correct: 1
  }
]

export default function MCQ3Page() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < mcq3Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    router.push("/exam/submission")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestion + 1) / mcq3Questions.length) * 100
  const question = mcq3Questions[currentQuestion]

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">MCQ 3 - English Language</h1>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {mcq3Questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {question.id}. {question.question}
              </h2>
              
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentQuestion === mcq3Questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Submit MCQ 3
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}