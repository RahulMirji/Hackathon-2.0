"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProctorAlerts } from "@/components/exam/proctor-alerts"
import { ConnectivityHandler } from "@/components/exam/connectivity-handler"
import { WarningHistory } from "@/components/exam/warning-history"

export default function AlertsPage() {
  const router = useRouter()

  return (
    <main className="exam-container min-h-screen">
      {/* Header */}
      <div className="exam-header sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exam Monitoring Dashboard</h1>
          <Button onClick={() => router.back()} variant="outline">
            Back to Exam
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Alerts */}
          <div className="lg:col-span-2">
            <ProctorAlerts />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ConnectivityHandler />
            <WarningHistory />
          </div>
        </div>
      </div>
    </main>
  )
}
