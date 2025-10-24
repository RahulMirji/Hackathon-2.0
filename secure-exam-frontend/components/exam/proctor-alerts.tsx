"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, Eye, Wifi, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ProctorAlert {
  id: string
  type: "warning" | "critical" | "info"
  title: string
  message: string
  timestamp: Date
  icon: React.ReactNode
}

export function ProctorAlerts() {
  const [alerts, setAlerts] = useState<ProctorAlert[]>([])

  useEffect(() => {
    // Simulate proctor alerts
    const generateAlert = () => {
      const alertTypes = [
        {
          type: "warning" as const,
          title: "Face Not Detected",
          message: "Please ensure your face is visible to the camera",
          icon: <Eye className="h-5 w-5" />,
        },
        {
          type: "warning" as const,
          title: "Low Attention Score",
          message: "Your attention score has dropped below 60%. Please focus on the exam.",
          icon: <AlertTriangle className="h-5 w-5" />,
        },
        {
          type: "info" as const,
          title: "Connection Stable",
          message: "Your internet connection is stable",
          icon: <Wifi className="h-5 w-5" />,
        },
        {
          type: "critical" as const,
          title: "Multiple Faces Detected",
          message: "Only one person is allowed during the exam. Please ensure you are alone.",
          icon: <AlertCircle className="h-5 w-5" />,
        },
      ]

      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const newAlert: ProctorAlert = {
        id: Date.now().toString(),
        ...randomAlert,
        timestamp: new Date(),
      }

      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)])
    }

    // Generate alerts every 15 seconds for demo
    const interval = setInterval(generateAlert, 15000)

    return () => clearInterval(interval)
  }, [])

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "critical":
        return "border-destructive/50 bg-destructive/10 text-destructive"
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-600"
      case "info":
        return "border-accent/50 bg-accent/10 text-accent"
      default:
        return "border-border bg-card text-foreground"
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Proctor Alerts</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <p>No alerts at this time</p>
            <p className="text-xs">Your exam session is proceeding normally</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-3 border ${getAlertStyles(alert.type)} space-y-1 animate-in fade-in slide-in-from-top-2`}
            >
              <div className="flex items-start gap-2">
                {alert.icon}
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs opacity-90">{alert.message}</p>
                  <p className="text-xs opacity-60 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
