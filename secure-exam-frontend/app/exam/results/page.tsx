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
    <main className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-green-50/30 to-teal-50/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 overflow-hidden">
      <div className="w-full max-w-6xl">
        {/* Header with Thank You */}
        <div className="text-center mb-4">
          <div className="inline-flex h-14 w-14 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 items-center justify-center mb-2 shadow-2xl animate-pulse">
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Thank You!
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Your exam has been successfully submitted and processed</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {/* Left Column - Score */}
          <div className="space-y-2.5">
            <Card className="exam-card p-4 shadow-2xl border-2 hover:shadow-3xl transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📈</span>
                </div>
                <h2 className="text-base font-bold">Results</h2>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-center border-2 border-green-200 dark:border-green-800 shadow-lg">
                  <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Your Score</p>
                  <p className="text-5xl font-black bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">87%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 text-center border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground mb-0.5 font-semibold">Passing Score</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">70%</p>
                </div>
              </div>
            </Card>

            <Card className="exam-card p-3 bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-white text-xl">PASSED</p>
                  <p className="text-xs text-white/90 font-medium">Successfully completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle Column - Question Breakdown */}
          <div>
            <Card className="exam-card p-4 h-full shadow-2xl border-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📝</span>
                </div>
                <h3 className="font-bold text-base">Questions</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                    </div>
                    <span className="text-sm font-semibold">Question 1</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-500">100%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                    </div>
                    <span className="text-sm font-semibold">Question 2</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-500">100%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-200 dark:border-yellow-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <span className="text-sm font-semibold">Question 3</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-500">75%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Integrity Report */}
          <div>
            <Card className="exam-card p-4 h-full shadow-2xl border-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🛡️</span>
                </div>
                <h3 className="font-bold text-base">Integrity</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                  <span className="text-sm font-semibold">Face Detection</span>
                  <span className="text-green-600 dark:text-green-500 font-bold text-xs">✓ Passed</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                  <span className="text-sm font-semibold">Connection</span>
                  <span className="text-green-600 dark:text-green-500 font-bold text-xs">✓ Passed</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800">
                  <span className="text-sm font-semibold">Attention</span>
                  <span className="text-yellow-600 dark:text-yellow-500 font-bold text-xs">⚠ 2 Warnings</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                  <span className="text-sm font-semibold">Device</span>
                  <span className="text-green-600 dark:text-green-500 font-bold text-xs">✓ Passed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadReport} 
              variant="outline" 
              className="flex-1 h-11 text-sm font-semibold border-2 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-700 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-700 shadow-lg transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button 
              onClick={() => router.push("/")} 
              className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-2xl transition-all hover:scale-[1.02]"
            >
              Return Home
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground font-medium">
            Your exam results have been recorded and will be available in your account dashboard.
          </p>
        </div>
      </div>
    </main>
  )
}
