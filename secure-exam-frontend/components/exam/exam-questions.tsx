"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookmarkPlus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
  type: "multiple-choice" | "short-answer"
}

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked-review" | "answered-marked"

interface ExamQuestionsProps {
  questions: Question[]
  answers: Record<number, string>
  questionStatus: Record<number, QuestionStatus>
  onAnswerChange: (questionId: number, answer: string) => void
  onMarkForReview: (questionId: number) => void
  onClearResponse: (questionId: number) => void
  onQuestionVisit: (questionId: number) => void
  onBackToSections: () => void
  nextSectionRoute?: string
  onNavigateToNextSection?: () => void
}

export function ExamQuestions({ 
  questions, 
  answers,
  questionStatus,
  onAnswerChange, 
  onMarkForReview,
  onClearResponse,
  onQuestionVisit,
  onBackToSections,
  nextSectionRoute,
  onNavigateToNextSection
}: ExamQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const question = questions[currentQuestion]

  useEffect(() => {
    // Mark question as visited when navigating to it
    onQuestionVisit(question.id)
  }, [currentQuestion, question.id, onQuestionVisit])

  useEffect(() => {
    // Listen for jump to question events from palette
    const handleJumpToQuestion = (event: CustomEvent) => {
      const questionId = event.detail
      const index = questions.findIndex((q) => q.id === questionId)
      if (index !== -1) {
        setCurrentQuestion(index)
      }
    }

    window.addEventListener("jumpToQuestion" as any, handleJumpToQuestion as any)
    return () => {
      window.removeEventListener("jumpToQuestion" as any, handleJumpToQuestion as any)
    }
  }, [questions])

  const handleAnswer = (answer: string) => {
    onAnswerChange(question.id, answer)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentQuestion === questions.length - 1 && onNavigateToNextSection) {
      // On last question, navigate to next section
      onNavigateToNextSection()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      onBackToSections()
    } else {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleMarkForReview = () => {
    onMarkForReview(question.id)
  }

  const handleClearResponse = () => {
    onClearResponse(question.id)
  }

  const currentStatus = questionStatus[question.id] || "not-visited"
  const isMarkedForReview = currentStatus === "marked-review" || currentStatus === "answered-marked"

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <Card className="exam-card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge 
              variant={question.type === "multiple-choice" ? "default" : "outline"}
              className="text-xs"
            >
              {question.type === "multiple-choice" ? "Multiple Choice" : "Short Answer"}
            </Badge>
          </div>
          
          {isMarkedForReview && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <BookmarkPlus className="h-3 w-3 mr-1" />
              Marked for Review
            </Badge>
          )}
        </div>
      </Card>

      {/* Question Card */}
      <Card className="exam-card space-y-6 shadow-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold leading-relaxed">{question.text}</h2>

          {question.type === "multiple-choice" ? (
            <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question.id] === option
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-border hover:bg-muted/50 hover:border-blue-300"
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} className="h-5 w-5" />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 text-base">
                        {option}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="answer-textarea" className="text-sm font-medium">
                Your Answer:
              </Label>
              <textarea
                id="answer-textarea"
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-40 p-4 rounded-lg border-2 border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {answers[question.id]?.length || 0} characters
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleMarkForReview}
            className={`flex-1 gap-2 ${
              isMarkedForReview ? "bg-purple-100 dark:bg-purple-900/30 border-purple-300" : ""
            }`}
          >
            <BookmarkPlus className="h-4 w-4" />
            {isMarkedForReview ? "Unmark Review" : "Mark for Review"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearResponse}
            disabled={!answers[question.id]}
            className="flex-1 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Response
          </Button>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          variant="outline"
          className="flex-1 h-12 gap-2 text-base font-semibold"
        >
          <ChevronLeft className="h-5 w-5" />
          {currentQuestion === 0 ? "Back to Sections" : "Previous"}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1 && !onNavigateToNextSection}
          className="flex-1 h-12 gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {currentQuestion === questions.length - 1 && nextSectionRoute ? "Next Section" : "Next"}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
