"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Download } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()

  const handleDownloadReport = () => {
    // Simulate PDF download
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8,Exam Report")
    element.setAttribute("download", "exam-report.pdf")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Exam Complete</h1>
          <p className="text-muted-foreground">Your exam has been successfully submitted and processed</p>
        </div>

        {/* Results Summary */}
        <Card className="exam-card space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Results Summary</h2>

            {/* Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                <p className="text-4xl font-bold text-accent">87%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Passing Score</p>
                <p className="text-4xl font-bold text-primary">70%</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/30">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
              <div>
                <p className="font-semibold text-accent">PASSED</p>
                <p className="text-sm text-accent/80">You have successfully passed this exam</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Results */}
        <Card className="exam-card space-y-4">
          <h3 className="font-semibold">Question Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-sm">Question 1: Correct</span>
              </div>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="text-sm">Question 2: Correct</span>
              </div>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Question 3: Partial Credit</span>
              </div>
              <span className="text-xs text-muted-foreground">75%</span>
            </div>
          </div>
        </Card>

        {/* Exam Integrity Report */}
        <Card className="exam-card space-y-4">
          <h3 className="font-semibold">Exam Integrity Report</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Face Detection</span>
              <span className="text-accent font-medium">Passed</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Connection Stability</span>
              <span className="text-accent font-medium">Passed</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Attention Monitoring</span>
              <span className="text-yellow-500 font-medium">2 Warnings</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Device Verification</span>
              <span className="text-accent font-medium">Passed</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleDownloadReport} variant="outline" className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={() => router.push("/")} className="exam-button-primary flex-1">
            Return Home
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Your exam results have been recorded and will be available in your account dashboard.
        </p>
      </div>
    </main>
  )
}
