"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  FileCheck,
  UserCheck,
  Clock
} from "lucide-react"

export default function VerificationConfirmationPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [autoRedirect, setAutoRedirect] = useState(true)

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (autoRedirect && countdown === 0) {
      router.push("/exam/consent")
    }
  }, [countdown, autoRedirect, router])

  const handleContinue = () => {
    router.push("/exam/consent")
  }

  const handleCancel = () => {
    setAutoRedirect(false)
  }

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Verification Submitted</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Your identity verification is being processed</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Step 2 of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="space-y-3">
          {/* Success Message Card */}
          <Card className="bg-white dark:bg-gray-800 p-4 shadow-lg border-2 border-green-200 dark:border-green-800">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Verification Documents Submitted Successfully
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Thank you for submitting your identity verification documents. We will review them shortly.
                </p>
              </div>

              {/* Verification Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Face Photo</p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Submitted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800">
                  <FileCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Government ID</p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Submitted</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Important Notice Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-3 shadow-lg border-2 border-amber-300 dark:border-amber-800">
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Important: Verification Policy
                </h3>
                <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  <p className="flex items-start gap-1.5">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span>We will verify your identity details before and during the exam.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span>If any information is found to be <strong>fake, fraudulent, or mismatched</strong>, you will be <strong>disqualified</strong> from the exam.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Your exam results <strong>will not be shown</strong> and <strong>will not be sent to you</strong> if verification fails.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <span>Any attempt to use someone else's identity or falsified documents will result in <strong>immediate disqualification</strong> and may have legal consequences.</span>
                  </p>
                </div>
                
                <div className="mt-2 p-2 bg-white/50 dark:bg-gray-900/30 rounded border border-amber-200 dark:border-amber-700">
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    By continuing, you acknowledge that you have submitted genuine documents and understand the consequences of providing false information.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Auto-redirect Notice */}
          {autoRedirect && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 p-2 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Auto-continuing in <strong className="text-blue-600 dark:text-blue-400">{countdown}</strong>s...
                  </p>
                </div>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-6 px-2"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <Button 
              onClick={() => router.back()} 
              variant="outline"
              className="gap-1 h-8 px-4 border-2 text-xs"
              size="sm"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              className="gap-1 h-8 px-5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="sm"
            >
              I Understand, Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}
