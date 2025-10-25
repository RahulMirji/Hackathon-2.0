"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { getCurrentExamId } from "@/lib/exam-session"
import { calculateAndSaveResult, updateExamSession } from "@/lib/firestore-service"

export default function ExamSubmissionPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"submitting" | "success" | "error">("submitting")
  const [message, setMessage] = useState("Submitting your exam...")

  useEffect(() => {
    submitExam()
  }, [])

  const submitExam = async () => {
    const examId = getCurrentExamId()
    if (!examId) {
      setStatus("error")
      setMessage("No active exam session found. Please return to the sections page and start the exam.")
      return
    }

    try {
      setMessage("Verifying exam session...")
      
      // Import getExamSession to verify session exists
      const { getExamSession } = await import("@/lib/firestore-service")
      const session = await getExamSession(examId)
      
      if (!session) {
        // Session doesn't exist - attempt recovery
        console.error("❌ [SUBMISSION] Session not found, attempting recovery")
        setStatus("error")
        setMessage(
          `Exam session not found (ID: ${examId}). ` +
          `The session may not have been properly initialized. ` +
          `Please contact support with this exam ID.`
        )
        return
      }
      
      setMessage("Finalizing your answers...")
      
      // Mark exam as completed
      await updateExamSession(examId, {
        status: "completed",
        endTime: new Date() as any,
      })

      setMessage("Calculating your results...")
      
      // Calculate and save results
      await calculateAndSaveResult(examId)

      setStatus("success")
      setMessage("Exam submitted successfully!")

      // Redirect to results page after 2 seconds
      setTimeout(() => {
        router.push("/exam/results")
      }, 2000)
    } catch (error) {
      console.error("❌ [SUBMISSION] Failed to submit exam:", error)
      setStatus("error")
      
      // Parse error to provide specific guidance
      const errorMsg = error instanceof Error ? error.message : String(error)
      
      if (errorMsg.includes("session not found") || errorMsg.includes("does not exist")) {
        setMessage(
          `Exam session not found. The session may not have been properly initialized. ` +
          `Exam ID: ${examId}. Please contact support or try returning to the sections page.`
        )
      } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
        setMessage("Network error: Please check your internet connection and try again.")
      } else {
        setMessage(`Failed to submit exam: ${errorMsg}`)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Card className="p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          {status === "submitting" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <h2 className="text-2xl font-bold text-center">{message}</h2>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we process your submission...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h2 className="text-2xl font-bold text-center text-green-600">{message}</h2>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting to results page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-16 w-16 text-red-600" />
              <h2 className="text-2xl font-bold text-center text-red-600">Submission Error</h2>
              <p className="text-sm text-muted-foreground text-center max-w-md">{message}</p>
              <div className="flex flex-col gap-2 mt-4 w-full">
                <Button onClick={submitExam} variant="default" className="w-full">
                  Retry Submission
                </Button>
                <Button onClick={() => router.push("/exam/sections")} variant="outline" className="w-full">
                  Back to Sections
                </Button>
                <Button 
                  onClick={() => {
                    const examId = getCurrentExamId()
                    const diagnosticInfo = `Exam ID: ${examId}\nTimestamp: ${new Date().toISOString()}\nError: ${message}`
                    navigator.clipboard.writeText(diagnosticInfo)
                    alert("Diagnostic info copied to clipboard. Please contact support.")
                  }} 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                >
                  Copy Diagnostic Info
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </main>
  )
}
