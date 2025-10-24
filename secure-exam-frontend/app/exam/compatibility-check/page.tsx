"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface DeviceCheck {
  name: string
  status: "checking" | "pass" | "fail"
  message: string
}

export default function CompatibilityCheckPage() {
  const router = useRouter()
  const [checks, setChecks] = useState<DeviceCheck[]>([
    { name: "Webcam", status: "checking", message: "Checking..." },
    { name: "Microphone", status: "checking", message: "Checking..." },
    { name: "Internet Connection", status: "checking", message: "Checking..." },
    { name: "Browser Support", status: "checking", message: "Checking..." },
    { name: "Screen Resolution", status: "checking", message: "Checking..." },
  ])
  const [allPassed, setAllPassed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const runChecks = async () => {
      const newChecks = [...checks]

      // Check browser support
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        newChecks[3] = { name: "Browser Support", status: "pass", message: "Supported" }
      } else {
        newChecks[3] = { name: "Browser Support", status: "fail", message: "Not supported" }
      }

      // Check screen resolution
      if (window.innerWidth >= 1024 && window.innerHeight >= 768) {
        newChecks[4] = {
          name: "Screen Resolution",
          status: "pass",
          message: `${window.innerWidth}x${window.innerHeight}`,
        }
      } else {
        newChecks[4] = { name: "Screen Resolution", status: "fail", message: "Minimum 1024x768 required" }
      }

      // Check internet connection
      if (navigator.onLine) {
        newChecks[2] = { name: "Internet Connection", status: "pass", message: "Connected" }
      } else {
        newChecks[2] = { name: "Internet Connection", status: "fail", message: "No connection" }
      }

      // Check webcam and microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        newChecks[0] = { name: "Webcam", status: "pass", message: "Detected" }
        newChecks[1] = { name: "Microphone", status: "pass", message: "Detected" }

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop())
      } catch (error) {
        if ((error as any).name === "NotFoundError" || (error as any).name === "DevicesNotFoundError") {
          newChecks[0] = { name: "Webcam", status: "fail", message: "Not found" }
          newChecks[1] = { name: "Microphone", status: "fail", message: "Not found" }
        } else if ((error as any).name === "NotAllowedError" || (error as any).name === "PermissionDeniedError") {
          newChecks[0] = { name: "Webcam", status: "fail", message: "Permission denied" }
          newChecks[1] = { name: "Microphone", status: "fail", message: "Permission denied" }
        } else {
          newChecks[0] = { name: "Webcam", status: "fail", message: "Error" }
          newChecks[1] = { name: "Microphone", status: "fail", message: "Error" }
        }
      }

      setChecks(newChecks)
      const passed = newChecks.every((check) => check.status === "pass")
      setAllPassed(passed)
    }

    runChecks()
  }, [])

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/exam/id-verification")
  }

  return (
    <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">System Compatibility Check</h1>
          <p className="text-muted-foreground">Verifying your device meets exam requirements</p>
        </div>

        {/* Checks Card */}
        <Card className="exam-card space-y-4">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                {check.status === "checking" && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                {check.status === "pass" && <CheckCircle2 className="h-5 w-5 text-accent" />}
                {check.status === "fail" && <AlertCircle className="h-5 w-5 text-destructive" />}
                <div>
                  <p className="font-medium">{check.name}</p>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  check.status === "pass"
                    ? "text-accent"
                    : check.status === "fail"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {check.status === "checking" ? "..." : check.status === "pass" ? "OK" : "FAIL"}
              </span>
            </div>
          ))}
        </Card>

        {/* Status Message */}
        {!allPassed && (
          <div className="exam-alert">
            <p className="font-medium">Some requirements are not met</p>
            <p className="text-sm">Please resolve the issues above before proceeding with the exam.</p>
          </div>
        )}

        {allPassed && (
          <div className="exam-success">
            <p className="font-medium">All checks passed!</p>
            <p className="text-sm">Your system is ready for the exam.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} disabled={isLoading} className="exam-button-primary flex-1">
            {isLoading ? "Continuing..." : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  )
}
