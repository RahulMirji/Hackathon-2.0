"use client"

import { useEffect } from "react"
import { XCircle, AlertTriangle, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function ExamTerminatedPage() {
  useEffect(() => {
    // Prevent back navigation
    window.history.pushState(null, "", window.location.href)
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href)
    }

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener("contextmenu", handleContextMenu)

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-red-100 dark:from-red-950 dark:via-orange-950 dark:to-red-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white dark:bg-gray-900 shadow-2xl border-4 border-red-500 dark:border-red-700">
        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center animate-pulse">
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              Exam Terminated
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Your examination has been automatically terminated due to policy violations
            </p>
          </div>

          {/* Violation Details */}
          <Card className="bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-800 p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-red-900 dark:text-red-200">
                  Violation Detected
                </h2>
                <p className="text-sm text-red-800 dark:text-red-300">
                  Our proctoring system detected that you exceeded the maximum allowed violations:
                </p>
                <ul className="space-y-2 text-sm text-red-800 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span><strong>Tab switching:</strong> Maximum 5 times allowed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span><strong>Out of frame:</strong> Maximum 3 times allowed</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Consequences */}
          <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Consequences
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Your exam has been <strong>automatically submitted</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Your responses have been <strong>flagged for review</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>You will <strong>not receive</strong> exam results</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span>This incident has been <strong>reported to the exam administrator</strong></span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Footer Message */}
          <div className="text-center pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you believe this was an error, please contact the exam administrator with your exam ID.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              This window will remain locked. Do not attempt to navigate away or refresh.
            </p>
          </div>
        </div>
      </Card>
    </main>
  )
}
