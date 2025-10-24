"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function SubmissionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitted(true)
    setIsSubmitting(false)

    // Redirect to results after 2 seconds
    setTimeout(() => {
      router.push("/exam/results")
    }, 2000)
  }

  if (submitted) {
    return (
      <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Exam Submitted</h1>
            <p className="text-muted-foreground">Your exam has been successfully submitted and is being processed.</p>
          </div>

          <Card className="exam-card space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Submission Status</span>
                <span className="text-accent font-semibold">Confirmed</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Processing</span>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Redirecting to Results</span>
                <span className="text-xs text-muted-foreground">In a moment...</span>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            You will be redirected to your results page shortly. Please do not close this window.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Review & Submit Exam</h1>
          <p className="text-muted-foreground">Please review your answers before final submission</p>
        </div>

        {/* Summary Card */}
        <Card className="exam-card space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-medium">Total Questions</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-medium">Answered</span>
              <span className="font-bold text-accent">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="font-medium">Unanswered</span>
              <span className="font-bold text-destructive">0</span>
            </div>
          </div>
        </Card>

        {/* Warnings */}
        <div className="space-y-3">
          <h3 className="font-semibold">Exam Integrity Summary</h3>
          <Card className="exam-card space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Face Detection</p>
                <p className="text-xs text-muted-foreground">Maintained throughout exam</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Connection Stable</p>
                <p className="text-xs text-muted-foreground">No interruptions detected</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">2 Attention Warnings</p>
                <p className="text-xs text-muted-foreground">Low attention score detected twice</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Confirmation */}
        <Card className="exam-card space-y-4">
          <div className="flex gap-3">
            <Checkbox
              id="confirm"
              checked={confirmSubmit}
              onCheckedChange={(checked) => setConfirmSubmit(checked as boolean)}
            />
            <label htmlFor="confirm" className="text-sm cursor-pointer">
              I confirm that I have completed this exam honestly and in accordance with all exam policies. I understand
              that any violations may result in disciplinary action.
            </label>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Back to Exam
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="exam-button-primary flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Exam"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
