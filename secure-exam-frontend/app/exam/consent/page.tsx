"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function ConsentPage() {
  const router = useRouter()
  const [consents, setConsents] = useState({
    monitoring: false,
    recording: false,
    policies: false,
    integrity: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const allConsented = Object.values(consents).every((v) => v)

  const handleConsent = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/exam/sections")
  }

  return (
    <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Exam Consent & Policies</h1>
          <p className="text-muted-foreground">Please review and accept the following terms</p>
        </div>

        {/* Consent Items */}
        <Card className="exam-card space-y-4">
          {/* Monitoring Consent */}
          <div className="flex gap-3 border-b border-border pb-4">
            <Checkbox
              id="monitoring"
              checked={consents.monitoring}
              onCheckedChange={() => handleConsent("monitoring")}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="monitoring" className="font-medium cursor-pointer">
                AI Monitoring & Proctoring
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                I consent to real-time AI monitoring including face detection, attention tracking, and environment
                verification during this exam.
              </p>
            </div>
          </div>

          {/* Recording Consent */}
          <div className="flex gap-3 border-b border-border pb-4">
            <Checkbox
              id="recording"
              checked={consents.recording}
              onCheckedChange={() => handleConsent("recording")}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="recording" className="font-medium cursor-pointer">
                Session Recording
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                I consent to the recording of my webcam feed, screen activity, and audio for exam integrity verification
                and dispute resolution.
              </p>
            </div>
          </div>

          {/* Policies Consent */}
          <div className="flex gap-3 border-b border-border pb-4">
            <Checkbox
              id="policies"
              checked={consents.policies}
              onCheckedChange={() => handleConsent("policies")}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="policies" className="font-medium cursor-pointer">
                Exam Policies & Code of Conduct
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                I have read and agree to comply with all exam policies, including prohibitions on cheating, unauthorized
                materials, and suspicious behavior.
              </p>
            </div>
          </div>

          {/* Integrity Consent */}
          <div className="flex gap-3">
            <Checkbox
              id="integrity"
              checked={consents.integrity}
              onCheckedChange={() => handleConsent("integrity")}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="integrity" className="font-medium cursor-pointer">
                Academic Integrity Acknowledgment
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                I acknowledge that any violation of exam integrity may result in disciplinary action, including exam
                cancellation and academic penalties.
              </p>
            </div>
          </div>
        </Card>

        {/* Info Box */}
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <p>
            Your privacy is important to us. All collected data will be handled according to our privacy policy and used
            solely for exam proctoring and integrity verification.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!allConsented || isLoading} 
            className="exam-button-primary flex-1"
          >
            {isLoading ? "Proceeding..." : "Continue to Section Selection"}
          </Button>
        </div>
        
        {/* Consent Status Message */}
        {!allConsented && (
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ⚠️ Please check all 4 consent boxes above to continue
            </p>
          </div>
        )}
        {allConsented && (
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ All consents accepted. You can now continue!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
