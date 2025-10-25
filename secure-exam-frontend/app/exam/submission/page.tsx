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
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Exam Submitted</h1>
            <p className="text-muted-foreground">Your exam has been successfully submitted and is being processed.</p>
          </div>

          <Card className="exam-card p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Submission Status</span>
                <span className="text-green-600 dark:text-green-500 font-semibold">Confirmed</span>
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
    <main className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 overflow-hidden">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-2 shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Review & Submit Exam
          </h1>
          <p className="text-sm text-muted-foreground">Please review your answers before final submission</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Left Column - Summary */}
          <Card className="exam-card p-4 shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <h3 className="font-bold text-lg">Exam Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold">Total Questions</span>
                <span className="font-bold text-xl">3</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                <span className="text-sm font-semibold">Answered</span>
                <span className="font-bold text-xl text-green-600 dark:text-green-500">3</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold">Unanswered</span>
                <span className="font-bold text-xl text-slate-400">0</span>
              </div>
            </div>
          </Card>

          {/* Right Column - Integrity */}
          <Card className="exam-card p-4 shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">🛡️</span>
              </div>
              <h3 className="font-bold text-lg">Exam Integrity</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Face Detection</p>
                  <p className="text-xs text-muted-foreground">Maintained throughout</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Connection Stable</p>
                  <p className="text-xs text-muted-foreground">No interruptions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                <div className="w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">2 Attention Warnings</p>
                  <p className="text-xs text-muted-foreground">Low attention detected</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Confirmation */}
        <Card className="exam-card p-4 mb-3 shadow-xl border-2 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <div className="flex gap-3 items-start">
            <Checkbox
              id="confirm"
              checked={confirmSubmit}
              onCheckedChange={(checked) => setConfirmSubmit(checked as boolean)}
              className="mt-0.5 w-5 h-5"
            />
            <label htmlFor="confirm" className="text-sm cursor-pointer leading-relaxed font-medium">
              I confirm that I have completed this exam honestly and in accordance with all exam policies. I understand
              that any violations may result in disciplinary action.
            </label>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="flex-1 h-11 text-sm font-semibold border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Back to Exam
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!confirmSubmit || isSubmitting} 
            className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
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
