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

  const handleContinue = async () => {
    setIsLoading(true)
    
    // Request fullscreen mode
    try {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        // Safari
        await (elem as any).webkitRequestFullscreen()
      } else if ((elem as any).msRequestFullscreen) {
        // IE11
        await (elem as any).msRequestFullscreen()
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error)
      // Continue anyway even if fullscreen fails
    }
    
    // Navigate to sections page
    router.push("/exam/sections")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#1ba94c] flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Exam Terms & Consent</h1>
                <p className="text-sm text-gray-600">Review exam policies and provide your consent</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Step 3 of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Section - Monitoring & Security */}
          <Card className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-[#4355f9] flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-900">AI Monitoring & Security</h2>
                <p className="text-xs text-gray-600">Advanced proctoring technology</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <Camera className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 text-xs">Face Detection</h3>
                  <p className="text-xs text-blue-800">
                    Real-time face tracking during exam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                <Monitor className="h-3.5 w-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-purple-900 text-xs">Screen Monitoring</h3>
                  <p className="text-xs text-purple-800">
                    Screen activity recording
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                <Mic className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-900 text-xs">Audio Recording</h3>
                  <p className="text-xs text-green-800">
                    Audio monitoring for integrity
                  </p>
                </div>
              </div>

              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-0.5">
                  <Lock className="h-3 w-3 text-gray-600" />
                  <span className="font-medium text-gray-900 text-xs">Data Security</span>
                </div>
                <p className="text-xs text-gray-600">
                  Encrypted and secure storage
                </p>
              </div>
            </div>
          </Card>

          {/* Middle Section - Policies & Rules */}
          <Card className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-[#ff6b35] flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-900">Exam Policies & Rules</h2>
                <p className="text-xs text-gray-600">Important guidelines</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-900 mb-0.5 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  Prohibited Actions
                </h3>
                <p className="text-xs text-red-800">
                  No unauthorized materials, communication, or leaving camera view
                </p>
              </div>

              <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-900 mb-0.5 text-xs">Required Environment</h3>
                <p className="text-xs text-yellow-800">
                  Well-lit room, clear desk, stable internet, working camera/mic
                </p>
              </div>

              <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-medium text-orange-900 mb-0.5 text-xs">Consequences</h3>
                <p className="text-xs text-orange-800">
                  Violations may result in exam termination and disciplinary action
                </p>
              </div>
            </div>
          </Card>

          {/* Right Section - Privacy & Consent */}
          <Card className="bg-white p-4 shadow-sm border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-[#1ba94c] flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold text-gray-900">Privacy & Your Rights</h2>
                <p className="text-xs text-gray-600">Data handling protection</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="font-medium text-emerald-900 mb-0.5 text-xs">Data Protection</h3>
                <p className="text-xs text-emerald-800">
                  Encrypted, secure storage, deleted after 90 days
                </p>
              </div>

              <div className="p-2 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-medium text-teal-900 mb-0.5 text-xs">Limited Access</h3>
                <p className="text-xs text-teal-800">
                  Only authorized proctors can access recordings
                </p>
              </div>

              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-0.5 text-xs">Your Rights</h3>
                <p className="text-xs text-blue-800">
                  Request data access, corrections, or file complaints
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="final-consent"
                    checked={finalConsent}
                    onCheckedChange={(checked) => setFinalConsent(checked as boolean)}
                    className="mt-0.5 border-2 border-gray-300 data-[state=checked]:border-[#1ba94c] data-[state=checked]:bg-[#1ba94c]"
                  />
                  <div className="flex-1">
                    <label htmlFor="final-consent" className="font-semibold text-gray-900 cursor-pointer text-xs">
                      I acknowledge and consent to all exam terms
                    </label>
                    <p className="text-xs text-gray-600 mt-0.5">
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
            className="gap-2 h-10 px-5 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-semibold rounded-lg text-sm"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue} 
            disabled={!finalConsent || isLoading}
            style={{
              backgroundColor: finalConsent ? '#1ba94c' : 'white',
              color: finalConsent ? 'white' : '#111827',
              borderWidth: finalConsent ? '0' : '2px',
              borderColor: finalConsent ? 'transparent' : '#d1d5db'
            }}
            className="gap-2 h-10 px-7 font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
          >
            {isLoading ? "Processing..." : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
