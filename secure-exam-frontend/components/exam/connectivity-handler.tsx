"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ConnectivityStatus {
  isOnline: boolean
  latency: number
  bandwidth: string
  lastChecked: Date
}

export function ConnectivityHandler() {
  const [status, setStatus] = useState<ConnectivityStatus>({
    isOnline: navigator.onLine,
    latency: 0,
    bandwidth: "Good",
    lastChecked: new Date(),
  })
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true, lastChecked: new Date() }))
      setShowWarning(false)
    }

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false, lastChecked: new Date() }))
      setShowWarning(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Simulate latency checks
    const latencyInterval = setInterval(() => {
      const latency = Math.floor(Math.random() * 100) + 10
      const bandwidth = latency < 50 ? "Excellent" : latency < 100 ? "Good" : "Poor"

      setStatus((prev) => ({
        ...prev,
        latency,
        bandwidth,
        lastChecked: new Date(),
      }))
    }, 5000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(latencyInterval)
    }
  }, [])

  return (
    <>
      {/* Connection Status Card */}
      <Card className="exam-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Connection Status</h3>
          {status.isOnline ? (
            <Wifi className="h-4 w-4 text-accent" />
          ) : (
            <WifiOff className="h-4 w-4 text-destructive" />
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={status.isOnline ? "text-accent font-medium" : "text-destructive font-medium"}>
              {status.isOnline ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency</span>
            <span className="font-mono">{status.latency}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bandwidth</span>
            <span className="font-medium">{status.bandwidth}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Last checked</span>
            <span>{status.lastChecked.toLocaleTimeString()}</span>
          </div>
        </div>
      </Card>

      {/* Offline Warning Modal */}
      {showWarning && !status.isOnline && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="exam-card max-w-md space-y-4 border-destructive/50 bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h2 className="font-bold text-lg text-destructive">Connection Lost</h2>
                <p className="text-sm text-destructive/90">
                  Your internet connection has been interrupted. The exam will be paused until your connection is
                  restored.
                </p>
                <p className="text-xs text-destructive/70 mt-3">
                  Please check your internet connection and try to reconnect. Your exam progress will be saved.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
