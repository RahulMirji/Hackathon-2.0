"use client"

import { useEffect, useState } from "react"
import { useExamSession } from "@/hooks/use-exam-session"
import { Card } from "@/components/ui/card"
import { Wifi, WifiOff } from "lucide-react"

export function RealTimeSync() {
  const { isConnected, sessionData, updateMonitoring } = useExamSession()
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced")

  useEffect(() => {
    // Simulate periodic monitoring updates
    const interval = setInterval(() => {
      if (isConnected) {
        setSyncStatus("syncing")
        updateMonitoring({
          faceDetections: Math.floor(Math.random() * 100),
          attentionWarnings: Math.floor(Math.random() * 5),
          connectionIssues: 0,
          deviceViolations: 0,
        })
        setTimeout(() => setSyncStatus("synced"), 500)
      } else {
        setSyncStatus("error")
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isConnected, updateMonitoring])

  return (
    <Card className="exam-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Real-time Sync</h3>
        {isConnected ? (
          <Wifi className="h-4 w-4 text-accent animate-pulse" />
        ) : (
          <WifiOff className="h-4 w-4 text-destructive" />
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Connection</span>
          <span className={isConnected ? "text-accent font-medium" : "text-destructive font-medium"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sync Status</span>
          <span className={`font-medium capitalize ${syncStatus === "error" ? "text-destructive" : "text-primary"}`}>
            {syncStatus}
          </span>
        </div>
        {sessionData && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID</span>
              <span className="font-mono text-xs">{sessionData.sessionId.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="capitalize font-medium">{sessionData.status}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
