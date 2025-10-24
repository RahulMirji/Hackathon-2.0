"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: number
  text: string
  options: string[]
  type: "multiple-choice" | "short-answer"
}

interface ExamQuestionsProps {
  questions: Question[]
  onAnswerChange: (questionId: number, answer: string) => void
}

export function ExamQuestions({ questions, onAnswerChange }: ExamQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const question = questions[currentQuestion]

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }))
    onAnswerChange(question.id, answer)
  }

  return (
    <div className="space-y-6">
      {/* Question Counter */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentQuestion ? "bg-primary" : answers[questions[index].id] ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <Card className="exam-card space-y-6">
        <h2 className="text-lg font-semibold">{question.text}</h2>

        {question.type === "multiple-choice" ? (
          <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-32 p-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="exam-button-secondary flex-1 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === questions.length - 1}
          className="exam-button-secondary flex-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
