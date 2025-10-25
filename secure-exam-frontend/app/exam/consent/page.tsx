"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Eye, 
  Camera, 
  FileText, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Monitor,
  Mic,
  UserCheck,
  Scale
} from "lucide-react"

export default function ConsentPage() {
  const router = useRouter()
  const [finalConsent, setFinalConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/exam/sections")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Terms & Consent</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Review exam policies and provide your consent</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Step 3 of 4
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Section - Monitoring & Security */}
          <Card className="p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Monitoring & Security</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Advanced proctoring technology</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Camera className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 text-sm">Face Detection</h3>
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      Real-time face tracking during exam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Monitor className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-purple-900 dark:text-purple-200 text-sm">Screen Monitoring</h3>
                    <p className="text-xs text-purple-800 dark:text-purple-300">
                      Screen activity recording
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Mic className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-900 dark:text-green-200 text-sm">Audio Recording</h3>
                    <p className="text-xs text-green-800 dark:text-green-300">
                      Audio monitoring for integrity
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-3 w-3 text-gray-600" />
                  <span className="font-medium text-gray-900 dark:text-white text-xs">Data Security</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Encrypted and secure storage
                </p>
              </div>
            </div>
          </Card>

          {/* Middle Section - Policies & Rules */}
          <Card className="p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Exam Policies & Rules</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Important guidelines</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-medium text-red-900 dark:text-red-200 mb-1 flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3" />
                    Prohibited Actions
                  </h3>
                  <p className="text-xs text-red-800 dark:text-red-300">
                    No unauthorized materials, communication, or leaving camera view
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-1 text-sm">Required Environment</h3>
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    Well-lit room, clear desk, stable internet, working camera/mic
                  </p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-medium text-orange-900 dark:text-orange-200 mb-1 text-sm">Consequences</h3>
                  <p className="text-xs text-orange-800 dark:text-orange-300">
                    Violations may result in exam termination and disciplinary action
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Section - Privacy & Consent */}
          <Card className="p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Privacy & Your Rights</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Data handling protection</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h3 className="font-medium text-emerald-900 dark:text-emerald-200 mb-1 text-sm">Data Protection</h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Encrypted, secure storage, deleted after 90 days
                  </p>
                </div>

                <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h3 className="font-medium text-teal-900 dark:text-teal-200 mb-1 text-sm">Limited Access</h3>
                  <p className="text-xs text-teal-800 dark:text-teal-300">
                    Only authorized proctors can access recordings
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1 text-sm">Your Rights</h3>
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    Request data access, corrections, or file complaints
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Checkbox
                    id="final-consent"
                    checked={finalConsent}
                    onCheckedChange={(checked) => setFinalConsent(checked as boolean)}
                    className="mt-1 border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                  />
                  <div className="flex-1">
                    <label htmlFor="final-consent" className="font-semibold text-gray-900 dark:text-white cursor-pointer text-sm">
                      I acknowledge and consent to all exam terms
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      I have read and agree to the monitoring, policies, and privacy terms outlined above. I understand the consequences of violations and consent to exam proctoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-between items-center">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="gap-2"
          >
            Back to ID Verification
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {finalConsent ? (
                <span className="text-green-600 font-medium">✓ Terms accepted</span>
              ) : (
                <span>Please accept the terms to continue</span>
              )}
            </div>
            <Button 
              onClick={handleContinue} 
              disabled={!finalConsent || isLoading}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isLoading ? "Processing..." : "Continue to Exam Sections"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
